document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Get the parent section to only affect tabs within that section
        const parentSection = this.closest('.section-content');

        // Remove active class from all tabs in this section
        parentSection.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Hide all tab contents in this section
        parentSection.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show the selected tab content
        const tabId = this.getAttribute('data-tab');
        const selectedContent = parentSection.querySelector(`#${tabId}`);
        if (selectedContent) {
            selectedContent.classList.add('active');
        }
    });
});

// Navigation functionality
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.section-content').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the selected section
        const sectionType = this.getAttribute('data-section');
        const selectedSection = document.getElementById(`${sectionType}-section`);
        if (selectedSection) {
            selectedSection.classList.add('active');
        }
    });
});

// Button interactions
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        // Add ripple effect
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
});
var counter = 1;
document.querySelector('#add-btn').addEventListener('click', function() {
    const area1 = document.querySelector('#area1');
    if (area1) {
        // Remove 'active' from all nav-items
        area1.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

        const div = document.createElement('div');
        div.className = 'nav-item active';
        div.setAttribute('data-section', 'claim-details-' + (counter + 1));

        const innerDiv = document.createElement('div');
        const iconSpan = document.createElement('span');
        iconSpan.className = 'nav-icon';
        iconSpan.textContent = '🏠';
        const textSpan = document.createElement('span');
        textSpan.textContent = ' Claim ' + (counter + 1);

        innerDiv.appendChild(iconSpan);
        innerDiv.appendChild(textSpan);
        div.appendChild(innerDiv);

        area1.appendChild(div);

        const contentArea = document.querySelector('.content-area');
        const div2 = document.createElement('div');
        div2.className = 'section-content active';
        div2.id = `claim-details-${counter + 1}-section`;

        const div1 = document.createElement('div');
        div1.className = 'tab-nav';

        div1.appendChild(createTab(`Policy Details-${counter + 1}`, `policy-details-${counter + 1}`, true));
        div1.appendChild(createTab(`Accident Details-${counter + 1}`, `accident-details-${counter + 1}`, false));
        div1.appendChild(createTab(`Claimant Information-${counter + 1}`, `claimant-information-${counter + 1}`, false));
        div1.appendChild(createTab(`TPV Details-${counter + 1}`, `tpv-details-${counter + 1}`, false));
        div1.appendChild(createTab(`Notes-${counter + 1}`, `notes-${counter + 1}`, false));
        div1.appendChild(createTab(`Paper Estimates-${counter + 1}`, `paper-estimates-${counter + 1}`, false));
        div1.appendChild(createTab(`Photo Reports-${counter + 1}`, `photo-reports-${counter + 1}`, false));
        div1.appendChild(createTab(`Activity Log-${counter + 1}`, `activity-log-${counter + 1}`, false));


        div2.appendChild(div1);
        contentArea.appendChild(div2);

        // Hide all sections
        document.querySelectorAll('.section-content').forEach(section => {
            section.classList.remove('active');
        });

        const selectedSection = document.getElementById(`claim-details-${counter + 1}-section`);
        if (selectedSection) {
            selectedSection.classList.add('active');
        }
        const contentGridDiv = document.createElement('div');
        contentGridDiv.className = 'content-grid';

        const maindiv = document.createElement('div');
        maindiv.className = 'main-content';
        contentGridDiv.appendChild(maindiv);

        maindiv.appendChild(createPolicyDetailsTab(counter));
        maindiv.appendChild(createAccidentInformationTab(counter));
        maindiv.appendChild(createClaimantsTab(counter));
        maindiv.appendChild(createTPVDetailsTab(counter));
        maindiv.appendChild(createNotesTab(counter));
        maindiv.appendChild(createActivityLogTab(counter));
        maindiv.appendChild(createPhotoReportsTab(counter));
        maindiv.appendChild(createPaperEstimatesTab(counter));
        contentGridDiv.appendChild(createDamageDetailsSidebar());

        div2.appendChild(contentGridDiv);

        console.log('New section added:', div2);

        // Add event listener to the new nav-item
        div.addEventListener('click', function() {
            // Remove active from all nav-items
            area1.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            // Hide all sections
            document.querySelectorAll('.section-content').forEach(section => {
                section.classList.remove('active');
            });

            // Show the selected section
            const sectionType = this.getAttribute('data-section');
            const selectedSection = document.getElementById(`${sectionType}-section`);
            if (selectedSection) {
                selectedSection.classList.add('active');
            }
        });

        div2.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const parentSection = this.closest('.section-content');
                parentSection.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                parentSection.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                const tabId = this.getAttribute('data-tab');
                const selectedContent = parentSection.querySelector(`#${tabId}`);
                if (selectedContent) {
                    selectedContent.classList.add('active');
                }
            });
        });

        counter++;
    }
});

