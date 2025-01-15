import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { WebClient } from '@slack/web-api';
dotenv.config();

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Slack WebClient
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health Check Route
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// Function to find user ID by email
const findSlackUserIdByEmail = async (email) => {
    try {
        const response = await slackClient.users.lookupByEmail({ email });
        return response.user?.id || null;
    } catch (error) {
        console.error(`Error finding Slack user by email (${email}):`, error.message);
        return null;
    }
};

// Function to send Slack notification with tagging
const sendSlackNotification = async (message, data, email) => {
    try {
        const emailToUse = email || "Unknown User";

        // Find the user by email
        const specificUserId = await findSlackUserIdByEmail(emailToUse);
        const taggedUser = specificUserId ? `<@${specificUserId}>` : emailToUse; // Use the email if user not found
        const defaultUserTag = `<@U05CXS0QAH1>`; // Replace with the default user ID
        const channelId = 'C088BL697AT'; // Replace with your channel ID

        // Construct the notification message dynamically
        let slackText = `New Request Submitted by ${taggedUser}.\ncc: ${defaultUserTag}\n`;

        if (data[0]?.flow_type === 'update-config') {
            const { pageName, changes, contact } = data[0]?.update_page_details || {};
            slackText += `Flow Type: update-config\n`;
        } else {
            slackText += `Flow Type: ${data[0]?.flow_type || 'N/A'}\n`;
            slackText += `Bespoke Option: ${data[0]?.bespoke_option || 'N/A'}\n`;
        }

        // Send the main message
        const slackMessage = {
            channel: channelId,
            text: slackText,
        };

        const slackResponse = await slackClient.chat.postMessage(slackMessage);

        // Add JSON data as a thread comment
        if (slackResponse.ts) {
            await slackClient.chat.postMessage({
                channel: slackResponse.channel,
                text: `\`\`\`${JSON.stringify(data, null, 2)}\`\`\``,
                thread_ts: slackResponse.ts,
            });
        }
    } catch (error) {
        if (error.message.includes('users_not_found')) {
            console.error(`The specified email (${email}) does not match any Slack user.`);
        } else if (error.message.includes('channel_not_found')) {
            console.error('The specified channel is not accessible by the bot.');
        } else {
            console.error('Error sending Slack notification:', error.message);
        }
    }
};

// Save user flow data to Supabase
app.post('/save-selections', async (req, res) => {
    try {
        const {
            flowType,
            briefRequest, // New field for brief request
            bespokeOption,
            agencyCounterInputs,
            landingPageSelection,
            tailoredQuestions,
            generalQuestions,
            updatePageDetails,
            submitted_at,
        } = req.body;

        // Data structure for insert
        let insertData = {
            flow_type: flowType,
            submitted_at: submitted_at || new Date().toISOString(),
        };

        if (flowType === 'bespoke-demo') {
            insertData.bespoke_option = bespokeOption;
            if (briefRequest) {
                insertData.brief_request = briefRequest; // Save brief request only for bespoke-demo
            }
            if (agencyCounterInputs) {
                insertData.agency_counter_inputs = agencyCounterInputs;
            }
            insertData.landing_page_selection = landingPageSelection || null;
            insertData.tailored_questions = tailoredQuestions || null;
            insertData.general_questions = generalQuestions || null;
        } else if (flowType === 'update-config') {
            insertData.update_page_details = updatePageDetails || null;
        }

        // Insert data into Supabase
        const { data: insertedData, error } = await supabase
            .from('user_flows')
            .insert(insertData)
            .select('*');

        if (error) throw error;

        // Rearrange fields in the response JSON
        const cleanedData = insertedData.map((row) => ({
            id: row.id,
            flow_type: row.flow_type,
            bespoke_option: row.bespoke_option,
            agency_counter_inputs: row.agency_counter_inputs
                ? {
                      ...row.agency_counter_inputs,
                      users: row.agency_counter_inputs.users?.map((user) => ({
                          firstName: user.firstName,
                          lastName: user.lastName,
                          email: user.email,
                      })),
                  }
                : null,
            landing_page_selection: row.landing_page_selection,
            brief_request: flowType === 'bespoke-demo' ? row.brief_request || null : null,
            tailored_questions: typeof row.tailored_questions === 'string'
                ? JSON.parse(row.tailored_questions)
                : row.tailored_questions,
            general_questions: row.general_questions
                ? {
                      website: row.general_questions.website || "",
                      rpn: row.general_questions.rpn || "no",
                      rpnInput: row.general_questions.rpnInput || null,
                      carriers: row.general_questions.carriers || "",
                      additionalInfo: row.general_questions.additionalInfo || "",
                      contact: row.general_questions.contact || "",
                  }
                : {
                      website: "",
                      rpn: "no",
                      rpnInput: null,
                      carriers: "",
                      additionalInfo: "",
                      contact: "",
                  },
            update_page_details: row.update_page_details,
            submitted_at: row.submitted_at,
        }));

        // Send Slack notification
        const slackMessage = `
Flow Type: ${flowType}
${flowType === 'bespoke-demo' ? `Brief Request: ${briefRequest || 'N/A'}` : ''}
Bespoke Option: ${bespokeOption || 'N/A'}
        `;
        await sendSlackNotification(
            slackMessage,
            cleanedData,
            updatePageDetails?.contact || generalQuestions?.contact
        );

        res.status(200).json(cleanedData);
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Error saving data', error });
    }
});


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Fetch flows with optional filters
app.get('/get-flows', async (req, res) => {
    try {
        const { key, value, email, startDate, endDate, specificDate } = req.query;

        let query = supabase.from('user_flows').select('*');

        // Filter by JSONB key-value pair
        if (key && value) {
            query = query.filter(`tailored_questions->>${key}`, 'eq', value);
        }

        // Filter by email
        if (email) {
            query = query.filter('general_questions->>contact', 'eq', email);
        }

        // Filter by date range
        if (startDate && endDate) {
            query = query.gte('submitted_at', startDate).lte('submitted_at', endDate);
        } else if (startDate) {
            query = query.gte('submitted_at', startDate);
        } else if (endDate) {
            query = query.lte('submitted_at', endDate);
        }

        // Filter by specific date
        if (specificDate) {
            query = query.filter('submitted_at', 'gte', `${specificDate}T00:00:00`)
                         .filter('submitted_at', 'lt', `${specificDate}T23:59:59`);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Parse JSONB fields
        const cleanedData = insertedData.map((row) => ({
            id: row.id,
            flow_type: row.flow_type,
            bespoke_option: row.bespoke_option,
            agency_counter_inputs: typeof row.agency_counter_inputs === 'string'
                ? JSON.parse(row.agency_counter_inputs)
                : row.agency_counter_inputs,
            landing_page_selection: row.landing_page_selection,
            tailored_questions: typeof row.tailored_questions === 'string'
                ? JSON.parse(row.tailored_questions)
                : row.tailored_questions,
            general_questions: typeof row.general_questions === 'string'
                ? JSON.parse(row.general_questions)
                : row.general_questions,
            update_page_details: row.update_page_details,
            submitted_at: row.submitted_at,
        }));        

        res.status(200).json(cleanedData);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
});