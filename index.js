// Image options (replace URLs with actual image paths)
const optionsData = [
    { id: "option1", src: "opt1.png", alt: "Standard" },
    { id: "option2", src: "opt2.png", alt: "Airport" },
    { id: "option3", src: "opt3.png", alt: "Day pass" }
];

// New scenarios (for 3-column grid with switches)
const scenarios = [
    { id: "scenario1", leftImage: "10.png", rightImage: "11.png" },
    { id: "scenario2", leftImage: "image6.png", rightImage: "image7.png" },
    { id: "scenario3", leftImage: "image8.png", rightImage: "image9.png" },
    { id: "scenario4", leftImage: "image5.png", rightImage: "image6.png" },
    { id: "scenario5", leftImage: "12.png", rightImage: "13.png" },
    { id: "scenario6", leftImage: "14.gif", rightImage: "15.gif" }

];

const optionsContainer = document.getElementById('options');
const dynamicGrid = document.getElementById('dynamicGrid');
const selectedOptionInput = document.getElementById('selectedOption');
const selectedImages = {}; // To track selections for scenarios

// Populate image options (existing functionality)
optionsData.forEach(option => {
    const col = document.createElement('div');
    col.className = 'col-md-3 text-center option';
    col.dataset.value = option.id;

    col.innerHTML = `
        <img src="${option.src}" alt="${option.alt}" class="img-fluid">
        <p>${option.alt}</p>
    `;

    optionsContainer.appendChild(col);

    col.querySelector('img').addEventListener('click', () => {
        // Deselect other images
        document.querySelectorAll('.option img').forEach(img => img.classList.remove('selected'));
        // Highlight selected image
        col.querySelector('img').classList.add('selected');
        // Update hidden input
        selectedOptionInput.value = option.id;
    });
});

// Populate dynamic grid for 3-column layout
scenarios.forEach((scenario, index) => {
    const row = document.createElement('div');
    row.className = 'row align-items-center mb-3';

    row.innerHTML = `
        <div class="col-md-4 text-center option" data-scenario="${scenario.id}" data-side="left">
            <img src="${scenario.leftImage}" alt="Left Image ${index + 1}" class="img-fluid">
        </div>
        <div class="col-md-4 switch-container">
            <input type="checkbox" id="switch-${scenario.id}" class="form-check-input" checked>
            <label for="switch-${scenario.id}">
                <span>Left</span>
            </label>
        </div>
        <div class="col-md-4 text-center option" data-scenario="${scenario.id}" data-side="right">
            <img src="${scenario.rightImage}" alt="Right Image ${index + 1}" class="img-fluid">
        </div>
    `;

    dynamicGrid.appendChild(row);

    // Image selection logic for left and right images
    row.querySelectorAll('.option img').forEach((img) => {
        img.addEventListener('click', () => {
            const side = img.parentElement.dataset.side;
            const scenarioId = img.parentElement.dataset.scenario;

            // Deselect other images in the same side
            document
                .querySelectorAll(`.option[data-scenario="${scenarioId}"][data-side="${side}"] img`)
                .forEach((image) => image.classList.remove('selected'));

            // Highlight selected image
            img.classList.add('selected');
            selectedImages[scenarioId] = {
                ...selectedImages[scenarioId],
                [side]: img.src
            };
        });
    });

    const switchElement = row.querySelector(`#switch-${scenario.id}`);
    const labelSpan = row.querySelector(`#switch-${scenario.id} + label span`);

    // Toggle text inside the switch
    switchElement.addEventListener('change', () => {
        labelSpan.textContent = switchElement.checked ? 'Left' : 'Right';
    });
});

// Add double-click zoom functionality for images
document.querySelectorAll('.option img').forEach((img) => {
    img.addEventListener('dblclick', (e) => {
        img.classList.toggle('zoomed');
        e.stopPropagation(); // Prevent immediate zoom-out
    });
});

// Add a global click event listener to exit zoom
document.addEventListener('click', () => {
    document.querySelectorAll('.option img.zoomed').forEach((zoomedImg) => {
        zoomedImg.classList.remove('zoomed');
    });
});

// Form submission
document.getElementById('selectionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect data
    const scenarioResults = scenarios.map((scenario) => {
        const switchElement = document.getElementById(`switch-${scenario.id}`);
        return {
            scenario_id: scenario.id,
            switch_status: switchElement.checked ? 'ON' : 'OFF',
            left_image: selectedImages[scenario.id]?.left || 'None',
            right_image: selectedImages[scenario.id]?.right || 'None'
        };
    });

    const data = {
        selected_option: selectedOptionInput.value, // From existing image selection
        scenarios: scenarioResults
    };

    // Insert data into Supabase
    try {
        // Save selected option
        const { data: optionData, error: optionError } = await supabase
            .from('user_inputs')
            .insert({ 
                selected_option: data.selected_option,
                submitted_at: new Date().toISOString() // Add timestamp
            });

        if (optionError) throw optionError;

        // Save scenarios
        for (const scenario of scenarioResults) {
            const { error: scenarioError } = await supabase
                .from('user_inputs')
                .insert(scenario);
            if (scenarioError) throw scenarioError;
        }

        alert('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data. Check console for details.');
    }
});


const supabaseUrl = 'https://kwniegzuziterfmqjrgh.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
