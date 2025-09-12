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