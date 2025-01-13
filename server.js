import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health Check Route
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// Save user flow data to Supabase
app.post('/save-selections', async (req, res) => {
    try {
        const {
            flowType,
            bespokeOption,
            agencyCounterInputs,
            landingPageSelection,
            tailoredQuestions,
            generalQuestions,
            updatePageDetails,
            submitted_at
        } = req.body;

        // Data structure for insert
        let insertData = {
            flow_type: flowType,
            submitted_at: submitted_at || new Date().toISOString(),
        };

        // Directly insert JSONB fields without stringification
        if (flowType === 'bespoke-demo') {
            insertData.bespoke_option = bespokeOption;
            if (agencyCounterInputs) {
                insertData.agency_counter_inputs = agencyCounterInputs; // Keep as JSON
            }
            insertData.landing_page_selection = landingPageSelection || null;
            insertData.tailored_questions = tailoredQuestions || null; // Keep as JSON
            insertData.general_questions = generalQuestions || null; // Keep as JSON
        } else if (flowType === 'update-config') {
            insertData.update_page_details = updatePageDetails || null; // Keep as JSON
        }

        // Insert data into Supabase
        const { data: insertedData, error } = await supabase
            .from('user_flows')
            .insert(insertData)
            .select('*'); // Fetch the inserted record(s)

        if (error) throw error;

        // Parse JSONB fields before returning
        const cleanedData = insertedData.map(row => ({
            ...row,
            agency_counter_inputs: typeof row.agency_counter_inputs === 'string'
                ? JSON.parse(row.agency_counter_inputs)
                : row.agency_counter_inputs,
            tailored_questions: typeof row.tailored_questions === 'string'
                ? JSON.parse(row.tailored_questions)
                : row.tailored_questions,
            general_questions: typeof row.general_questions === 'string'
                ? JSON.parse(row.general_questions)
                : row.general_questions,
        }));

        res.status(200).json(cleanedData);

    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Error saving data', error });
    }
});

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
        const cleanedData = data.map(row => ({
            ...row,
            tailored_questions: typeof row.tailored_questions === 'string'
                ? JSON.parse(row.tailored_questions)
                : row.tailored_questions,
            general_questions: typeof row.general_questions === 'string'
                ? JSON.parse(row.general_questions)
                : row.general_questions,
        }));

        res.status(200).json(cleanedData);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
