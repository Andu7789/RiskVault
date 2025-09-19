let importedData = [];
let selectedData = [];
let currentFile = null;
let filteredData = []; // Store filtered results
let highlightNames = ["Andy Britain", "Jessica Hall"]; // Array of names to highlight
let postcodes = ["NR11 8NT", "MK45 3GH"]; // Array of postcodes to highlight
let carReg = ["N78 OJU", "L99 GTY"]; // Array of car registrations to highlight

// File upload handling
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const tableBody = document.getElementById('tableBody');

// Drag and drop events
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    if (!file) return;

    // Validate file type
    const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx)$/i)) {
        showAlert('Please select a valid Excel file (.xls or .xlsx)', 'error');
        return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        showAlert('File size must be less than 10MB', 'error');
        return;
    }

    currentFile = file;
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    fileInfo.classList.add('show');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function processFile() {
    if (!currentFile) return;

    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const processBtn = document.getElementById('processBtn');

    processBtn.disabled = true;
    progressBar.style.display = 'block';
    progressFill.style.width = '20%';

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            progressFill.style.width = '60%';

            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Get first worksheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            progressFill.style.width = '80%';

            if (jsonData.length === 0) {
                showAlert('No data found in the Excel file', 'error');
                resetUpload();
                return;
            }

            importedData = jsonData;
            filteredData = [...jsonData]; // Initialize filtered data
            displayDataTable(jsonData);

            progressFill.style.width = '100%';

            setTimeout(() => {
                showAlert(`Successfully imported ${jsonData.length} records`, 'success');
                resetUpload();
            }, 500);

        } catch (error) {
            console.error('Error processing file:', error);
            showAlert('Error processing file: ' + error.message, 'error');
            resetUpload();
        }
    };

    reader.readAsArrayBuffer(currentFile);
}

function displayDataTable(data) {
    if (data.length === 0) return;

    const tableContainer = document.getElementById('dataTableContainer');
    const tableHead = document.getElementById('tableHead');
    const tableStats = document.getElementById('tableStats');

    // Clear existing content
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    // Get column headers
    const headers = Object.keys(data[0]);

    // Create header row
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    // Add action column
    const actionTh = document.createElement('th');
    actionTh.textContent = 'Action';
    actionTh.classList.add('action-column');
    headerRow.appendChild(actionTh);

    tableHead.appendChild(headerRow);

    // Create data rows
    data.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-original-index', index);

        // headers.forEach(header => {
        //     const td = document.createElement('td');
        //     td.textContent = row[header] || '';
        //     tr.appendChild(td);
        // });

        headers.forEach(header => {
            const td = document.createElement('td');
            const cellValue = row[header] || '';
            
            // Always process for highlighting (returns original if no matches)
            td.innerHTML = highlightValuesInCell(cellValue);
            
            tr.appendChild(td);
        })

        // Add action button
        const actionTd = document.createElement('td');
        actionTd.classList.add('action-column');
        actionTd.innerHTML = `<button class="btn btn-success btn-small" onclick="selectRow(${index})">Add</button>`;
        tr.appendChild(actionTd);

        tableBody.appendChild(tr);
    });

    // Update stats and show table
    tableStats.textContent = `${data.length} rows imported`;
    tableContainer.classList.add('show');

    // Setup column filter and show search section
    setupColumnFilter(data);
}

function setupColumnFilter(data) {
    if (data.length === 0) return;

    const columnFilter = document.getElementById('columnFilter');
    const searchFilterSection = document.getElementById('searchFilterSection');

    // Clear existing options
    columnFilter.innerHTML = '<option value="">All Columns</option>';

    // Add column options
    const headers = Object.keys(data[0]);
    headers.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        columnFilter.appendChild(option);
    });

    // Show search section
    searchFilterSection.style.display = 'block';
    updateFilterStats();
}

function filterData() {
    const searchInput = document.getElementById('searchInput');
    const columnFilter = document.getElementById('columnFilter');
    const searchClearBtn = document.getElementById('searchClearBtn');

    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedColumn = columnFilter.value;

    // Show/hide clear button
    searchClearBtn.style.display = searchTerm ? 'block' : 'none';

    if (!searchTerm) {
        filteredData = [...importedData];
    } else {
        filteredData = importedData.filter(row => {
            if (selectedColumn) {
                // Search in specific column
                const cellValue = row[selectedColumn];
                return cellValue && cellValue.toString().toLowerCase().includes(searchTerm);
            } else {
                // Search across all columns
                return Object.values(row).some(cellValue =>
                    cellValue && cellValue.toString().toLowerCase().includes(searchTerm)
                );
            }
        });
    }

    displayFilteredTable(filteredData);
    updateFilterStats();
}

