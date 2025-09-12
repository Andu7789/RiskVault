function updateProgress() {

    document.querySelectorAll(".checklist-table tbody tr").forEach(row => {
    row.style.backgroundColor = "";
    });
    // Get all checked checkboxes
    const checkedCheckboxes = Array.from(document.querySelectorAll(".checkbox-cell input[type='checkbox']")).filter((cb) => cb.checked);
    const totalSearches = checkedCheckboxes.length;

    let completedCount = 0;
    let pendingCount = 0;

    // Analyze each checked checkbox row
    checkedCheckboxes.forEach((cb) => {
        const row = cb.closest("tr");
        if (!row) return;

        const dateField = row.querySelector(".date-input");
        const unableSelect = row.querySelector(".unable-select");

        // If date is filled, count as completed
        if (dateField && dateField.value && dateField.value !== "") {
        completedCount++;
        row.style.backgroundColor = "#62d775ff"; // Light green background for completed
        }
        // If no date but unable-select has value, count as completed
        else if (unableSelect && unableSelect.value && unableSelect.value !== "") {
        completedCount++;
        row.style.backgroundColor = "#62d775ff"; // Light green background for completed
        }
        // If neither date nor unable-select, count as pending
        else {
        pendingCount++;
            row.style.backgroundColor = "#ff7f7f"; // Light red background for pending
        }
    });

  // Update counters
  document.getElementById("total-searches").textContent = totalSearches;
  document.getElementById("completed-count").textContent = completedCount;
  document.getElementById("pending-count").textContent = pendingCount;

  // Calculate and update progress percentage
  const progressPercentage = totalSearches > 0 ? (completedCount / totalSearches) * 100 : 0;
  document.getElementById("progress-fill").style.width = progressPercentage + "%";
  document.getElementById("progress-text").textContent = `${Math.round(progressPercentage)}% Complete (${completedCount}/${totalSearches})`;
}

// Initialize progress on page load
document.addEventListener("DOMContentLoaded", function () {
  updateProgress();
});

// Add event listeners to checkboxes
document.querySelectorAll(".checkbox-cell input[type='checkbox']").forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    updateProgress();
  });
});

// Add event listeners to date fields
document.querySelectorAll(".date-input").forEach((dateField) => {
  dateField.addEventListener("change", function () {
    // Get the row and unable-select for this date field
    const row = this.closest("tr");
    if (row) {
      const unableSelect = row.querySelector(".unable-select");
      if (unableSelect) {
        // Hide unable-select and clear its value if date is filled
        if (this.value && this.value !== "") {
          unableSelect.style.display = "none";
          unableSelect.value = ""; // Clear the selection
        } else {
          unableSelect.style.display = ""; // Show if date is cleared
        }
      }
    }
    updateProgress();
  });
}); // Add event listeners to unable-select dropdowns
document.querySelectorAll(".unable-select").forEach((select) => {
  select.addEventListener("change", function () {
    updateProgress();
  });
});
