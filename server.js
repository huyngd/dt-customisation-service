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
            flowType, // 'standard-demo', 'bespoke-demo', or 'update-config'
            landingPageSelection,
            tailoredQuestions,
            generalQuestions,
            updatePageDetails
        } = req.body;

        // Data structure for insert
        let insertData = {
            flow_type: flowType,
            submitted_at: new Date().toISOString()
        };

        // Capture flow-specific data
        if (flowType === 'bespoke-demo') {
            insertData.landing_page_selection = landingPageSelection || null;
            insertData.tailored_questions = JSON.stringify(tailoredQuestions) || null;
            insertData.general_questions = JSON.stringify(generalQuestions) || null;
        } else if (flowType === 'update-config') {
            insertData.update_page_details = JSON.stringify(updatePageDetails) || null;
        }

        // Insert data into Supabase
        const { error } = await supabase.from('user_flows').insert(insertData);

        if (error) throw error;

        res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Error saving data', error });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