function updateFilterStats() {
    const filterStats = document.getElementById('filterStats');
    const totalRows = importedData.length;
    const filteredRows = filteredData.length;

    if (filteredRows === totalRows) {
        filterStats.textContent = `Showing all ${totalRows} records`;
    } else {
        filterStats.textContent = `Showing ${filteredRows} of ${totalRows} records`;
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');

    searchInput.value = '';
    searchClearBtn.style.display = 'none';
    filterData();
}

function clearFilters() {
    const searchInput = document.getElementById('searchInput');
    const columnFilter = document.getElementById('columnFilter');
    const searchClearBtn = document.getElementById('searchClearBtn');

    searchInput.value = '';
    columnFilter.value = '';
    searchClearBtn.style.display = 'none';

    filteredData = [...importedData];
    displayFilteredTable(filteredData);
    updateFilterStats();
}

function displayFilteredTable(data) {
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');

    // Clear existing content
    tableBody.innerHTML = '';

    if (data.length === 0) {
        // Show no results message
        const noResultsRow = document.createElement('tr');
        const noResultsCell = document.createElement('td');
        noResultsCell.colSpan = 100; // Span all columns
        noResultsCell.className = 'no-results-row';
        noResultsCell.textContent = 'No matching records found. Try adjusting your search criteria.';
        noResultsRow.appendChild(noResultsCell);
        tableBody.appendChild(noResultsRow);
        return;
    }

    // Get column headers
    const headers = Object.keys(data[0]);

    // Create data rows
    data.forEach((row, index) => {
        // Find the original index in the unfiltered data
        const originalIndex = importedData.findIndex(originalRow =>
            JSON.stringify(originalRow) === JSON.stringify(row)
        );

        const tr = document.createElement('tr');
        tr.setAttribute('data-original-index', originalIndex);

        // headers.forEach(header => {
        //     const td = document.createElement('td');
        //     td.textContent = row[header] || '';
        //     tr.appendChild(td);
        // });

        headers.forEach(header => {
            const td = document.createElement('td');
            const cellValue = row[header] || '';
            
            // Always process for highlighting (returns original if no matches)
            td.innerHTML = highlightValuesInCell(cellValue);
            
            tr.appendChild(td);
        })

        // Add action button
        const actionTd = document.createElement('td');
        actionTd.classList.add('action-column');
        actionTd.innerHTML = `<button class="btn btn-success btn-small" onclick="selectRow(${originalIndex})">Add</button>`;
        tr.appendChild(actionTd);

        tableBody.appendChild(tr);
    });

    highlightSelectedRows();
}

function selectRow(index) {
    const row = importedData[index];
    if (!row) return;

    // Check if already selected
    const exists = selectedData.some(item => JSON.stringify(item.data) === JSON.stringify(row));
    if (exists) {
        showAlert('This record is already selected', 'error');
        return;
    }

    // Add to selected data
    selectedData.push({
        id: Date.now() + Math.random(),
        data: row,
        selectedAt: new Date().toLocaleString()
    });

    updateSelectedDisplay();
    highlightSelectedRows(); // Highlight the new row
    showAlert('Record added to selection', 'success');
}

function updateSelectedDisplay() {
    const selectedSection = document.getElementById('selectedDataSection');
    const selectedItems = document.getElementById('selectedItems');
    const selectedCount = document.getElementById('selectedCount');

    if (selectedData.length === 0) {
        selectedSection.classList.remove('show');
        return;
    }

    selectedSection.classList.add('show');
    selectedCount.textContent = `${selectedData.length} selected`;

    selectedItems.innerHTML = '';

    selectedData.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'selected-item';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'selected-item-header';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'selected-item-title';
        titleDiv.textContent = `Record ${index + 1}`;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => removeSelected(item.id);

        headerDiv.appendChild(titleDiv);
        headerDiv.appendChild(removeBtn);

        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'table-responsive';
        
        const dataTable = document.createElement('table');
        dataTable.className = 'selected-data-table';

        const tableHead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        Object.keys(item.data).forEach(key => {
            const th = document.createElement('th');
            th.textContent = key;
            headerRow.appendChild(th);
        });
        tableHead.appendChild(headerRow);
        dataTable.appendChild(tableHead);

        const tableBody = document.createElement('tbody');
        const dataRow = document.createElement('tr');
        Object.values(item.data).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value || 'N/A';
            dataRow.appendChild(td);
        });
        tableBody.appendChild(dataRow);
        dataTable.appendChild(tableBody);

        tableWrapper.appendChild(dataTable);
        
        itemDiv.appendChild(headerDiv);
        itemDiv.appendChild(tableWrapper);
        selectedItems.appendChild(itemDiv);
    });
}