function createPolicyDetailsTab(counter) {
    const tabContentDiv = document.createElement('div');
    tabContentDiv.className = 'tab-content active';
    tabContentDiv.id = `policy-details-${counter + 1}`;
    tabContentDiv.innerHTML = `
        <h3>Policy Information</h3>
        <div class="claimant-list" style="margin-top: 20px">
        <div style="background: #f7fafc; padding: 20px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #e2e8f0">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px">
            <h4 style="color: #2d3748">Primary Claimant</h4>
            <span style="background: #ebf8ff; color: #3182ce; padding: 4px 8px; border-radius: 4px">Active</span>
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px">
            <div>
                <label style="color: #718096; font-size: 0.875rem">Full Name</label>
                <p style="color: #2d3748; margin-top: 4px">Anna Green</p>
            </div>
            <div>
                <label style="color: #718096; font-size: 0.875rem">Policy Number</label>
                <p style="color: #2d3748; margin-top: 4px">AV123456</p>
            </div>
            <div>
                <label style="color: #718096; font-size: 0.875rem">Policy Type</label>
                <p style="color: #2d3748; margin-top: 4px">Fully Comp</p>
            </div>
            <div>
                <label style="color: #718096; font-size: 0.875rem">PH DOB</label>
                <p style="color: #2d3748; margin-top: 4px">14/12/2000</p>
            </div>
            <div>
                <label style="color: #718096; font-size: 0.875rem">VRN</label>
                <p style="color: #2d3748; margin-top: 4px">LS24 ABC</p>
            </div>
            <div>
                <label style="color: #718096; font-size: 0.875rem">Make & Model</label>
                <p style="color: #2d3748; margin-top: 4px">BMW / Series 3/p>
            </div>
            <div>
                <label style="color: #718096; font-size: 0.875rem">PH Engineer/Garage</label>
                <p style="color: #2d3748; margin-top: 4px">Lisa's Motors</p>
            </div>
            <div>
                <label style="color: #718096; font-size: 0.875rem">Policy Inception</label>
                <p style="color: #2d3748; margin-top: 4px">01/01/2025</p>
            </div>
            </div>
        </div>
        </div>
    `;
    return tabContentDiv;
}

