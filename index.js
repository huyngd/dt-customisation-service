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
                const apiUrl = 'https://wl-support.onrender.com'; // Replace with production URL if needed
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

    // Handle option selection
    document.querySelectorAll('.option-img').forEach((img) => {
        img.addEventListener('click', () => {
            document.querySelectorAll('.option-img').forEach((img) => img.classList.remove('selected'));
            img.classList.add('selected');
            selectedLandingPage = img.dataset.value;
            document.getElementById('nextButton').disabled = false;
        });
    });

    document.getElementById('nextButton').addEventListener('click', () => {
        if (selectedLandingPage) {
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
        tailoredQuestionsData = getTailoredQuestions();
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
    
        let data = { flowType: selectedPurpose };
    
        if (selectedPurpose === 'bespoke-demo') {
            data.landingPageSelection = getLandingPageSelection();
            if (!data.landingPageSelection) {
                alert('Please select a landing page.');
                return;
            }
    
            data.tailoredQuestions = tailoredQuestionsData;
            data.generalQuestions = getGeneralQuestions();
        } else if (selectedPurpose === 'update-config') {
            data.updatePageDetails = getUpdatePageDetails();
        }
        
        try {
            const apiUrl = 'https://wl-support.onrender.com';
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

function validateGeneralQuestions() {
    const website = document.getElementById('website').value.trim();
    const contact = document.getElementById('contact').value.trim();
    if (!website || !contact) {
        alert('Please fill in all required fields in the General Questions section.');
        return false;
    }
    return true;
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