function removeSelected(id) {
    selectedData = selectedData.filter(item => item.id !== id);
    updateSelectedDisplay();
    highlightSelectedRows(); // Update highlight after removal
    showAlert('Record removed from selection', 'success');
}

function clearSelected() {
    selectedData = [];
    updateSelectedDisplay();
    highlightSelectedRows(); // Clear all highlights
    showAlert('All selected records cleared', 'success');
}

function exportJSON() {
    if (selectedData.length === 0) {
        showAlert('No records selected for export', 'error');
        return;
    }

    const exportData = selectedData.map(item => item.data);
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create and download file
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riskvault_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showAlert('JSON file exported successfully', 'success');
}

function toggleJSONPreview() {
    const preview = document.getElementById('jsonPreview');
    if (preview.style.display === 'none' || !preview.style.display) {
        if (selectedData.length === 0) {
            showAlert('No data to preview', 'error');
            return;
        }
        const exportData = selectedData.map(item => item.data);
        preview.textContent = JSON.stringify(exportData, null, 2);
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
}

function clearData() {
    importedData = [];
    selectedData = [];
    filteredData = [];
    document.getElementById('dataTableContainer').classList.remove('show');
    document.getElementById('selectedDataSection').classList.remove('show');
    document.getElementById('searchFilterSection').style.display = 'none';

    // Clear search inputs
    document.getElementById('searchInput').value = '';
    document.getElementById('columnFilter').innerHTML = '<option value="">All Columns</option>';
    document.getElementById('searchClearBtn').style.display = 'none';

    showAlert('All data cleared', 'success');
}

function resetUpload() {
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const processBtn = document.getElementById('processBtn');

    setTimeout(() => {
        progressBar.style.display = 'none';
        progressFill.style.width = '0%';
        processBtn.disabled = false;
        fileInfo.classList.remove('show');
        fileInput.value = '';
        currentFile = null;
    }, 1000);
}

function showAlert(message, type = 'success') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    // Insert at the top of main container
    const mainContainer = document.querySelector('.main-container');
    mainContainer.insertBefore(alert, mainContainer.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

function highlightSelectedRows() {
    const tableRows = tableBody.querySelectorAll('tr');
    const selectedIndices = selectedData.map(item => importedData.findIndex(d => JSON.stringify(d) === JSON.stringify(item.data)));

    tableRows.forEach(row => {
        const originalIndex = parseInt(row.getAttribute('data-original-index'), 10);
        if (selectedIndices.includes(originalIndex)) {
            row.classList.add('selected-row');
        } else {
            row.classList.remove('selected-row');
        }
    });
}

function highlightValuesInCell(cellValue) {
    if (!cellValue || typeof cellValue !== 'string') return cellValue;
    
    let highlightedValue = cellValue;
    
    // Loop through each name and highlight it
    highlightNames.forEach(name => {
        const regex = new RegExp(`(${name})`, 'gi');
        highlightedValue = highlightedValue.replace(regex, '<span class="highlighted-name">$1</span>');
    });
    
    // Loop through each postcode and highlight it
    postcodes.forEach(postcode => {
        const regex = new RegExp(`(${postcode})`, 'gi');
        highlightedValue = highlightedValue.replace(regex, '<span class="highlighted-name">$1</span>');
    });

    // Loop through each car registration and highlight it
    carReg.forEach(reg => {
        const regex = new RegExp(`(${reg})`, 'gi');
        highlightedValue = highlightedValue.replace(regex, '<span class="highlighted-name">$1</span>');
    });
    
    return highlightedValue;
}

function updateHighlightNames(newNames) {
    if (Array.isArray(newNames)) {
        highlightNames = newNames;
        refreshTableDisplay();
    }
}

// Function to update the highlight postcodes array
function updateHighlightPostcodes(newPostcodes) {
    if (Array.isArray(newPostcodes)) {
        postcodes = newPostcodes;
        refreshTableDisplay();
    }
}

// Function to update the highlight car registrations array
function updateHighlightCarReg(newCarReg) {
    if (Array.isArray(newCarReg)) {
        carReg = newCarReg;
        refreshTableDisplay();
    }
}

// Helper function to refresh the table display
function refreshTableDisplay() {
    if (filteredData.length > 0) {
        displayFilteredTable(filteredData);
    } else if (importedData.length > 0) {
        displayDataTable(importedData);
    }
}

// updateHighlightNames(["Fiona Clark", "Mary Johnson"]);