// Sample data with female Arabic names
        const teachers = [
            { id: 1, name: "Khouloud Ahmed", subject: "Mathematics" },
            { id: 2, name: "Amina Khalid", subject: "Science" },
            { id: 3, name: "Fatima Mahmoud", subject: "English" },
            { id: 4, name: "Noura Ali", subject: "History" },
            { id: 5, name: "Leila Mohammed", subject: "Art" }
        ];
        
        const substitutes = [
            { id: 101, name: "Yasmin Abdullah", subjects: ["Mathematics", "Science"] },
            { id: 102, name: "Rania Mohammed", subjects: ["English", "History"] },
            { id: 103, name: "Samira Hassan", subjects: ["Science", "Mathematics"] },
            { id: 104, name: "Huda Ibrahim", subjects: ["Art", "English"] },
            { id: 105, name: "Mona Rashid", subjects: ["History", "Science"] }
        ];
        
        // Sample schedule data (teacher ID -> period -> {substitute ID, section})
        const scheduleData = {
            1: [
                {substituteId: 101, section: "5/1"}, 
                null, 
                {substituteId: 103, section: "5/3"}, 
                null, 
                null, 
                {substituteId: 102, section: "6/2"}, 
                null, 
                {substituteId: 104, section: "7/4"}
            ],
            2: [
                null, 
                {substituteId: 102, section: "6/2"}, 
                null, 
                {substituteId: 103, section: "5/3"}, 
                null, 
                null, 
                {substituteId: 105, section: "8/1"}, 
                null
            ],
            3: [
                {substituteId: 104, section: "7/4"}, 
                null, 
                null, 
                {substituteId: 102, section: "6/2"}, 
                null, 
                {substituteId: 103, section: "5/3"}, 
                null, 
                null
            ],
            4: [
                null, 
                {substituteId: 105, section: "8/1"}, 
                {substituteId: 101, section: "5/1"}, 
                null, 
                null, 
                null, 
                {substituteId: 102, section: "6/2"}, 
                null
            ],
            5: [
                {substituteId: 103, section: "5/3"}, 
                null, 
                null, 
                {substituteId: 104, section: "7/4"}, 
                null, 
                null, 
                null, 
                {substituteId: 101, section: "5/1"}
            ]
        };
        
        // DOM elements
        const teacherList = document.getElementById('teacherList');
        const showSubstitutesBtn = document.getElementById('showSubstitutesBtn');
        const substituteSection = document.getElementById('substituteSection');
        const selectedTeacherName = document.getElementById('selectedTeacherName');
        const substituteRow = document.getElementById('substituteRow');
        const suggestAlternativesBtn = document.getElementById('suggestAlternativesBtn');
        const saveBtn = document.getElementById('saveBtn');
        const saveSuccess = document.getElementById('saveSuccess');
        const emailBtn = document.getElementById('emailBtn');
        const whatsappBtn = document.getElementById('whatsappBtn');
        const notificationSuccess = document.getElementById('notificationSuccess');
        const alternativesModal = document.getElementById('alternativesModal');
        const closeModal = document.querySelector('.close');
        const selectedPeriod = document.getElementById('selectedPeriod');
        const currentSubstitute = document.getElementById('currentSubstitute');
        const alternativeList = document.getElementById('alternativeList');
        const confirmAlternativeBtn = document.getElementById('confirmAlternativeBtn');
        
        // State variables
        let selectedTeacherId = null;
        let selectedCell = null;
        let selectedPeriodNumber = null;
        let selectedAlternative = null;
        
        // Initialize the teacher list
        function initializeTeacherList() {
            teacherList.innerHTML = '';
            teachers.forEach(teacher => {
                const card = document.createElement('div');
                card.className = 'teacher-card';
                card.textContent = `${teacher.name} (${teacher.subject})`;
                card.dataset.teacherId = teacher.id;
                card.addEventListener('click', () => selectTeacher(teacher.id));
                teacherList.appendChild(card);
            });
        }
        
        // Select a teacher
        function selectTeacher(teacherId) {
            selectedTeacherId = teacherId;
            
            // Update UI
            document.querySelectorAll('.teacher-card').forEach(card => {
                card.classList.toggle('selected', card.dataset.teacherId == teacherId);
            });
            
            showSubstitutesBtn.disabled = false;
            
            // Store the selected teacher's name
            const teacher = teachers.find(t => t.id == teacherId);
            selectedTeacherName.textContent = `${teacher.name} (${teacher.subject})`;
        }
        
        // Show substitutes for selected teacher
        function showSubstitutes() {
            if (!selectedTeacherId) return;
            
            // Clear previous substitutes
            while (substituteRow.children.length > 1) {
                substituteRow.removeChild(substituteRow.lastChild);
            }
            
            // Get the schedule for the selected teacher
            const schedule = scheduleData[selectedTeacherId] || Array(8).fill(null);
            
            // Add substitute cells for each period
            for (let i = 0; i < 8; i++) {
                const periodData = schedule[i];
                const substitute = periodData ? substitutes.find(s => s.id == periodData.substituteId) : null;
                
                const cell = document.createElement('td');
                cell.className = 'substitute-cell';
                cell.dataset.period = i + 1;
                
                if (periodData) {
                    cell.dataset.substituteId = periodData.substituteId;
                    cell.innerHTML = `
                        <span class="teacher-name">${substitute.name}</span>
                        <span class="section-number">${periodData.section}</span>
                    `;
                } else {
                    cell.innerHTML = '&nbsp;'; // Empty cell with non-breaking space
                }
                
                cell.addEventListener('click', () => selectSubstituteCell(cell, i + 1));
                substituteRow.appendChild(cell);
            }
            
            substituteSection.style.display = 'block';
            suggestAlternativesBtn.disabled = true;
        }
        
        // Select a substitute cell
        function selectSubstituteCell(cell, period) {
            // Deselect previous cell
            if (selectedCell) {
                selectedCell.classList.remove('selected');
            }
            
            // Select new cell
            cell.classList.add('selected');
            selectedCell = cell;
            selectedPeriodNumber = period;
            
            // Enable suggest alternatives button if there's a substitute assigned
            suggestAlternativesBtn.disabled = !cell.dataset.substituteId;
        }
        
        // Show alternatives modal
        function showAlternatives() {
            if (!selectedCell || !selectedPeriodNumber) return;
            
            // Set modal content
            selectedPeriod.textContent = selectedPeriodNumber;
            currentSubstitute.textContent = selectedCell.querySelector('.teacher-name')?.textContent || '';
            
            // Clear previous alternatives
            alternativeList.innerHTML = '';
            
            // Get the teacher's subject to find suitable substitutes
            const teacher = teachers.find(t => t.id == selectedTeacherId);
            const suitableSubstitutes = substitutes.filter(sub => 
                sub.subjects.includes(teacher.subject) && sub.id != selectedCell.dataset.substituteId
            );
            
            // Add "Not assigned" option
            const notAssignedCard = document.createElement('div');
            notAssignedCard.className = 'alternative-card';
            notAssignedCard.textContent = "Not assigned";
            notAssignedCard.dataset.substituteId = '';
            notAssignedCard.addEventListener('click', () => selectAlternative(notAssignedCard, null));
            alternativeList.appendChild(notAssignedCard);
            
            // Add suitable substitutes
            suitableSubstitutes.forEach(sub => {
                const card = document.createElement('div');
                card.className = 'alternative-card';
                card.textContent = sub.name;
                card.dataset.substituteId = sub.id;
                card.addEventListener('click', () => selectAlternative(card, sub));
                alternativeList.appendChild(card);
            });
            
            // Show modal
            alternativesModal.style.display = 'block';
        }
        
        // Select an alternative substitute
        function selectAlternative(card, substitute) {
            // Deselect previous selection
            document.querySelectorAll('.alternative-card').forEach(c => {
                c.style.backgroundColor = '';
            });
            
            // Select new one
            card.style.backgroundColor = '#7a0d5e';
            
            // Store selection
            selectedAlternative = substitute;
        }
        
        // Confirm alternative selection
        function confirmAlternative() {
            if (!selectedCell || !selectedPeriodNumber) return;
            
            // Generate random section number (grade 1-8 / section 1-4)
            const randomGrade = Math.floor(Math.random() * 8) + 1;
            const randomSection = Math.floor(Math.random() * 4) + 1;
            const section = `${randomGrade}/${randomSection}`;
            
            if (selectedAlternative) {
                selectedCell.innerHTML = `
                    <span class="teacher-name">${selectedAlternative.name}</span>
                    <span class="section-number">${section}</span>
                `;
                selectedCell.dataset.substituteId = selectedAlternative.id;
            } else {
                selectedCell.innerHTML = '&nbsp;'; // Empty cell with non-breaking space
                delete selectedCell.dataset.substituteId;
            }
            
            // Close modal
            alternativesModal.style.display = 'none';
            suggestAlternativesBtn.disabled = !selectedCell.dataset.substituteId;
        }
        
        // Save changes
        function saveChanges() {
            // In a real application, you would send data to server here
            saveSuccess.style.display = 'inline';
            setTimeout(() => {
                saveSuccess.style.display = 'none';
            }, 3000);
        }
        
        // Send notifications
        function sendNotification() {
            notificationSuccess.style.display = 'block';
            setTimeout(() => {
                notificationSuccess.style.display = 'none';
            }, 3000);
        }
        
        // Event listeners
        showSubstitutesBtn.addEventListener('click', showSubstitutes);
        suggestAlternativesBtn.addEventListener('click', showAlternatives);
        saveBtn.addEventListener('click', saveChanges);
        emailBtn.addEventListener('click', sendNotification);
        whatsappBtn.addEventListener('click', sendNotification);
        closeModal.addEventListener('click', () => {
            alternativesModal.style.display = 'none';
        });
        confirmAlternativeBtn.addEventListener('click', confirmAlternative);
        
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target == alternativesModal) {
                alternativesModal.style.display = 'none';
            }
        });
        
        // Initialize the page
        initializeTeacherList();