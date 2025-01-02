const optionsData = [
    { id: "A", src: "images/opt1.png", alt: "A. Standard WL page" },
    { id: "B", src: "images/opt2.png", alt: "B. Airport transfers page" },
    { id: "C", src: "images/opt3.png", alt: "C. Public transportation page" }
];

const scenarios = [
    { id: "scenario1", leftImage: "images/10.png", rightImage: "images/11.png", key: "searchBar", leftDescription: "Row search bar", rightDescription: "Column search bar"},
    { id: "scenario2", leftImage: "images/image6.png", rightImage: "images/image7.png", key: "tripTime", leftDescription: "Trip time enabled", rightDescription: "Trip time disabled"},
    { id: "scenario3", leftImage: "images/image8.png", rightImage: "images/image9.png", key: "returnTrip", leftDescription: "Return trip enabled", rightDescription: "Return trip disabled"},
    { id: "scenario4", leftImage: "images/image5.png", rightImage: "images/image6.png", key: "passengerType", leftDescription: "Passenger type enabled", rightDescription: "Passenger type disabled"},
    { id: "scenario5", leftImage: "images/12.png", rightImage: "images/13.png", key: "fareClasses", leftDescription: "Fare classes displayed on search results", rightDescription: "Fare classes displayed at checkout"},
    { id: "scenario6", leftImage: "images/14.gif", rightImage: "images/15.gif", key: "seatSelection", leftDescription: "Seat selection displayed on search results", rightDescription: "Seat selection displayed at checkout"}
];

const optionsContainer = document.getElementById('options');
const dynamicGrid = document.getElementById('dynamicGrid');
const selectedOptionInput = document.getElementById('selectedOption');
const selectedImages = {}; // To track selections for scenarios

// History stack to track navigation
const historyStack = [];

// Function to render Purpose Selection (Initial Question)
function renderPurposeSelection() {
    historyStack.push(() => renderPurposeSelection());
    const container = document.getElementById('dynamicForm');
    container.innerHTML = `
        <h3>Could you tell me what you're looking for?</h3>
        <div class="row">
            <div class="col-md-4">
                <button class="btn btn-outline-primary w-100" data-purpose="standard-demo">
                    a standard demo page for pitching
                </button>
            </div>
            <div class="col-md-4">
                <button class="btn btn-outline-primary w-100" data-purpose="bespoke-demo">
                    a bespoke demo page for pitching
                </button>
            </div>
            <div class="col-md-4">
                <button class="btn btn-outline-primary w-100" data-purpose="update-config">
                   changes of a production page
                </button>
            </div>
        </div>
    `;

    const buttons = container.querySelectorAll('button[data-purpose]');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedPurpose = event.target.dataset.purpose;
            moveToNextModule(selectedPurpose);
        });
    });
}

// Function to move to the next module
function moveToNextModule(selectedPurpose) {
    if (selectedPurpose === 'standard-demo') {
        renderStandardDemo();
    } else if (selectedPurpose === 'update-config') {
        renderUpdateConfigurationForm();
    } else if (selectedPurpose === 'bespoke-demo') {
        renderBespokeDemoOptions();
    }
}

// Render Standard Demo Page
function renderStandardDemo() {
    historyStack.push(() => renderStandardDemo());
    const container = document.getElementById('dynamicForm');
    container.innerHTML = `
        <h3>Great choice!</h3>
        <p>
            Please check it out <a href="https://docs.google.com/spreadsheets/d/1c3CntR5STeQHUioqcVJrOkv3mPI73YFOjgB1mdqfeZw/edit?gid=0#gid=0" target="_blank">here</a>.
        </p>
        <button class="btn btn-secondary mt-3" id="backButton">Back</button>
    `;

    document.getElementById('backButton').addEventListener('click', goBack);
}