function createAccidentInformationTab(counter) {
    const tabContentDiv = document.createElement('div');
    tabContentDiv.className = 'tab-content';
    tabContentDiv.id = `accident-details-${counter + 1}`;
    tabContentDiv.innerHTML = `
        <h3>Accident Information</h3>
        <div class="claimant-list" style="margin-top: 20px">
            <div style="background: #f7fafc; padding: 20px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #e2e8f0">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px">
                    <h4 style="color: #2d3748">Accident Details</h4>
                    <span style="background: #ebf8ff; color: #3182ce; padding: 4px 8px; border-radius: 4px">Active</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px">
                    <div>
                        <label style="color: #718096; font-size: 0.875rem">Date of Accident</label>
                        <p style="color: #2d3748; margin-top: 4px">01/01/2025</p>
                    </div>
                    <div>
                        <label style="color: #718096; font-size: 0.875rem">Time of Accident</label>
                        <p style="color: #2d3748; margin-top: 4px">14:30</p>
                    </div>
                    <div>
                        <label style="color: #718096; font-size: 0.875rem">Location</label>
                        <p style="color: #2d3748; margin-top: 4px">Main St, Anytown</p>
                    </div>
                    <div>
                        <label style="color: #718096; font-size: 0.875rem">Description</label>
                        <p style="color: #2d3748; margin-top: 4px">Front collision</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    return tabContentDiv;
}

function createClaimantsTab(counter) {
    const tabContentDiv = document.createElement('div');
    tabContentDiv.className = 'tab-content';
    tabContentDiv.id = `claimant-information-${counter + 1}`;
    tabContentDiv.innerHTML = `
        <h3>Claimants Vehicle Information</h3>
        <div class="claimant-list" style="margin-top: 20px">
          <div style="background: #f7fafc; padding: 20px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #e2e8f0">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px">
              <div>
                <label style="color: #718096; font-size: 0.875rem">VRN</label>
                <p style="color: #2d3748; margin-top: 4px">TT24 AKL</p>
              </div>
              <div>
                <label style="color: #718096; font-size: 0.875rem">Make & Model</label>
                <p style="color: #2d3748; margin-top: 4px">Ford / Focus</p>
              </div>
              <div>
                <label style="color: #718096; font-size: 0.875rem">TPI - (INC Policy Number)</label>
                <p style="color: #2d3748; margin-top: 4px">INC-987654321</p>
              </div>
              <div>
                <label style="color: #718096; font-size: 0.875rem">Policy Inception</label>
                <p style="color: #2d3748; margin-top: 4px">04/04/2025</p>
              </div>
              <div>
                <label style="color: #718096; font-size: 0.875rem">Policy Length</label>
                <p style="color: #2d3748; margin-top: 4px">125 Days</p>
              </div>
              <div>
                <label style="color: #718096; font-size: 0.875rem">TP Payment Details</label>
                <p style="color: #2d3748; margin-top: 4px">23-54-74 53478954</p>
              </div>
            </div>
          </div>
        </div>
        <h3>Claimants Information</h3>
        <div class="claimant-list" style="margin-top: 20px">
          <details style="background: #f7fafc; padding: 0; border-radius: 6px; margin-bottom: 15px; border: 1px solid #e2e8f0">
            <summary style="padding: 20px; font-weight: 600; font-size: 1rem; color: #2d3748; cursor: pointer; border-radius: 6px 6px 0 0">Claimant: Anna Green</summary>
            <div style="padding: 20px">
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px">
                <div>
                  <label style="color: #718096; font-size: 0.875rem">Occupant</label>
                  <p style="color: #2d3748; margin-top: 4px">Yes</p>
                </div>
                <div>
                  <label style="color: #718096; font-size: 0.875rem">Claimant Name</label>
                  <p style="color: #2d3748; margin-top: 4px">Anna Green</p>
                </div>
                <div>
                  <label style="color: #718096; font-size: 0.875rem">Claimant DOB</label>
                  <p style="color: #2d3748; margin-top: 4px">10/11/1987</p>
                </div>
                <div>
                  <label style="color: #718096; font-size: 0.875rem">Claimant Address</label>
                  <p style="color: #2d3748; margin-top: 4px">9 Smiths Road, Hull</p>
                </div>
                <div>
                  <label style="color: #718096; font-size: 0.875rem">Claimant Postcode</label>
                  <p style="color: #2d3748; margin-top: 4px">HR5 6TF</p>
                </div>
                <div>
                  <label style="color: #718096; font-size: 0.875rem">Telephone Number</label>
                  <p style="color: #2d3748; margin-top: 4px">07876 453765</p>
                </div>
                <div>
                  <label style="color: #718096; font-size: 0.875rem">Email Address</label>
                  <p style="color: #2d3748; margin-top: 4px">test@Gmail.Com</p>
                </div>
                <div>
                  <label style="color: #718096; font-size: 0.875rem">NI Number</label>
                  <p style="color: #2d3748; margin-top: 4px">NC566654B</p>
                </div>
                <div>
                  <label style="color: #718096; font-size: 0.875rem">Occupation</label>
                  <p style="color: #2d3748; margin-top: 4px">Farmer</p>
                </div>
              </div>
            </div>
          </details>
        </div>
        <button class="btn btn-primary" style="margin-top: 20px">Add New Claimant</button>
    `;
    return tabContentDiv;
}

function createNotesTab(counter) {
    const tabContentDiv = document.createElement('div');
    tabContentDiv.className = 'tab-content';
    tabContentDiv.id = `notes-${counter + 1}`;
    tabContentDiv.innerHTML = `
        <h3>Notes</h3>
        <div class="claimant-list" style="margin-top: 20px">
            <div style="background: #f7fafc; padding: 20px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #e2e8f0">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px">
                    <div style="grid-column: 1 / -1">
                        <label style="color: #718096; font-size: 0.875rem">Notes</label>
                        <p style="color: #2d3748; margin-top: 4px; background: #f7fafc; padding: 16px; border-radius: 6px; font-size: 1rem">
                            In this fictional insurance claim, the incident occurred on September 12, 2025, at 4:45 PM BST at the intersection of High Street and Station Road. The policyholder, driving a 2005 Ford Focus with the VRN AB05 CDE, was traveling eastbound on High Street and had a green light.<br />
                            As they entered the intersection, a black Vauxhall Corsa, VRN YF73 ZYX, failed to stop at a red light while traveling southbound on Station Road, colliding with the front passenger side of the Ford Focus. The driver of the other vehicle admitted fault at the scene. The police were called, and a witness was present. The policyholder's vehicle is undrivable and has significant damage.
                        </p>
                    </div>
                    <div>
                        <label style="color: #718096; font-size: 0.875rem">Position Of File</label>
                        <p style="color: #2d3748; margin-top: 4px">TBC</p>
                    </div>
                    <div>
                        <label style="color: #718096; font-size: 0.875rem">Outstanding Reserves</label>
                        <p style="color: #2d3748; margin-top: 4px">£1,350.35</p>
                    </div>
                    <div>
                        <label style="color: #718096; font-size: 0.875rem">Payments</label>
                        <p style="color: #2d3748; margin-top: 4px">£1,223.87</p>
                    </div>
                    <div>
                        <label style="color: #718096; font-size: 0.875rem">Identified From </label>
                        <p style="color: #2d3748; margin-top: 4px">TBC</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    return tabContentDiv;
}

