const optionsData = [
    { id: "A", src: "images/opt1.png", alt: "A" },
    { id: "B", src: "images/opt2.png", alt: "B" },
    { id: "C", src: "images/opt3.png", alt: "C" }
];

const scenarios = [
    { id: "scenario1", leftImage: "images/10.png", rightImage: "images/11.png", key: "searchBar" },
    { id: "scenario2", leftImage: "images/image6.png", rightImage: "images/image7.png", key: "tripTime" },
    { id: "scenario3", leftImage: "images/image8.png", rightImage: "images/image9.png", key: "returnTrip" },
    { id: "scenario4", leftImage: "images/image5.png", rightImage: "images/image6.png", key: "passengerType" },
    { id: "scenario5", leftImage: "images/12.png", rightImage: "images/13.png", key: "fareClasses" },
    { id: "scenario6", leftImage: "images/14.gif", rightImage: "images/15.gif", key: "seatSelection" }
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
        selectedOptionInput.value = option.id; // Store A, B, or C
    });
});

scenarios.forEach((scenario, index) => {
    const row = document.createElement('div');
    row.className = 'row align-items-center mb-3';

    row.innerHTML = `
        <div class="col-md-4 text-center option" data-scenario="${scenario.id}" data-side="left">
            <img src="${scenario.leftImage}" alt="Image A ${index + 1}" class="img-fluid">
            <p>A</p>
        </div>
        <div class="col-md-4 switch-container">
            <input type="checkbox" id="switch-${scenario.id}" class="form-check-input" checked>
            <label for="switch-${scenario.id}">
                <span>A</span>
            </label>
        </div>
        <div class="col-md-4 text-center option" data-scenario="${scenario.id}" data-side="right">
            <img src="${scenario.rightImage}" alt="Image B ${index + 1}" class="img-fluid">
            <p>B</p>
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
        labelSpan.textContent = switchElement.checked ? 'A' : 'B';
    });
});

document.getElementById('selectionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Map scenario results to meaningful keys
    const scenarioResults = scenarios.reduce((acc, scenario) => {
        const switchElement = document.getElementById(`switch-${scenario.id}`);
        acc[scenario.key] = switchElement.checked ? 'A' : 'B'; // Map the toggle state to meaningful keys
        return acc;
    }, {});

    const data = {
        selected_option: selectedOptionInput.value, // A, B, or C
        ...scenarioResults, // Spread the meaningful scenario results
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