// Render Bespoke Demo Options
function renderBespokeDemoOptions() {
    historyStack.push(() => renderBespokeDemoOptions());
    const container = document.getElementById('dynamicForm');
    container.innerHTML = `
        <h3>What are you going to use it for?</h3>
        <div class="row">
            <div class="col-md-4">
                <button class="btn btn-outline-primary w-100" data-option="Carrier WL">Carrier WL</button>
            </div>
            <div class="col-md-4">
                <button class="btn btn-outline-primary w-100" data-option="OTA WL">OTA WL</button>
            </div>
            <div class="col-md-4">
                <button class="btn btn-outline-primary w-100" data-option="Carrier OTA WL">Carrier OTA WL</button>
            </div>
            <div class="col-md-4">
                <button class="btn btn-outline-primary w-100" data-option="S2B WL">S2B WL</button>
            </div>
            <div class="col-md-4">
                <button class="btn btn-outline-primary w-100" data-option="Agency counter WL">Agency counter WL</button>
            </div>
        </div>
        <button class="btn btn-secondary mt-3" id="backButton">Back</button>
    `;

    const buttons = container.querySelectorAll('button[data-option]');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedOption = event.target.dataset.option;
            renderLandingPageSelection(selectedOption); // Call Landing Page Module
        });
    });

    document.getElementById('backButton').addEventListener('click', goBack);
}


// Render Update Configuration Form
function renderUpdateConfigurationForm() {
    historyStack.push(() => renderUpdateConfigurationForm());
    const container = document.getElementById('dynamicForm');
    container.innerHTML = `
        <h3>Update a Production Page</h3>
        <form id="updateForm">
            <div class="mb-3">
                <label for="pageName" class="form-label">Which page is it?</label>
                <input type="text" class="form-control" id="pageName" placeholder="Enter page URL" required>
            </div>
            <div class="mb-3">
                <label for="changes" class="form-label">What changes do you want to make?</label>
                <textarea class="form-control" id="changes" rows="4" placeholder="Describe the changes" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
        <button class="btn btn-secondary mt-3" id="backButton">Back</button>
    `;

    document.getElementById('backButton').addEventListener('click', goBack);
}

// Render Landing Page Selection
function renderLandingPageSelection() {
    historyStack.push(() => renderLandingPageSelection());
    const container = document.getElementById('dynamicForm');

    // Use optionsData to render the landing page options
    container.innerHTML = `
        <h3>What kind of landing page are you looking for?</h3>
        <div class="row">
            ${optionsData
                .map(
                    (option) => `
                <div class="col-md-4 text-center">
                    <img src="${option.src}" alt="${option.alt}" class="img-fluid option-img" data-value="${option.id}">
                    <p>${option.alt}</p>
                </div>
            `
                )
                .join('')}
        </div>
        <button class="btn btn-primary mt-3" id="nextButton" disabled>Next</button>
        <button class="btn btn-secondary mt-3" id="backButton">Back</button>
    `;

    // Handle option selection
    let selectedOption = null;
    document.querySelectorAll('.option-img').forEach((img) => {
        img.addEventListener('click', () => {
            document.querySelectorAll('.option-img').forEach((img) => img.classList.remove('selected'));
            img.classList.add('selected');
            selectedOption = img.dataset.value; // Capture selected option
            document.getElementById('nextButton').disabled = false; // Enable Next button
        });
    });

    // Handle Next button
    document.getElementById('nextButton').addEventListener('click', () => {
        if (selectedOption) {
            renderTailoredQuestions(selectedOption); // Proceed with tailored questions
        }
    });

    // Handle Back button
    document.getElementById('backButton').addEventListener('click', goBack);
}

