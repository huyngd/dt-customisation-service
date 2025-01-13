const flowData = {
    flowType: 'bespoke-demo',
    bespokeOption: null,
    agencyCounterInputs: null,
    landingPageSelection: null,
    tailoredQuestions: null,
    generalQuestions: null,
    submitted_at: new Date().toISOString(),
};

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
        inputBox: true,
        images: ["images/11.png"]
    }
];


const optionsContainer = document.getElementById('options');
const dynamicGrid = document.getElementById('dynamicGrid');
const selectedOptionInput = document.getElementById('selectedOption');
const selectedImages = {};
const historyStack = [];

let selectedPurpose = null; 

function renderPurposeSelection() {
    historyStack.push(() => renderPurposeSelection());
    const container = document.getElementById('dynamicForm');

    container.innerHTML = `
        <h3>Could you tell me what you're looking for?</h3>
        <div class="row">
            <div class="col-md-4">
                <button class="btn btn-outline-primary w-100" data-purpose="standard-demo">
                    A standard demo page for pitching
                </button>
            </div>
            <div class="col-md-4">
                <button class="btn btn-outline-primary w-100" data-purpose="bespoke-demo">
                    A bespoke demo page for pitching
                </button>
            </div>
            <div class="col-md-4">
                <button class="btn btn-outline-primary w-100" data-purpose="update-config">
                    Changes of a production page
                </button>
            </div>
        </div>
    `;

    const buttons = container.querySelectorAll('button[data-purpose]');

    buttons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            buttons.forEach((btn) => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedPurpose = button.dataset.purpose;
            moveToNextModule();
        });
    });
}

function moveToNextModule() {
    if (selectedPurpose === 'standard-demo') {
        renderStandardDemo();
    } else if (selectedPurpose === 'bespoke-demo') {
        renderBespokeDemoOptions();
    } else if (selectedPurpose === 'update-config') {
        renderUpdateConfigurationForm();
    } else {
        console.error('Unknown purpose selected:', selectedPurpose);
    }
}

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

function renderBespokeDemoOptions() {
    historyStack.push(() => renderBespokeDemoOptions());
    const container = document.getElementById('dynamicForm');
    container.innerHTML = `
        <h3>What are you going to use it for?</h3>
        <div class="row">
            <div class="col-md-3">
                <button class="btn btn-outline-primary w-100" data-option="Carrier WL">Carrier WL</button>
            </div>
            <div class="col-md-3">
                <button class="btn btn-outline-primary w-100" data-option="OTA WL">OTA WL</button>
            </div>
            <div class="col-md-3">
                <button class="btn btn-outline-primary w-100" data-option="S2B WL">S2B WL</button>
            </div>
            <div class="col-md-3">
                <button class="btn btn-outline-primary w-100" data-option="Agency counter WL">Agency Counter WL</button>
            </div>
        </div>
        <button class="btn btn-secondary mt-3" id="backButton">Back</button>
    `;

    const buttons = container.querySelectorAll('button[data-option]');
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedOption = event.target.dataset.option;
            flowData.bespokeOption = selectedOption;
            if (selectedOption === 'Agency counter WL') {
                renderAgencyCounterInputs();
            } else {
                renderLandingPageSelection(selectedOption);
            }
        });
    });

    document.getElementById('backButton').addEventListener('click', goBack);
}