function createTPVDetailsTab(counter) {
    const tabContentDiv = document.createElement('div');
    tabContentDiv.className = 'tab-content';
    tabContentDiv.id = `tpv-details-${counter + 1}`;
    tabContentDiv.innerHTML = `
        <h3>TPV Information</h3>
        <div class="claimant-list" style="margin-top: 20px">
          <div style="background: #f7fafc; padding: 20px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #e2e8f0">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px">
              <div>
                <label style="color: #718096; font-size: 0.875rem">Engineer - Address Included</label>
                <p style="color: #2d3748; margin-top: 4px"><strong>James Smith</strong> - 65 Mill Road, Norwich, NY7 8UH</p>
              </div>
              <div>
                <label style="color: #718096; font-size: 0.875rem">TPV Inspection Address</label>
                <p style="color: #2d3748; margin-top: 4px"><strong>ABC Motors</strong> - 5 Green Lane, Norwich, NF6 6YH</p>
              </div>
              <div>
                <label style="color: #718096; font-size: 0.875rem">TPV - Recovery/Storage Address</label>
                <p style="color: #2d3748; margin-top: 4px"><strong>VTG Recoveries</strong> - 88 Ling Lane, Norwich, NH6 5RF</p>
              </div>
              <div>
                <label style="color: #718096; font-size: 0.875rem">TP AMC - Address Included</label>
                <p style="color: #2d3748; margin-top: 4px"><strong>LKI Ltd</strong> - Friends Tower, Norwich, NT5 7YH</p>
              </div>
            </div>
          </div>
        </div>
        <h3>Law Firm Information</h3>
        <div class="claimant-list" style="margin-top: 20px">
          <details style="background: #f7fafc; padding: 0; border-radius: 6px; margin-bottom: 15px; border: 1px solid #e2e8f0">
            <summary style="padding: 20px; font-weight: 600; font-size: 1rem; color: #2d3748; cursor: pointer; border-radius: 6px 6px 0 0">Claimant: Anna Green</summary>
            <div style="padding: 20px">
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px">
                <div>
                  <label style="color: #718096; font-size: 0.875rem">Claimant Law Firm</label>
                  <p style="color: #2d3748; margin-top: 4px">Mills & Co</p>
                </div>
                <div>
                  <label style="color: #718096; font-size: 0.875rem">Fee/Earner Reference</label>
                  <p style="color: #2d3748; margin-top: 4px">Ref45/876</p>
                </div>
              </div>
            </div>
          </details>
        </div>
        <button class="btn btn-primary" style="margin-top: 20px">Add New Claimant</button>
    `;
    return tabContentDiv;
}


function createPaperEstimatesTab(counter) {
    const tabContentDiv = document.createElement('div');
    tabContentDiv.className = 'tab-content';
    tabContentDiv.id = `paper-estimates-${counter + 1}`;
    tabContentDiv.innerHTML = `
        <h3>Paper Estimates</h3>
        <div style="margin-top: 20px">
            <div style="background: #f7fafc; padding: 20px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #e2e8f0">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
                    <h4 style="color: #2d3748">Initial Estimate</h4>
                    <span style="color: #718096; font-size: 0.875rem">July 18, 2025 11:45 AM</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px">
                    <div>
                        <label style="color: #718096; font-size: 0.875rem">Estimate Amount</label>
                        <p style="color: #2d3748; margin-top: 4px">£1,223.87</p>
                    </div>
                    <div>
                        <label style="color: #718096; font-size: 0.875rem">Shop Name</label>
                        <p style="color: #2d3748; margin-top: 4px">AutoFix Pro</p>
                    </div>
                </div>
                <button class="btn btn-secondary" style="margin-top: 15px">View Details</button>
            </div>
        </div>
        <button class="btn btn-primary" style="margin-top: 20px">Upload New Estimate</button>
    `;
    return tabContentDiv;
}