// Tailored Questions
function renderTailoredQuestions(selectedLandingPage) {
    historyStack.push(() => renderTailoredQuestions(selectedLandingPage));
    const container = document.getElementById('dynamicForm');

    let questionsHTML = '';
    switch (selectedLandingPage) {
        case 'A': // Standard
            questionsHTML = `
                <div class="mb-3">
                    <label for="standard-feature" class="form-label">Provide any additional notes for the standard page:</label>
                    <textarea class="form-control" id="standard-feature" placeholder="Add any notes or features"></textarea>
                </div>
            `;
            break;
        case 'B': // Airport Transfer
            questionsHTML = `
                <div class="mb-3">
                    <label for="airport-notes" class="form-label">Provide any additional notes for the airport transfer page:</label>
                    <textarea class="form-control" id="airport-notes" placeholder="Add any notes or features"></textarea>
                </div>
            `;
            break;
        case 'C': // Public Transportation
            questionsHTML = `
                <div class="mb-3">
                    <label for="public-area" class="form-label">Provide any additional notes for the public transportation page:</label>
                    <textarea class="form-control" id="public-area" placeholder="Add any notes or features"></textarea>
                </div>
            `;
            break;
        default:
            questionsHTML = `<p>No tailored questions available for this option.</p>`;
    }

    const scenariosHTML = scenarios
        .map(
            (scenario, index) => `
        <div class="rounded p-3 mb-3" style="border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <h5 class="mb-3">${scenario.key.replace(/([A-Z])/g, '$1').trim()}</h5>
            <div class="row align-items-center">
                <div class="col-md-4 text-center">
                    <img src="${scenario.leftImage}" alt="Scenario Left ${index + 1}" class="img-fluid scenario-img" data-scenario="${scenario.id}" data-side="left">
                    <p><strong>A:</strong> ${scenario.leftDescription}</p>
                </div>
                <div class="col-md-4 switch-container text-center">
                    <input type="checkbox" id="switch-${scenario.id}" class="form-check-input" checked>
                    <label for="switch-${scenario.id}" class="d-block">
                        <span>A</span>
                    </label>
                </div>
                <div class="col-md-4 text-center">
                    <img src="${scenario.rightImage}" alt="Scenario Right ${index + 1}" class="img-fluid scenario-img" data-scenario="${scenario.id}" data-side="right">
                    <p><strong>B:</strong> ${scenario.rightDescription}</p>
                </div>
            </div>
        </div>
    `
        )
        .join('');

    container.innerHTML = `
        <h4>Functionalities Selection</h4>
        <div id="dynamicGrid">
            ${scenariosHTML}
        </div>

        <h4>Additional notes</h4>
        ${questionsHTML}

        <button class="btn btn-primary mt-3" id="nextButton">Next</button>
        <button class="btn btn-secondary mt-3" id="backButton">Back</button>
    `;

    // Handle Back button
    document.getElementById('backButton').addEventListener('click', goBack);

    // Handle Next button
    document.getElementById('nextButton').addEventListener('click', () => {
        renderGeneralQuestions(); // Proceed to General Questions
    });

    // Handle scenario interactions
    document.querySelectorAll('.scenario-img').forEach((img) => {
        img.addEventListener('click', () => {
            const scenarioId = img.dataset.scenario;
            const side = img.dataset.side;

            document
                .querySelectorAll(`.scenario-img[data-scenario="${scenarioId}"][data-side="${side}"]`)
                .forEach((image) => image.classList.remove('selected'));

            img.classList.add('selected');
            selectedImages[scenarioId] = {
                ...selectedImages[scenarioId],
                [side]: img.src,
            };
        });
    });

    // Handle toggle switches
    document.querySelectorAll('.switch-container input').forEach((switchElement) => {
        const labelSpan = switchElement.nextElementSibling.querySelector('span');
        switchElement.addEventListener('change', () => {
            labelSpan.textContent = switchElement.checked ? 'A' : 'B';
        });
    });
}