function renderAgencyCounterInputs() {
    historyStack.push(() => renderAgencyCounterInputs());
    const container = document.getElementById('dynamicForm');

    container.innerHTML = `
        <h3>User Information for Agency Counter WL</h3>
        <form id="agencyForm">
            <div id="userInputsContainer">
                <div class="user-input-row mb-3">
                    <label class="form-label">User 1:</label>
                    <div class="row align-items-center">
                        <div class="col-md-4">
                            <input type="text" class="form-control" name="firstName" placeholder="First Name" required>
                        </div>
                        <div class="col-md-4">
                            <input type="text" class="form-control" name="lastName" placeholder="Last Name" required>
                        </div>
                        <div class="col-md-4">
                            <input type="email" class="form-control" name="email" placeholder="Email" required>
                        </div>
                        <div class="col-md-12 mt-2">
                            <button type="button" class="btn btn-danger btn-sm remove-user-button" style="display: none;">Remove User</button>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" id="addUserButton" class="btn btn-secondary mb-3">Add Another User</button>
            
            <div class="mb-3">
                <label class="form-label">User Type:</label>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="userType" id="demoAccess" value="Demo" required>
                    <label class="form-check-label" for="demoAccess">Demo (Demo access allows users full access to create test bookings.)</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="userType" id="productionAccess" value="Production">
                    <label class="form-check-label" for="productionAccess">Production</label>
                </div>
            </div>
            
            <div class="mb-3">
                <label class="form-label">User Access:</label>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="viewManageCreate" value="View, manage and create bookings">
                    <label class="form-check-label" for="viewManageCreate">View, manage and create bookings</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="viewCustomerData" value="View booking customer data">
                    <label class="form-check-label" for="viewCustomerData">View booking customer data</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="portalCustomization" value="Access to Portal customization">
                    <label class="form-check-label" for="portalCustomization">Access to Portal customization</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="apiDocs" value="Access to API docs">
                    <label class="form-check-label" for="apiDocs">Access to API docs</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="viewHomeStats" value="View home page details/stats">
                    <label class="form-check-label" for="viewHomeStats">View home page details/stats</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="viewInsights" value="View insights data & global network">
                    <label class="form-check-label" for="viewInsights">View insights data & global network</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="manageExternalUsers" value="Manage external users">
                    <label class="form-check-label" for="manageExternalUsers">Manage external users</label>
                </div>
            </div>
            
            <button type="submit" class="btn btn-primary">Next</button>
        </form>
        <button class="btn btn-secondary mt-3" id="backButton">Back</button>
    `;

    // Add user row dynamically
    const userInputsContainer = document.getElementById('userInputsContainer');
    const addUserButton = document.getElementById('addUserButton');

    addUserButton.addEventListener('click', () => {
        const userRow = document.createElement('div');
        userRow.className = 'user-input-row mb-3';
        userRow.innerHTML = `
            <label class="form-label">User ${userInputsContainer.children.length + 1}:</label>
            <div class="row align-items-center">
                <div class="col-md-4">
                    <input type="text" class="form-control" name="firstName" placeholder="First Name" required>
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control" name="lastName" placeholder="Last Name" required>
                </div>
                <div class="col-md-4">
                    <input type="email" class="form-control" name="email" placeholder="Email" required>
                </div>
                <div class="col-md-12 mt-2">
                    <button type="button" class="btn btn-danger btn-sm remove-user-button">Remove User</button>
                </div>
            </div>
        `;
        userInputsContainer.appendChild(userRow);

        // Attach event listener to the remove button
        const removeButton = userRow.querySelector('.remove-user-button');
        removeButton.addEventListener('click', () => {
            userRow.remove();
            resetUserLabels(); // Reset user labels
        });
    });

    // Function to reset user labels after removal
    function resetUserLabels() {
        const userRows = userInputsContainer.querySelectorAll('.user-input-row');
        userRows.forEach((row, index) => {
            const label = row.querySelector('.form-label');
            label.textContent = `User ${index + 1}:`;
        });
    }

    // Handle form submission
    document.getElementById('agencyForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const users = Array.from(document.querySelectorAll('.user-input-row')).map((row) => ({
            firstName: row.querySelector('input[name="firstName"]').value,
            lastName: row.querySelector('input[name="lastName"]').value,
            email: row.querySelector('input[name="email"]').value,
        }));

        const userType = document.querySelector('input[name="userType"]:checked')?.value;

        const userAccess = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(
            (checkbox) => checkbox.value
        );

        flowData.agencyCounterInputs = {
            users,
            userType,
            userAccess,
        };

        renderLandingPageSelection('Agency Counter WL');
    });

    document.getElementById('backButton').addEventListener('click', goBack);
}


function renderUpdateConfigurationForm() {
    historyStack.push(() => renderUpdateConfigurationForm());
    const container = document.getElementById('dynamicForm');
    container.innerHTML = `
        <h3>Update a Production Page</h3>
        <form id="updateForm"> <!-- Ensure this is properly defined -->
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
    const updateForm = document.getElementById('updateForm');
    if (updateForm) {
        updateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const pageName = document.getElementById('pageName')?.value.trim();
            const changes = document.getElementById('changes')?.value.trim();
            if (!pageName || !changes) {
                alert('Please complete all required fields.');
                return;
            }
            const data = {
                flowType: 'update-config',
                updatePageDetails: {
                    pageName,
                    changes,
                },
            };
            try {
                const apiUrl = 'https://wl-support.onrender.com'
                // const apiUrl = 'http://localhost:3000';

                const response = await fetch(`${apiUrl}/save-selections`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API error: ${response.status} - ${errorText}`);
                }

                const result = await response.json();
                renderThankYouPage();
            } catch (error) {
                console.error('Error during API call:', error);
                alert('Failed to save data. Check console for details.');
            }
        });
    } else {
        console.error('Update form not found in the DOM.');
    }
}

