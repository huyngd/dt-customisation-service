// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = 'https://kwniegzuziterfmqjrgh.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3bmllZ3p1eml0ZXJmbXFqcmdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NTUzMTksImV4cCI6MjA1MDQzMTMxOX0.ffi2i653AoqbWhhqcmB2XezRGzkhSFluKWv8d1vApFo'; // Replace with your public anon key
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health Check Route
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// Save user selections to Supabase
app.post('/save-selections', async (req, res) => {
    try {
        const { selected_option, scenarios } = req.body;

        // Transform scenarios into the desired structure
        const scenarioStates = {};
        scenarios.forEach((scenario, index) => {
            scenarioStates[`scenario${index + 1}`] = scenario.switch_status; // "ON" or "OFF"
        });

        // Insert into the database
        const { error } = await supabase
            .from('user_inputs')
            .insert({
                selected_option: selected_option,
                ...scenarioStates,
                submitted_at: new Date().toISOString(),
            });

        if (error) throw error;

        res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Error saving data', error });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});