// Render General Questions
function renderGeneralQuestions() {
    historyStack.push(() => renderGeneralQuestions());
    const container = document.getElementById('dynamicForm');

    // Ensure container is left-aligned
    container.style.textAlign = "left";

    container.innerHTML = `
        <h3 class="text-left">General Questions</h3>
        <form id="generalForm">
            <div class="mb-3">
                <label for="website" class="form-label">Website for look & feel reference:</label>
                <input type="url" class="form-control" id="website" name="website" placeholder="Enter URL" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Do you have an existing RPN?</label>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="rpn" id="rpnYes" value="yes" required>
                    <label class="form-check-label" for="rpnYes">Yes</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="rpn" id="rpnNo" value="no">
                    <label class="form-check-label" for="rpnNo">No</label>
                </div>
                <input type="text" class="form-control mt-2" id="rpnInput" name="rpnInput" placeholder="Enter RPN" style="display: none;">
            </div>
            <div class="mb-3">
                <label for="carriers" class="form-label">Which carriers do you want to whitelist?</label>
                <input type="text" class="form-control" id="carriers" name="carriers" placeholder="Enter carrier codes" required>
            </div>
            <div class="mb-3">
                <label for="additionalInfo" class="form-label">Anything else we need to know about your request?</label>
                <textarea class="form-control" id="additionalInfo" name="additionalInfo" rows="4" placeholder="Enter details"></textarea>
            </div>
            <div class="mb-3">
                <label for="contact" class="form-label">How can we contact you?</label>
                <input type="email" class="form-control" id="contact" name="contact" placeholder="Enter email address" required>
            </div>
            <button type="submit" class="btn btn-primary mt-3">Submit</button>
        </form>
        <button class="btn btn-secondary mt-3" id="backButton">Back</button>
    `;

    // Conditional input for RPN
    const rpnYes = document.getElementById('rpnYes');
    const rpnNo = document.getElementById('rpnNo');
    const rpnInput = document.getElementById('rpnInput');

    rpnYes.addEventListener('change', () => {
        rpnInput.style.display = 'block';
    });

    rpnNo.addEventListener('change', () => {
        rpnInput.style.display = 'none';
    });

    // Handle Back button
    document.getElementById('backButton').addEventListener('click', goBack);

    // Handle form submission with validation
    document.getElementById('generalForm').addEventListener('submit', (event) => {
        event.preventDefault();

        // Validate the RPN field
        const rpnField = document.querySelector('input[name="rpn"]:checked');
        if (!rpnField) {
            alert("Please select an option for 'Do you have an existing RPN?'");
            return;
        }

        const data = {
            website: document.getElementById('website').value,
            rpn: rpnField.value,
            rpnInput: rpnField.value === 'yes' ? document.getElementById('rpnInput').value : null,
            carriers: document.getElementById('carriers').value,
            additionalInfo: document.getElementById('additionalInfo').value,
            contact: document.getElementById('contact').value,
        };

        console.log('General Questions Data:', data);
        alert('Form submitted successfully!');
    });
}

// Go Back Function
function goBack() {
    historyStack.pop(); // Remove current step
    const previousStep = historyStack.pop(); // Get last step to render
    if (previousStep) {
        previousStep(); // Call the previous rendering function
    } else {
        console.error('History stack is empty. Cannot navigate back.');
    }
}


// Initialize on DOM load
document.addEventListener('DOMContentLoaded', renderPurposeSelection);

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

// Function to enable double-click zoom for dynamically added images
function enableDynamicImageZoom() {
    // Attach the event listener to the document or a parent container
    const parentContainer = document.getElementById('dynamicForm'); // Adjust as needed
    if (!parentContainer) {
        console.error('Parent container for img-fluid not found.');
        return;
    }

    parentContainer.addEventListener('dblclick', (event) => {
        const image = event.target; // Check if the clicked target is an img-fluid
        if (image.classList.contains('img-fluid')) {
            // Create the overlay
            const overlay = document.createElement('div');
            overlay.className = 'image-zoom-overlay';

            // Create the zoomed image
            const zoomedImage = document.createElement('img');
            zoomedImage.src = image.src; // Use the same source as the clicked image
            zoomedImage.alt = image.alt;

            // Create the close button
            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.innerText = 'Close';
            closeButton.addEventListener('click', () => {
                overlay.remove(); // Remove the overlay on close
            });

            // Append elements to the overlay
            overlay.appendChild(zoomedImage);
            overlay.appendChild(closeButton);

            // Append the overlay to the body
            document.body.appendChild(overlay);

            // Close the overlay on click outside the image
            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) {
                    overlay.remove();
                }
            });
        }
    });
}

// Ensure the DOM is fully loaded and attach dynamic listener
document.addEventListener('DOMContentLoaded', () => {
    enableDynamicImageZoom();
});

