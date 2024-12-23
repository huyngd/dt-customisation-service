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
        const { selected_option, searchBar, tripTime, returnTrip, passengerType, fareClasses, seatSelection } = req.body;

        // Insert into the database with meaningful columns
        const { error } = await supabase
            .from('user_inputs')
            .insert({
                pageSelection: selected_option, // A, B, or C
                searchBar: searchBar,            // "A" or "B"
                tripTime: tripTime,              // "A" or "B"
                returnTrip: returnTrip,          // "A" or "B"
                passengerType: passengerType,    // "A" or "B"
                fareClasses: fareClasses,        // "A" or "B"
                seatSelection: seatSelection,    // "A" or "B"
                submittedAt: new Date().toISOString(), // Current timestamp
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
