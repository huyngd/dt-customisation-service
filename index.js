import dotenv from 'dotenv';
dotenv.config();

const optionsData = [
    { id: "A", src: "images/opt1.png", alt: "A. Standard WL page" },
    { id: "B", src: "images/opt2.png", alt: "B. Airport transfers page" },
    { id: "C", src: "images/opt3.png", alt: "C. Public transportation page" }
];

const scenarios = [
    {
        id: "scenario1",
        key: "searchBar",
        options: ["Row search bar", "Column search bar"],
        images: ["images/10.png", "images/11.png"]
    },
    {
        id: "scenario2",
        key: "tripTime",
        options: ["Enabled", "Disabled"],
        images: ["images/image6.png", "images/image7.png"]
    },
    {
        id: "scenario3",
        key: "returnTrip",
        options: ["Enabled", "Disabled"],
        images: ["images/image8.png", "images/image9.png"]
    },
    {
        id: "scenario4",
        key: "passengerType",
        options: ["Enabled", "Disabled"],
        images: ["images/image5.png", "images/image4.png"]
    },
    {
        id: "scenario5",
        key: "fareClasses",
        options: ["Search results", "Checkout", "Nowhere"],
        images: ["images/12.png", "images/13.png", "images/13.png"]
    },
    {
        id: "scenario6",
        key: "seatSelection",
        options: ["Search results", "Checkout", "No seat selection"],
        images: ["images/14.gif", "images/15.gif", "images/15.gif"]
    },
    {
        id: "scenario7",
        key: "customScenario",
        options: ["Image & Input"],
        description: "Enter your custom configuration:",
        inputBox: true, // Enable input box for this scenario
        images: ["images/11.png"]
    }
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
            <button type="submit" class="btn btn-primary mt-3">Submit</button>
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

    const scenariosHTML = scenarios.map((scenario, index) => {
        if (scenario.options.length === 1) {
            // For single-option scenarios, display the image and text without a radio button
            return `
            <div class="scenario rounded p-3 mb-3" style="border: 1px solid #ccc;">
                <h5 class="mb-3">${scenario.key.replace(/([A-Z])/g, " $1").trim()}</h5>
                <div class="text-center">
                    <img src="${scenario.images[0]}" alt="${scenario.options[0]}" class="img-fluid scenario-img" />
                    <p class="mt-2"><strong>${scenario.options[0]}</strong></p>
                </div>
                ${
                    scenario.inputBox
                        ? `<div class="mt-3">
                            <label for="customInput-${index}" class="form-label">${scenario.description}</label>
                            <input type="text" class="form-control" id="customInput-${index}" placeholder="Enter your value">
                           </div>`
                        : ""
                }
            </div>`;
        }

        // For multiple options, display radio buttons with images and text
        const optionsHTML = scenario.options.map(
            (option, i) => `
            <div class="col-md-4 text-center option-container">
                <img src="${scenario.images[i]}" alt="${option}" class="img-fluid scenario-img" />
                <div class="form-check mt-2">
                    <input class="form-check-input" type="radio" name="scenario-${index}" id="option-${index}-${i}" value="${option}" ${i === 0 ? "checked" : ""}>
                    <label class="form-check-label d-block" for="option-${index}-${i}">
                        ${option}
                    </label>
                </div>
            </div>`
        ).join("");

        return `
        <div class="scenario rounded p-3 mb-3" style="border: 1px solid #ccc;">
            <h5 class="mb-3">${scenario.key.replace(/([A-Z])/g, " $1").trim()}</h5>
            <div class="row justify-content-center">
                ${optionsHTML}
            </div>
            ${
                scenario.inputBox
                    ? `<div class="mt-3">
                            <label for="customInput-${index}" class="form-label">${scenario.description}</label>
                            <input type="text" class="form-control" id="customInput-${index}" placeholder="Enter your value">
                       </div>`
                    : ""
            }
        </div>`;
    }).join("");

    container.innerHTML = `
        <h4>Functionalities Selection</h4>
        <div id="dynamicGrid">${scenariosHTML}</div>
        <button class="btn btn-primary mt-3" id="nextButton">Next</button>
        <button class="btn btn-secondary mt-3" id="backButton">Back</button>
    `;

    // Handle Back button
    document.getElementById("backButton").addEventListener("click", goBack);

    // Handle Next button
    document.getElementById("nextButton").addEventListener("click", () => {
        const selectedValues = scenarios.reduce((acc, scenario, index) => {
            if (scenario.options.length > 1) {
                const selectedRadio = document.querySelector(`input[name="scenario-${index}"]:checked`);
                acc[scenario.key] = selectedRadio ? selectedRadio.value : null;
            }
            if (scenario.inputBox) {
                const inputValue = document.getElementById(`customInput-${index}`)?.value;
                acc[`${scenario.key}_input`] = inputValue || null;
            }
            return acc;
        }, {});
        console.log("Selected Values:", selectedValues);
        renderGeneralQuestions(); // Proceed to General Questions
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
            <button type="button" class="btn btn-primary mt-3" id="submitButton">Submit</button>
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

    // Handle Submit button
    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', () => {
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

// Frontend Integration
document.getElementById('selectionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Step 1: Determine the flow type (e.g., bespoke-demo, update-config)
    const flowType = determineFlowType(); // Implement this based on your logic

    // Step 2: Collect data based on the flow type
    let data = { flowType };

    if (flowType === 'bespoke-demo') {
        data.landingPageSelection = getLandingPageSelection(); // Get A, B, or C
        data.tailoredQuestions = getTailoredQuestions(); // Capture tailored question answers
        data.generalQuestions = getGeneralQuestions(); // Capture general form answers
    } else if (flowType === 'update-config') {
        data.updatePageDetails = getUpdatePageDetails(); // Capture update config answers
    }

    console.log('Collected Data:', data); // Debugging: Ensure data is structured correctly

    // Step 3: Send the data to the backend
    try {
        const apiUrl = process.env.API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/save-selections`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        console.log('API Response:', result); // Debugging: Log backend response
        alert('Data saved successfully!');
    } catch (error) {
        console.error('Error during API call:', error);
        alert('Failed to save data. Check console for details.');
    }
});

function determineFlowType() {
    const selectedPurpose = document.querySelector('button[data-purpose].selected');
    return selectedPurpose ? selectedPurpose.dataset.purpose : null;
}

function getLandingPageSelection() {
    const selectedLandingPage = document.querySelector('.option-img.selected');
    return selectedLandingPage ? selectedLandingPage.dataset.value : null;
}

function getTailoredQuestions() {
    return scenarios.reduce((acc, scenario, index) => {
        const switchElement = document.getElementById(`switch-${scenario.id}`);
        acc[scenario.key] = switchElement.checked ? 'A' : 'B';

        const customInput = document.getElementById(`customInput-${index}`);
        if (customInput) {
            acc[`${scenario.key}_input`] = customInput.value || null;
        }

        return acc;
    }, {});
}

function getGeneralQuestions() {
    const rpnField = document.querySelector('input[name="rpn"]:checked');
    return {
        website: document.getElementById('website').value,
        rpn: rpnField ? rpnField.value : null,
        rpnInput: rpnField && rpnField.value === 'yes' ? document.getElementById('rpnInput').value : null,
        carriers: document.getElementById('carriers').value,
        additionalInfo: document.getElementById('additionalInfo').value,
        contact: document.getElementById('contact').value,
    };
}

function getUpdatePageDetails() {
    return {
        pageName: document.getElementById('pageName').value,
        changes: document.getElementById('changes').value,
    };
}



