
      // Sample claims data for demonstration
      const sampleClaims = [
        {
          id: "RV-2025-0715-A",
          policyHolder: "John Smith",
          status: "Active",
          dateCreated: "2025-07-15",
          amount: "£12,500.00",
          type: "Auto Insurance"
        },
        {
          id: "RV-2025-0710-B",
          policyHolder: "Sarah Johnson",
          status: "Pending",
          dateCreated: "2025-07-10",
          amount: "£8,750.00",
          type: "Property Insurance"
        },
        {
          id: "RV-2025-0708-C",
          policyHolder: "Mike Williams",
          status: "Closed",
          dateCreated: "2025-07-08",
          amount: "£15,200.00",
          type: "Auto Insurance"
        }
      ];

      function handleEnterKey(event) {
        if (event.key === 'Enter') {
          searchClaim();
        }
      }

      function searchClaim() {
        const searchTerm = document.getElementById('claimSearch').value.trim().toLowerCase();
        const resultsSection = document.getElementById('resultsSection');
        const resultsContent = document.getElementById('resultsContent');
        
        if (!searchTerm) {
          alert('Please enter a claim number to search');
          return;
        }

        // Search for matching claims
        const matchingClaims = sampleClaims.filter(claim => 
          claim.id.toLowerCase().includes(searchTerm) ||
          claim.policyHolder.toLowerCase().includes(searchTerm)
        );

        resultsSection.style.display = 'block';

        if (matchingClaims.length > 0) {
          // Display results table
          let tableHTML = `
            <table class="results-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Policy Holder</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Date Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
          `;

          matchingClaims.forEach(claim => {
            const statusClass = claim.status === 'Active' ? 'status-active' : 
                              claim.status === 'Pending' ? 'status-pending' : 'status-closed';
            
            tableHTML += `
              <tr>
                <td><strong>${claim.id}</strong></td>
                <td>${claim.policyHolder}</td>
                <td>${claim.type}</td>
                <td><span class="status-badge ${statusClass}">${claim.status}</span></td>
                <td>${claim.amount}</td>
                <td>${new Date(claim.dateCreated).toLocaleDateString()}</td>
                <td>
                  <button class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;" onclick="openClaim('${claim.id}')">
                    Open
                  </button>
                </td>
              </tr>
            `;
          });

          tableHTML += '</tbody></table>';
          resultsContent.innerHTML = tableHTML;
        } else {
          // No results found - show create new record option
          resultsContent.innerHTML = `
            <div class="no-results">
              <div class="no-results-icon">🔍</div>
              <div class="no-results-title">No Claims Found</div>
              <div class="no-results-text">
                No claims matching "${searchTerm}" were found in the system.
              </div>
              <div class="create-options">
                <button class="btn btn-success" onclick="createNewClaimWithNumber('${searchTerm}')">
                  ➕ Create New Claim
                </button>
                <button class="btn btn-orange" onclick="createResearchList('${searchTerm}')">
                  📋 Create Research List
                </button>
              </div>
            </div>
          `;
        }
      }

      function openClaim(claimId) {
        alert(`Opening claim: ${claimId}\n\nIn a real system, this would navigate to the claim details page.`);
        // In real implementation: window.location.href = `claim-details.html?id=${claimId}`;
      }

      function createNewClaim() {
        const options = confirm("Choose an option:\n\nOK - Go to RiskVault (Main Claims System)\nCancel - Create Research List Only");
        
        if (options) {
          alert("Redirecting to RiskVault main claims system...");
          window.location.href = 'riskVault.html';
        } else {
          alert("Redirecting to Research Checklist creation...");
          window.location.href = 'research-checklist.html';
        }
      }

      function createNewClaimWithNumber(claimNumber) {
        const options = confirm(`Create new record for: ${claimNumber}\n\nOK - Go to RiskVault (Full Claims System)\nCancel - Create Research List Only`);
        
        if (options) {
          alert(`Creating new claim: ${claimNumber}\nRedirecting to RiskVault...`);
          window.location.href = `riskVault.html?new=true&claimId=${claimNumber}`;
        } else {
          alert(`Creating research list for: ${claimNumber}\nRedirecting to Research Checklist...`);
          window.location.href = `research-checklist.html?claimId=${claimNumber}`;
        }
      }

      function createResearchList(claimNumber) {
        alert(`Creating research list for: ${claimNumber}\nRedirecting to Research Checklist...`);
        window.location.href = `research-checklist.html?claimId=${claimNumber}`;
      }

      function viewAllClaims() {
        alert("Redirecting to claims management dashboard...");
        // Placeholder - you would create an all-claims.html page
        alert("All claims page not yet created");
      }

      function generateReport() {
        alert("Opening report generation wizard...");
        // Placeholder - you would create a reports.html page
        alert("Reports page not yet created");
      }

      function manageUsers() {
        alert("Opening user management panel...");
        // Placeholder - you would create a user-management.html page
        alert("User management page not yet created");
      }

      // Initialize page
      document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('claimSearch').focus();
      });
