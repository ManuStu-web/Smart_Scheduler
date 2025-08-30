document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const loginScreen = document.getElementById('login-screen');
    const setupScreen = document.getElementById('setup-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const teacherScreen = document.getElementById('teacher-screen');
    
    const loginButton = document.getElementById('login-button');
    const manageTeachersButton = document.getElementById('manage-teachers-button');
    const backToDashboardButton = document.getElementById('back-to-dashboard-button');
    const backToSetupButton = document.getElementById('back-to-setup-button');
    const printButton = document.getElementById('print-button');

    // Setup screen elements
    const numPeriodsInput = document.getElementById('num-periods');
    const includeSaturdayCheckbox = document.getElementById('include-saturday');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    const lunchPeriodSelect = document.getElementById('lunch-period-select');
    const generateDashboardButton = document.getElementById('generate-dashboard-button');

    const timetableHead = document.getElementById('timetable-head');
    const timetableBody = document.getElementById('timetable-body');
    const sidebarTeacherList = document.getElementById('sidebar-teacher-list');
    const addTeacherForm = document.getElementById('add-teacher-form');
    const teachersListContainer = document.getElementById('teachers-list');
    
    // Modal elements
    const substitutionModal = document.getElementById('substitution-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const substituteList = document.getElementById('substitute-list');
    const closeModalButton = document.getElementById('close-modal-button');

    // --- DATA STRUCTURES & State ---
    let teachers = [
        { id: 1, name: 'Mr. John Smith', subjects: ['Math', 'Science'], isAbsent: false },
        { id: 2, name: 'Ms. Emily White', subjects: ['English', 'Lab'], isAbsent: false },
        { id: 3, name: 'Dr. David Green', subjects: ['Science', 'Lab'], isAbsent: false },
        { id: 4, name: 'Mrs. Sarah Jones', subjects: ['Math', 'CS'], isAbsent: false },
        { id: 5, name: 'Mr. Paul Brown', subjects: ['English'], isAbsent: true },
    ];

    let timeSlots = [];
    let days = [];
    let timetableGrid = {};
    
    const subjectColorMap = new Map();
    let nextColorIndex = 1;

    // --- FUNCTIONS ---

    const getColorClassForSubject = (subject) => {
        if (!subject) return 'empty';
        if (subject.toLowerCase() === 'lunch') return 'lunch';
        if (!subjectColorMap.has(subject)) {
            subjectColorMap.set(subject, `color-${nextColorIndex}`);
            nextColorIndex = (nextColorIndex % 10) + 1;
        }
        return subjectColorMap.get(subject);
    };

    const generateTimeSlotInputs = () => {
        const numPeriods = parseInt(numPeriodsInput.value);
        let currentTimes = [];
        const timeInputs = Array.from(timeSlotsContainer.querySelectorAll('.time-slot-input'));
        
        // Preserve existing times if number of periods hasn't changed
        if (timeInputs.length === numPeriods) {
            currentTimes = timeInputs.map(input => input.value);
        }

        timeSlotsContainer.innerHTML = '';

        if (numPeriods > 0 && numPeriods <= 12) {
            for (let i = 1; i <= numPeriods; i++) {
                // Use preserved time or generate default
                const timeValue = currentTimes[i-1] || `${(i + 8).toString().padStart(2, '0')}:00-${(i + 9).toString().padStart(2, '0')}:00`;
                const formGroup = document.createElement('div');
                formGroup.className = 'form-group';
                formGroup.innerHTML = `<label for="period-${i}">Period ${i} Time</label><input type="text" id="period-${i}" class="time-slot-input" value="${timeValue}">`;
                timeSlotsContainer.appendChild(formGroup);
            }
            updateLunchSelector();
            generateDashboardButton.classList.remove('hidden');
        } else {
            generateDashboardButton.classList.add('hidden');
        }
    };
    
    const updateLunchSelector = () => {
        const timeInputs = Array.from(document.querySelectorAll('.time-slot-input'));
        const selectedValue = lunchPeriodSelect.value;
        lunchPeriodSelect.innerHTML = '<option value="none">None</option>';
        timeInputs.forEach((input, index) => {
            const option = document.createElement('option');
            option.value = input.value;
            option.textContent = `Period ${index + 1} (${input.value})`;
            lunchPeriodSelect.appendChild(option);
        });
        if (Array.from(lunchPeriodSelect.options).some(opt => opt.value === selectedValue)) {
            lunchPeriodSelect.value = selectedValue;
        }
    }
    
    const initializeTimetableGrid = () => {
        const lunchTimeSlot = lunchPeriodSelect.value;
        timetableGrid = {};
        timeSlots.forEach(time => {
            timetableGrid[time] = {};
            days.forEach(day => {
                if (time === lunchTimeSlot && lunchTimeSlot !== 'none') {
                    timetableGrid[time][day] = { subject: 'Lunch', teacherId: null };
                } else {
                    timetableGrid[time][day] = { subject: null, teacherId: null };
                }
            });
        });
    };

    const getTeacherById = (id) => teachers.find(t => t.id === id);

    const renderDashboard = () => {
        // PIVOTED LOGIC: Render Time as columns, Day as rows
        timetableHead.innerHTML = '';
        const headerRow = document.createElement('tr');
        let headerHTML = '<th>Day</th>';
        timeSlots.forEach(time => {
            headerHTML += `<th>${time}</th>`;
        });
        headerRow.innerHTML = headerHTML;
        timetableHead.appendChild(headerRow);
        
        timetableBody.innerHTML = '';
        days.forEach(day => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${day}</td>`; // Day name is the first cell of the row
            
            timeSlots.forEach(time => {
                const cell = document.createElement('td');
                const classInfo = timetableGrid[time][day];
                const teacher = classInfo.teacherId ? getTeacherById(classInfo.teacherId) : null;
                
                const slotDiv = document.createElement('div');
                const colorClass = getColorClassForSubject(classInfo.subject);
                slotDiv.className = `subject-cell subject-${colorClass}`;

                if (classInfo.subject === 'Lunch') {
                    slotDiv.classList.add('fixed-slot');
                }
                slotDiv.dataset.time = time;
                slotDiv.dataset.day = day;

                let cellHTML = `<div class="subject-name">${classInfo.subject || ''}</div><div class="teacher-name">${teacher ? teacher.name : ''}</div>`;
                if(classInfo.subject && classInfo.subject !== 'Lunch') {
                    cellHTML += `<button class="remove-slot-btn" data-time="${time}" data-day="${day}">&times;</button>`;
                }
                slotDiv.innerHTML = cellHTML;

                if (teacher && teacher.isAbsent) {
                    slotDiv.classList.add('absent-slot');
                    slotDiv.addEventListener('click', () => handleAbsentSlotClick(time, day));
                }
                
                cell.appendChild(slotDiv);
                row.appendChild(cell);
            });
            timetableBody.appendChild(row);
        });
        
        renderSidebar();
        initDragAndDrop();
    };

    const renderSidebar = () => {
        sidebarTeacherList.innerHTML = '';
        teachers.forEach(teacher => {
            const li = document.createElement('li');
            li.className = 'sidebar-teacher-item';
            li.dataset.teacherId = teacher.id;
            li.dataset.subject = teacher.subjects[0]; 
            li.innerHTML = `<div class="teacher-name">${teacher.name}</div><span class="teacher-subjects">${teacher.subjects.join(', ')}</span>`;
            sidebarTeacherList.appendChild(li);
        });
    };

    const initDragAndDrop = () => {
        new Sortable(sidebarTeacherList, {
            group: { name: 'timetable', pull: 'clone', put: false },
            sort: false,
            animation: 150,
        });

        new Sortable(timetableBody, {
            group: 'timetable',
            animation: 150,
            ghostClass: 'sortable-ghost',
            filter: '.fixed-slot',
            draggable: '.subject-cell',
            onAdd: (evt) => {
                const itemEl = evt.item;
                itemEl.style.display = 'none';
                const targetEl = document.elementFromPoint(evt.originalEvent.clientX, evt.originalEvent.clientY);
                itemEl.style.display = '';
                
                const targetCell = targetEl ? targetEl.closest('.subject-cell') : null;

                if (targetCell && !targetCell.classList.contains('fixed-slot')) {
                    const time = targetCell.dataset.time;
                    const day = targetCell.dataset.day;
                    
                    if (time && day && !timetableGrid[time][day].subject) {
                        const teacherId = parseInt(itemEl.dataset.teacherId);
                        const subject = itemEl.dataset.subject;
                        timetableGrid[time][day] = { subject, teacherId };
                    }
                }
                
                itemEl.remove();
                renderDashboard();
            },
            onEnd: (evt) => {
                const startCell = evt.item;
                const endCell = evt.to.querySelector('.subject-cell:hover'); // More direct way to find target

                if (startCell && endCell && startCell !== endCell) {
                    const fromTime = startCell.dataset.time;
                    const fromDay = startCell.dataset.day;
                    const toTime = endCell.dataset.time;
                    const toDay = endCell.dataset.day;

                    // Check if both are valid and target is not fixed
                    if (fromTime && fromDay && toTime && toDay && !endCell.classList.contains('fixed-slot')) {
                        const fromData = timetableGrid[fromTime][fromDay];
                        const toData = timetableGrid[toTime][toDay];
                        
                        // Swap the data in the model
                        timetableGrid[fromTime][fromDay] = toData;
                        timetableGrid[toTime][toDay] = fromData;
                    }
                }
                renderDashboard();
            }
        });
    };

    const renderTeachersList = () => {
        teachersListContainer.innerHTML = '';
        teachers.forEach(teacher => {
            const li = document.createElement('li');
            li.className = teacher.isAbsent ? 'absent' : '';
            li.innerHTML = `
                <div class="teacher-info">
                    <span class="teacher-name">${teacher.name}</span>
                    <span class="teacher-subjects">${teacher.subjects.join(', ')}</span>
                </div>
                <div class="teacher-actions">
                    <button class="action-btn absence-toggle" data-teacher-id="${teacher.id}">${teacher.isAbsent ? 'Set Present' : 'Set Absent'}</button>
                    <button class="action-btn remove-teacher-btn" data-teacher-id="${teacher.id}">Remove</button>
                </div>`;
            teachersListContainer.appendChild(li);
        });
    };

    const findAvailableSubstitutes = (time, subject) => {
        const qualifiedTeachers = teachers.filter(t => t.subjects.includes(subject) && !t.isAbsent);
        const busyTeacherIds = Object.values(timetableGrid[time]).map(slot => slot.teacherId);
        return qualifiedTeachers.filter(t => !busyTeacherIds.includes(t.id));
    };

    const handleAbsentSlotClick = (time, day) => {
        const classInfo = timetableGrid[time][day];
        const substitutes = findAvailableSubstitutes(time, classInfo.subject);
        modalTitle.textContent = `Substitutes for ${classInfo.subject}`;
        modalSubtitle.textContent = `For ${day} at ${time}`;
        substituteList.innerHTML = '';
        if (substitutes.length > 0) {
            substitutes.forEach(sub => {
                const li = document.createElement('li');
                li.textContent = sub.name;
                li.onclick = () => {
                    timetableGrid[time][day].teacherId = sub.id;
                    renderDashboard();
                    substitutionModal.classList.add('hidden');
                };
                substituteList.appendChild(li);
            });
        } else {
            substituteList.innerHTML = '<li>No available substitutes found.</li>';
        }
        substitutionModal.classList.remove('hidden');
    };

    // --- Event Listeners ---
    loginButton.addEventListener('click', () => {
        loginScreen.classList.add('hidden');
        setupScreen.classList.remove('hidden');
        generateTimeSlotInputs();
    });
    
    timeSlotsContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('time-slot-input')) {
            updateLunchSelector();
        }
    });

    numPeriodsInput.addEventListener('input', generateTimeSlotInputs);
    
    generateDashboardButton.addEventListener('click', () => {
        timeSlots = Array.from(document.querySelectorAll('.time-slot-input')).map(input => input.value);
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        if (includeSaturdayCheckbox.checked) {
            days.push('Saturday');
        }
        initializeTimetableGrid();
        renderDashboard();
        setupScreen.classList.add('hidden');
        dashboardScreen.classList.remove('hidden');
    });

    backToSetupButton.addEventListener('click', () => {
        dashboardScreen.classList.add('hidden');
        setupScreen.classList.remove('hidden');
    });

    printButton.addEventListener('click', () => {
        window.print();
    });

    manageTeachersButton.addEventListener('click', () => { 
        dashboardScreen.classList.add('hidden'); 
        teacherScreen.classList.remove('hidden'); 
        renderTeachersList(); 
    });

    backToDashboardButton.addEventListener('click', () => { 
        teacherScreen.classList.add('hidden'); 
        dashboardScreen.classList.remove('hidden'); 
        renderDashboard(); 
    });

    addTeacherForm.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        const nameInput = document.getElementById('teacher-name'); 
        const subjectsInput = document.getElementById('teacher-subjects'); 
        const name = nameInput.value; 
        const subjects = subjectsInput.value.split(',').map(s => s.trim()).filter(s => s); 
        if (name && subjects.length > 0) { 
            const newTeacher = { 
                id: teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1, 
                name, 
                subjects, 
                isAbsent: false, 
            }; 
            teachers.push(newTeacher); 
            addTeacherForm.reset(); 
            renderTeachersList(); 
        } 
    });

    teachersListContainer.addEventListener('click', (e) => { 
        const target = e.target.closest('.action-btn');
        if (!target) return;

        if (target.classList.contains('absence-toggle')) { 
            const teacherId = parseInt(target.dataset.teacherId); 
            const teacher = getTeacherById(teacherId); 
            if (teacher) { 
                teacher.isAbsent = !teacher.isAbsent; 
                renderTeachersList(); 
            } 
        } else if (target.classList.contains('remove-teacher-btn')) {
            const teacherId = parseInt(target.dataset.teacherId);
            teachers = teachers.filter(t => t.id !== teacherId);
            timeSlots.forEach(time => {
                days.forEach(day => {
                    if (timetableGrid[time] && timetableGrid[time][day].teacherId === teacherId) {
                        timetableGrid[time][day] = { subject: null, teacherId: null };
                    }
                });
            });
            renderTeachersList();
        }
    });
    
    timetableBody.addEventListener('click', (e) => {
        const target = e.target.closest('.remove-slot-btn');
        if(target) {
            const time = target.dataset.time;
            const day = target.dataset.day;
            if(time && day && timetableGrid[time][day]) {
                timetableGrid[time][day] = { subject: null, teacherId: null };
                renderDashboard();
            }
        }
    });
    
    closeModalButton.addEventListener('click', () => { 
        substitutionModal.classList.add('hidden'); 
    });
    
    substitutionModal.addEventListener('click', (e) => { 
        if (e.target === substitutionModal) { 
            substitutionModal.classList.add('hidden'); 
        } 
    });
});