function createPhotoReportsTab(counter) {
    const tabContentDiv = document.createElement('div');
    tabContentDiv.className = 'tab-content';
    tabContentDiv.id = `photo-reports-${counter + 1}`;
    tabContentDiv.innerHTML = `
        <h3>Photo Documentation</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px">
            <div style="background: #f7fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0">
                <div style="background: #e2e8f0; height: 150px; border-radius: 4px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center">
                    <span style="color: #718096">Front View</span>
                </div>
                <p style="font-size: 0.875rem; color: #4a5568">Front Damage - February 15, 2025</p>
            </div>
            <div style="background: #f7fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0">
                <div style="background: #e2e8f0; height: 150px; border-radius: 4px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center">
                    <span style="color: #718096">Detail View</span>
                </div>
                <p style="font-size: 0.875rem; color: #4a5568">Bumper Detail - February 15, 2025</p>
            </div>
        </div>
        <button class="btn btn-primary" style="margin-top: 20px">Upload New Photos</button>
    `;
    return tabContentDiv;
}

function createActivityLogTab(counter) {
    const tabContentDiv = document.createElement('div');
    tabContentDiv.className = 'tab-content';
    tabContentDiv.id = `activity-log-${counter + 1}`;
    tabContentDiv.innerHTML = `
        <h3>Activity History</h3>
        <div style="margin-top: 20px">
            <div style="background: #f7fafc; padding: 15px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #e2e8f0">
                <div style="display: flex; justify-content: space-between; align-items: center">
                    <div>
                        <h4 style="color: #2d3748; margin-bottom: 5px">Estimate Received</h4>
                        <p style="color: #718096; font-size: 0.875rem">Initial estimate from AutoFix Pro</p>
                    </div>
                    <span style="color: #718096; font-size: 0.875rem">July 16, 2025 2:30 PM</span>
                </div>
            </div>
            <div style="background: #f7fafc; padding: 15px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #e2e8f0">
                <div style="display: flex; justify-content: space-between; align-items: center">
                    <div>
                        <h4 style="color: #2d3748; margin-bottom: 5px">Payment Processed</h4>
                        <p style="color: #718096; font-size: 0.875rem">Initial payment of £1,223.87 approved</p>
                    </div>
                    <span style="color: #718096; font-size: 0.875rem">July 17, 2025 10:00 AM</span>
                </div>
            </div>
            <div style="background: #f7fafc; padding: 15px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #e2e8f0">
                <div style="display: flex; justify-content: space-between; align-items: center">
                    <div>
                        <h4 style="color: #2d3748; margin-bottom: 5px">Payment Processed</h4>
                        <p style="color: #718096; font-size: 0.875rem">Initial payment of £489.87 approved</p>
                    </div>
                    <span style="color: #718096; font-size: 0.875rem">August 22, 2025 14:56 PM</span>
                </div>
            </div>
        </div>
    `;
    return tabContentDiv;
}


function createDamageDetailsSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar-panel';
    sidebar.innerHTML = `
        <div class="panel-header">Damage Details</div>
        <div class="panel-content">
            <div class="info-item">
                <div class="info-label">Dispute 1: Summary</div>
            </div>
            <div class="info-item">
                <div class="info-label">Vehicle ID</div>
                <div class="info-value">TBC</div>
            </div>
            <div class="info-item">
                <div class="info-label">Claim Status</div>
                <div class="info-value">In Review</div>
            </div>
            <div class="info-item">
                <div class="info-label">Estimated Cost</div>
                <div class="info-value">£3,000</div>
            </div>
            <div class="checkbox-item">
                <input type="checkbox" id="salvage" />
                <label for="salvage">Structural Defect</label>
            </div>
        </div>
    `;
    return sidebar;
}

function createTab(name, id, isActive) {
    const tab = document.createElement('div');
    tab.className = 'tab' + (isActive ? ' active' : '');
    tab.textContent = name;
    tab.setAttribute('data-tab', id);
    return tab;
}

// Severity badge interactions
document.querySelectorAll('.severity-badge').forEach(badge => {
    badge.addEventListener('click', function() {
        const severityLevels = ['Low', 'Medium', 'High'];
        const currentText = this.textContent;
        if (currentText === 'Severity') {
            this.textContent = severityLevels[Math.floor(Math.random() * severityLevels.length)];
        }
    });
});

// Form validation
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Form submitted successfully!');
    });
});