const optionsData = [
    { id: "option1", src: "opt1.png", alt: "Standard" },
    { id: "option2", src: "opt2.png", alt: "Airport" },
    { id: "option3", src: "opt3.png", alt: "Day pass" }
];

const scenarios = [
    { id: "scenario1", leftImage: "10.png", rightImage: "11.png" },
    { id: "scenario2", leftImage: "image6.png", rightImage: "image7.png" },
    { id: "scenario3", leftImage: "image8.png", rightImage: "image9.png" },
    { id: "scenario4", leftImage: "image5.png", rightImage: "image6.png" },
    { id: "scenario5", leftImage: "12.png", rightImage: "13.png" },
    { id: "scenario6", leftImage: "14.gif", rightImage: "15.gif" }
    // Add other scenarios here
];

const optionsContainer = document.getElementById('options');
const dynamicGrid = document.getElementById('dynamicGrid');
const selectedOptionInput = document.getElementById('selectedOption');
const selectedImages = {}; // To track selections for scenarios

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
        document.querySelectorAll('.option img').forEach(img => img.classList.remove('selected'));
        col.querySelector('img').classList.add('selected');
        selectedOptionInput.value = option.id;
    });
});

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

    row.querySelectorAll('.option img').forEach(img => {
        img.addEventListener('click', () => {
            const side = img.parentElement.dataset.side;
            const scenarioId = img.parentElement.dataset.scenario;

            document
                .querySelectorAll(`.option[data-scenario="${scenarioId}"][data-side="${side}"] img`)
                .forEach(image => image.classList.remove('selected'));

            img.classList.add('selected');
            selectedImages[scenarioId] = {
                ...selectedImages[scenarioId],
                [side]: img.src
            };
        });
    });

    const switchElement = row.querySelector(`#switch-${scenario.id}`);
    const labelSpan = row.querySelector(`#switch-${scenario.id} + label span`);

    switchElement.addEventListener('change', () => {
        labelSpan.textContent = switchElement.checked ? 'Left' : 'Right';
    });
});

document.getElementById('selectionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const scenarioResults = scenarios.map((scenario, index) => {
        const switchElement = document.getElementById(`switch-${scenario.id}`);
        return {
            switch_status: switchElement.checked ? 'LEFT' : 'RIGHT', // Map the toggle state
        };
    });

    const data = {
        selected_option: selectedOptionInput.value,
        scenarios: scenarioResults, // Pass only the states
    };

    try {
        const response = await fetch('http://localhost:3000/save-selections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Failed to save data');
        alert('Data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data. Check console for details.');
    }
});