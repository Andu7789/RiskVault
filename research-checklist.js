
      function updateProgress() {
        document.querySelectorAll(".checklist-table tbody tr").forEach(row => {
          row.style.backgroundColor = "";
        });
        
        // Get all checked checkboxes
        const checkedCheckboxes = Array.from(document.querySelectorAll(".checkbox-cell input[type='checkbox']")).filter((cb) => cb.checked);
        const totalSearches = checkedCheckboxes.length;

        let completedCount = 0;
        let pendingCount = 0;
        let unableCount = 0;

        // Analyze each checked checkbox row
        checkedCheckboxes.forEach((cb) => {
          const row = cb.closest("tr");
          if (!row) return;

          const dateField = row.querySelector(".date-input");
          const unableSelect = row.querySelector(".unable-select");

          // If date is filled, count as completed
          if (dateField && dateField.value && dateField.value !== "") {
            completedCount++;
            row.style.backgroundColor = "#97caa0ff";
            cb.style.accentColor = "#0d601bff";
          }
          // If no date but unable-select has value, count as completed
          else if (unableSelect && unableSelect.value && unableSelect.value !== "") {
            completedCount++;
            unableCount++;
            row.style.backgroundColor = "#97caa0ff";
            cb.style.accentColor = "#0d601bff";
          }
          // If neither date nor unable-select, count as pending
          else {
            pendingCount++;
            row.style.backgroundColor = "#d38b8bff";
            cb.style.accentColor = "#f31515ff";
          }
        });

        // Update counters
        document.getElementById("total-searches").textContent = totalSearches;
        document.getElementById("completed-count").textContent = completedCount;
        document.getElementById("pending-count").textContent = pendingCount;
        document.getElementById("unable-count").textContent = unableCount;

        // Calculate progress percentage
        const progressPercentage = totalSearches > 0 ? (completedCount / totalSearches) * 100 : 0;
        document.getElementById("progress-fill").style.width = progressPercentage + "%";
        document.getElementById("progress-text").textContent = `${Math.round(progressPercentage)}% Complete (${completedCount}/${totalSearches})`;
      }

      function updateClaimNumber() {
        const newClaimNumber = document.getElementById("claimNumberInput").value.trim();
        if (newClaimNumber) {
          // Update sidebar claim number
          document.querySelector(".claim-number").textContent = `Claim File: #${newClaimNumber}`;
          
          // Show confirmation
          const btn = document.querySelector(".claim-input-btn");
          const originalText = btn.textContent;
          btn.textContent = "Updated!";
          btn.style.background = "#38a169";
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = "#3182ce";
          }, 2000);
        }
      }

      // Initialize progress on page load
      document.addEventListener("DOMContentLoaded", function () {
        updateProgress();
      });

      // Add event listeners to checkboxes
      document.querySelectorAll(".checkbox-cell input[type='checkbox']").forEach((checkbox) => {
        checkbox.addEventListener("change", updateProgress);
      });

      // Add event listeners to date fields
      document.querySelectorAll(".date-input").forEach((dateField) => {
        dateField.addEventListener("change", function () {
          const row = this.closest("tr");
          if (row) {
            const unableSelect = row.querySelector(".unable-select");
            if (unableSelect) {
              if (this.value && this.value !== "") {
                unableSelect.style.display = "none";
                unableSelect.value = "";
              } else {
                unableSelect.style.display = "";
              }
            }
          }
          updateProgress();
        });
      });

      // Add event listeners to unable-select dropdowns
      document.querySelectorAll(".unable-select").forEach((select) => {
        select.addEventListener("change", updateProgress);
      });

      // Allow Enter key on claim input
      document.getElementById("claimNumberInput").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          updateClaimNumber();
        }
      });