let selectedLandingPage = null; 
function renderLandingPageSelection() {
    historyStack.push(() => renderLandingPageSelection());
    const container = document.getElementById('dynamicForm');

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

    document.querySelectorAll('.option-img').forEach((img) => {
        img.addEventListener('click', () => {
            document.querySelectorAll('.option-img').forEach((img) => img.classList.remove('selected'));
            img.classList.add('selected');
            selectedLandingPage = img.alt;
            document.getElementById('nextButton').disabled = false;
        });
    });

    document.getElementById('nextButton').addEventListener('click', () => {
        if (selectedLandingPage) {
            flowData.landingPageSelection = selectedLandingPage;
            renderTailoredQuestions(selectedLandingPage);
        } else {
            alert('Please select a landing page.');
        }
    });

    document.getElementById('backButton').addEventListener('click', goBack);
}

let tailoredQuestionsData = {};
function renderTailoredQuestions(selectedLandingPage) {
    historyStack.push(() => renderTailoredQuestions(selectedLandingPage));
    const container = document.getElementById('dynamicForm');

    const scenariosHTML = scenarios.map((scenario, index) => {
        if (scenario.options.length === 1) {
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

        const optionsHTML = scenario.options.map(
            (option, i) => `
            <div class="col-md-4 text-center option-container">
                <img src="${scenario.images[i]}" alt="${option}" class="img-fluid scenario-img" />
                <div class="form-check mt-2">
                    <input 
                        class="form-check-input" 
                        type="radio" 
                        name="scenario-${index}" 
                        id="option-${index}-${i}" 
                        value="${option}" 
                        ${i === 0 ? "checked" : ""} 
                    >
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
        <div class="form-group mt-4">
            <label for="additionalNotes">Additional Notes:</label>
            <textarea id="additionalNotes" class="form-control" placeholder="Add any additional notes"></textarea>
        </div>
        <button class="btn btn-primary mt-3" id="nextButton">Next</button>
        <button class="btn btn-secondary mt-3" id="backButton">Back</button>
    `;
    document.getElementById("backButton").addEventListener("click", goBack);
    document.getElementById("nextButton").addEventListener("click", () => {
        const tailoredQuestions = getTailoredQuestions();
        flowData.tailoredQuestions = tailoredQuestions;
        renderGeneralQuestions();
    });      
}

function renderGeneralQuestions() {
    historyStack.push(() => renderGeneralQuestions());
    const container = document.getElementById('dynamicForm');

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

    const rpnYes = document.getElementById('rpnYes');
    const rpnNo = document.getElementById('rpnNo');
    const rpnInput = document.getElementById('rpnInput');

    rpnYes.addEventListener('change', () => {
        rpnInput.style.display = 'block';
    });

    rpnNo.addEventListener('change', () => {
        rpnInput.style.display = 'none';
    });

    document.getElementById('backButton').addEventListener('click', goBack);

    const submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();

        if (!selectedPurpose) {
            alert('Please select a purpose before submitting.');
            return;
        }

        // Update flowData with the flow type
        flowData.flowType = selectedPurpose;

        if (selectedPurpose === 'bespoke-demo') {
            // Update landing page selection
            const landingPageSelection = getLandingPageSelection();
            if (!landingPageSelection) {
                alert('Please select a landing page.');
                return;
            }
            flowData.landingPageSelection = landingPageSelection;

            // Validate and update general questions
            if (!validateGeneralQuestions()) {
                return;
            }
            flowData.generalQuestions = getGeneralQuestions();

            // Update tailored questions
            flowData.tailoredQuestions = tailoredQuestionsData;
        } else if (selectedPurpose === 'update-config') {
            // Update page details for update-config flow
            flowData.updatePageDetails = getUpdatePageDetails();
        }

        try {
            const apiUrl = 'https://wl-support.onrender.com'
            // const apiUrl = 'http://localhost:3000';

            const response = await fetch(`${apiUrl}/save-selections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(flowData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            renderThankYouPage();
        } catch (error) {
            console.error('Error during API call:', error);
            alert('Failed to save data. Check console for details.');
        }
    });   
}

function goBack() {
    historyStack.pop();
    const previousStep = historyStack.pop();
    if (previousStep) {
        previousStep();
    } else {
        console.error('History stack is empty. Cannot navigate back.');
    }
}

document.addEventListener('DOMContentLoaded', renderPurposeSelection);
function enableDynamicImageZoom() {
    const parentContainer = document.getElementById('dynamicForm');
    if (!parentContainer) {
        console.error('Parent container for img-fluid not found.');
        return;
    }
    parentContainer.addEventListener('dblclick', (event) => {
        const image = event.target;
        if (image.classList.contains('img-fluid')) {
            const overlay = document.createElement('div');
            overlay.className = 'image-zoom-overlay';
            const zoomedImage = document.createElement('img');
            zoomedImage.src = image.src; 
            zoomedImage.alt = image.alt;
            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.innerText = 'Close';
            closeButton.addEventListener('click', () => {
                overlay.remove();
            });
            overlay.appendChild(zoomedImage);
            overlay.appendChild(closeButton);
            document.body.appendChild(overlay);
            overlay.addEventListener('click', (event) => {
                if (event.target === overlay) {
                    overlay.remove();
                }
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    enableDynamicImageZoom();
});

function getLandingPageSelection() {
    if (!selectedLandingPage) {
        alert('Please select a landing page.');
        return null;
    }
    return selectedLandingPage;
}

function getTailoredQuestions() {
    const additionalNotes = document.getElementById("additionalNotes")?.value.trim() || null;

    const tailoredQuestions = scenarios.reduce((acc, scenario, index) => {
        const selectedRadio = document.querySelector(`input[name="scenario-${index}"]:checked`);
        if (selectedRadio) {
            acc[scenario.key] = selectedRadio.value;
        } else if (scenario.options.length > 1) {
            console.warn(`No option selected for ${scenario.key}`);
        }

        const customInput = document.getElementById(`customInput-${index}`);
        if (customInput) {
            acc[`${scenario.key}_input`] = customInput.value.trim() || null;
        }

        return acc;
    }, {});

    if (additionalNotes) {
        tailoredQuestions.additionalNotes = additionalNotes;
    }
    return tailoredQuestions;
}

function getGeneralQuestions() {
    const rpnField = document.querySelector('input[name="rpn"]:checked');
    return {
        website: document.getElementById('website').value.trim(),
        rpn: rpnField ? rpnField.value : null,
        rpnInput: rpnField && rpnField.value === 'yes' ? document.getElementById('rpnInput').value.trim() : null,
        carriers: document.getElementById('carriers').value.trim(),
        additionalInfo: document.getElementById('additionalInfo').value.trim(),
        contact: document.getElementById('contact').value.trim(),
    };
}

function getUpdatePageDetails() {
    const pageName = document.getElementById('pageName')?.value.trim();
    const changes = document.getElementById('changes')?.value.trim();
    if (!pageName || !changes) {
        return null;
    }
    return { pageName, changes };
}

function renderThankYouPage() {
    const container = document.getElementById('dynamicForm');
    container.innerHTML = `
        <div class="text-center mt-5">
            <h3>Thank You!</h3>
            <p>Your data has been successfully saved.</p>
            <button class="btn btn-primary mt-3" id="returnHome">Return to Home</button>
        </div>
    `;
    document.getElementById('returnHome').addEventListener('click', () => {
        renderPurposeSelection();
    });
}

function validateGeneralQuestions() {
    const website = document.getElementById('website').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const rpnField = document.querySelector('input[name="rpn"]:checked');
    const rpnInput = document.getElementById('rpnInput')?.value.trim();

    if (!website) {
        alert('Website is required.');
        highlightMissingField('website');
        return false;
    }

    if (!contact) {
        alert('Contact email is required.');
        highlightMissingField('contact');
        return false;
    }

    if (!rpnField) {
        alert('Please select if you have an existing RPN.');
        highlightMissingField('rpnYes');
        return false;
    }

    if (rpnField.value === 'yes' && !rpnInput) {
        alert('Please provide your RPN.');
        highlightMissingField('rpnInput');
        return false;
    }

    return true;
}


function highlightMissingField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('is-invalid');
        field.addEventListener('input', () => field.classList.remove('is-invalid'), { once: true });
    }
}
