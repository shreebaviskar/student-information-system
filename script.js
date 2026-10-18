/**
 * ==============================================================================
 * Student Information System - Frontend Application Logic
 * ASDD Mini Project: Jenkins CI/CD + Docker Containerization
 * ==============================================================================
 * This script provides full CRUD (Create, Read, Update, Delete) student management,
 * live searching, department filtering, input validation, duplicate checking,
 * and persistent browser localStorage management.
 */

// Strict mode for cleaner and safer JavaScript execution
'use strict';

/* --------------------------------------------------------------------------
   Application Constants & Sample Dataset
   -------------------------------------------------------------------------- */
const STORAGE_KEY = 'asdd_student_records';

/**
 * Initial 6 realistic sample student records.
 * Loaded only when localStorage is completely empty on first launch.
 */
const INITIAL_SAMPLE_STUDENTS = [
  {
    id: 'STU-1001',
    name: 'Aarav Sharma',
    rollNumber: 'CS-2023-014',
    department: 'Computer Engineering',
    year: 'First Year',
    email: 'aarav.sharma@example.edu'
  },
  {
    id: 'STU-1002',
    name: 'Priya Patel',
    rollNumber: 'AI-2022-028',
    department: 'Artificial Intelligence and Machine Learning',
    year: 'Second Year',
    email: 'priya.patel@example.edu'
  },
  {
    id: 'STU-1003',
    name: 'Rohan Deshmukh',
    rollNumber: 'IT-2021-045',
    department: 'Information Technology',
    year: 'Third Year',
    email: 'rohan.deshmukh@example.edu'
  },
  {
    id: 'STU-1004',
    name: 'Ananya Iyer',
    rollNumber: 'ET-2020-019',
    department: 'Electronics and Telecommunication',
    year: 'Final Year',
    email: 'ananya.iyer@example.edu'
  },
  {
    id: 'STU-1005',
    name: 'Vikram Singh',
    rollNumber: 'ME-2022-033',
    department: 'Mechanical Engineering',
    year: 'Second Year',
    email: 'vikram.singh@example.edu'
  },
  {
    id: 'STU-1006',
    name: 'Neha Kulkarni',
    rollNumber: 'CE-2021-012',
    department: 'Civil Engineering',
    year: 'Third Year',
    email: 'neha.kulkarni@example.edu'
  }
];

/* --------------------------------------------------------------------------
   Application State
   -------------------------------------------------------------------------- */
let studentsList = [];
let studentPendingDeletion = null;

/* --------------------------------------------------------------------------
   DOM Element Selectors
   -------------------------------------------------------------------------- */
const DOM = {
  // Navigation & Layout
  sidebar: document.getElementById('sidebar'),
  menuToggle: document.getElementById('menuToggle'),
  sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
  navDashboard: document.getElementById('navDashboard'),
  navStudents: document.getElementById('navStudents'),
  navArchitecture: document.getElementById('navArchitecture'),

  // Header Actions
  openAddModalBtn: document.getElementById('openAddModalBtn'),
  resetDataBtn: document.getElementById('resetDataBtn'),

  // Metrics Display
  statTotalStudents: document.getElementById('statTotalStudents'),
  statTotalDepartments: document.getElementById('statTotalDepartments'),
  statFinalYearStudents: document.getElementById('statFinalYearStudents'),
  statTopDepartment: document.getElementById('statTopDepartment'),
  statTopDeptCount: document.getElementById('statTopDeptCount'),

  // Search & Filters
  searchInput: document.getElementById('searchInput'),
  searchClearBtn: document.getElementById('searchClearBtn'),
  departmentFilter: document.getElementById('departmentFilter'),
  yearFilter: document.getElementById('yearFilter'),
  recordCounter: document.getElementById('recordCounter'),

  // Table & Empty State
  studentsTable: document.getElementById('studentsTable'),
  studentsTableBody: document.getElementById('studentsTableBody'),
  emptyState: document.getElementById('emptyState'),
  emptyStateActionBtn: document.getElementById('emptyStateActionBtn'),

  // Add / Edit Modal Elements
  studentModal: document.getElementById('studentModal'),
  modalTitle: document.getElementById('modalTitle'),
  modalSubtitle: document.getElementById('modalSubtitle'),
  studentForm: document.getElementById('studentForm'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalCancelBtn: document.getElementById('modalCancelBtn'),
  originalStudentId: document.getElementById('originalStudentId'),

  // Form Inputs
  studentIdInput: document.getElementById('studentIdInput'),
  rollNumberInput: document.getElementById('rollNumberInput'),
  fullNameInput: document.getElementById('fullNameInput'),
  departmentSelect: document.getElementById('departmentSelect'),
  yearSelect: document.getElementById('yearSelect'),
  emailInput: document.getElementById('emailInput'),

  // Form Error Spans
  studentIdError: document.getElementById('studentIdError'),
  rollNumberError: document.getElementById('rollNumberError'),
  fullNameError: document.getElementById('fullNameError'),
  departmentError: document.getElementById('departmentError'),
  yearError: document.getElementById('yearError'),
  emailError: document.getElementById('emailError'),

  // View Profile Modal Elements
  viewModal: document.getElementById('viewModal'),
  viewModalCloseBtn: document.getElementById('viewModalCloseBtn'),
  viewModalDoneBtn: document.getElementById('viewModalDoneBtn'),
  viewModalEditBtn: document.getElementById('viewModalEditBtn'),
  viewAvatar: document.getElementById('viewAvatar'),
  viewFullName: document.getElementById('viewFullName'),
  viewDeptBadge: document.getElementById('viewDeptBadge'),
  viewYearBadge: document.getElementById('viewYearBadge'),
  viewStudentId: document.getElementById('viewStudentId'),
  viewRollNumber: document.getElementById('viewRollNumber'),
  viewDepartment: document.getElementById('viewDepartment'),
  viewYear: document.getElementById('viewYear'),
  viewEmail: document.getElementById('viewEmail'),

  // Delete Confirmation Modal Elements
  deleteModal: document.getElementById('deleteModal'),
  deleteModalCloseBtn: document.getElementById('deleteModalCloseBtn'),
  deleteModalCancelBtn: document.getElementById('deleteModalCancelBtn'),
  deleteModalConfirmBtn: document.getElementById('deleteModalConfirmBtn'),
  deleteStudentName: document.getElementById('deleteStudentName'),
  deleteStudentRoll: document.getElementById('deleteStudentRoll'),

  // Architecture / DevOps Modal Elements
  architectureModal: document.getElementById('architectureModal'),
  archModalCloseBtn: document.getElementById('archModalCloseBtn'),
  archModalCloseFooterBtn: document.getElementById('archModalCloseFooterBtn'),

  // Toast Container
  toastContainer: document.getElementById('toastContainer')
};

/* --------------------------------------------------------------------------
   Utility Functions
   -------------------------------------------------------------------------- */

/**
 * Escapes HTML characters to prevent XSS (Cross-Site Scripting) vulnerabilities.
 * @param {string} str - Raw string
 * @returns {string} Sanitized string safe for DOM output
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validates standard email address syntax using RFC-compliant pattern.
 * @param {string} email - Email address
 * @returns {boolean} True if email is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  return emailRegex.test(email.trim());
}

/**
 * Extracts initials from student name for the avatar badge.
 * @param {string} name - Student full name
 * @returns {string} 1 or 2 letter uppercase initials
 */
function getInitials(name) {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Displays an accessible toast notification with auto-dismiss.
 * @param {string} title - Heading of notification
 * @param {string} message - Detailed message
 * @param {'success'|'error'|'info'} type - Toast visual category
 */
function showToast(title, message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  } else if (type === 'error') {
    iconSvg = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  } else {
    iconSvg = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  }

  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
    <button type="button" class="toast-close" aria-label="Dismiss notification">&times;</button>
  `;

  // Close handler
  const closeBtn = toast.querySelector('.toast-close');
  const dismiss = () => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 200);
  };

  closeBtn.addEventListener('click', dismiss);
  DOM.toastContainer.appendChild(toast);

  // Auto dismiss after 3.8 seconds
  setTimeout(dismiss, 3800);
}

/* --------------------------------------------------------------------------
   Local Storage Management
   -------------------------------------------------------------------------- */

/**
 * Loads student records from localStorage.
 * If no existing data is found, seeds initial sample data.
 * If data exists, it is never overwritten on startup.
 */
function loadStudentsFromStorage() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        studentsList = parsed;
        return;
      }
    }
  } catch (err) {
    console.error('Error parsing localStorage student records:', err);
  }

  // Fallback to sample data only if storage is empty
  studentsList = [...INITIAL_SAMPLE_STUDENTS];
  saveStudentsToStorage();
}

/**
 * Persists current students list into browser localStorage.
 */
function saveStudentsToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studentsList));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
    showToast('Storage Error', 'Unable to persist changes in browser storage.', 'error');
  }
}

/* --------------------------------------------------------------------------
   Dashboard Statistics Calculation
   -------------------------------------------------------------------------- */

/**
 * Recalculates and updates all dashboard summary cards.
 */
function updateDashboardMetrics() {
  const total = studentsList.length;
  DOM.statTotalStudents.textContent = total;

  // Compute unique departments represented
  const departmentsRepresented = new Set();
  const deptCountMap = {};
  let finalYearCount = 0;

  studentsList.forEach(student => {
    if (student.department) {
      departmentsRepresented.add(student.department);
      deptCountMap[student.department] = (deptCountMap[student.department] || 0) + 1;
    }
    if (student.year === 'Final Year') {
      finalYearCount++;
    }
  });

  DOM.statTotalDepartments.textContent = departmentsRepresented.size;
  DOM.statFinalYearStudents.textContent = finalYearCount;

  // Find leading department with highest enrollment
  let topDept = '-';
  let maxCount = 0;
  for (const [dept, count] of Object.entries(deptCountMap)) {
    if (count > maxCount) {
      maxCount = count;
      topDept = dept;
    }
  }

  if (total > 0 && maxCount > 0) {
    // Simplify department name for metric card display
    let shortDept = topDept
      .replace('Artificial Intelligence and Machine Learning', 'AI & ML')
      .replace('Electronics and Telecommunication', 'EXTC');
    DOM.statTopDepartment.textContent = shortDept;
    DOM.statTopDeptCount.textContent = `${maxCount} enrolled student${maxCount > 1 ? 's' : ''}`;
  } else {
    DOM.statTopDepartment.textContent = 'None';
    DOM.statTopDeptCount.textContent = 'No records present';
  }
}

/* --------------------------------------------------------------------------
   Table Rendering & Filtering
   -------------------------------------------------------------------------- */

/**
 * Filters the students list based on search input, department filter, and year filter.
 * @returns {Array} Filtered list of students
 */
function getFilteredStudents() {
  const query = DOM.searchInput.value.trim().toLowerCase();
  const selectedDept = DOM.departmentFilter.value;
  const selectedYear = DOM.yearFilter.value;

  return studentsList.filter(student => {
    // Search query matches name, roll number, or department
    const matchesQuery = !query ||
      student.name.toLowerCase().includes(query) ||
      student.rollNumber.toLowerCase().includes(query) ||
      student.id.toLowerCase().includes(query) ||
      student.department.toLowerCase().includes(query);

    // Department match
    const matchesDept = !selectedDept || student.department === selectedDept;

    // Year match
    const matchesYear = !selectedYear || student.year === selectedYear;

    return matchesQuery && matchesDept && matchesYear;
  });
}

/**
 * Renders table rows based on active search & filter conditions.
 */
function renderStudentsTable() {
  const filtered = getFilteredStudents();
  DOM.studentsTableBody.innerHTML = '';

  // Update clear button visibility
  DOM.searchClearBtn.style.display = DOM.searchInput.value.trim() ? 'block' : 'none';

  // Update counter
  DOM.recordCounter.textContent = `Showing ${filtered.length} of ${studentsList.length} student${studentsList.length === 1 ? '' : 's'}`;

  if (filtered.length === 0) {
    DOM.studentsTable.style.display = 'none';
    DOM.emptyState.style.display = 'flex';
    return;
  }

  DOM.studentsTable.style.display = 'table';
  DOM.emptyState.style.display = 'none';

  filtered.forEach(student => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', student.id);

    tr.innerHTML = `
      <td><span class="student-id-badge">${escapeHtml(student.id)}</span></td>
      <td class="student-name-cell">${escapeHtml(student.name)}</td>
      <td><span class="roll-no-badge">${escapeHtml(student.rollNumber)}</span></td>
      <td><span class="badge badge-dept">${escapeHtml(student.department)}</span></td>
      <td><span class="badge badge-year">${escapeHtml(student.year)}</span></td>
      <td>${escapeHtml(student.email)}</td>
      <td class="text-right">
        <div class="action-buttons">
          <button type="button" class="icon-btn view-btn" data-action="view" data-id="${escapeHtml(student.id)}" title="View Student Profile" aria-label="View Student">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button type="button" class="icon-btn edit-btn" data-action="edit" data-id="${escapeHtml(student.id)}" title="Edit Student Record" aria-label="Edit Student">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button type="button" class="icon-btn delete-btn" data-action="delete" data-id="${escapeHtml(student.id)}" title="Delete Student Record" aria-label="Delete Student">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </button>
        </div>
      </td>
    `;

    DOM.studentsTableBody.appendChild(tr);
  });
}

/* --------------------------------------------------------------------------
   Modal Window Controllers
   -------------------------------------------------------------------------- */

/**
 * Opens a modal window and disables page background scroll.
 * @param {HTMLElement} modalElement - Modal backdrop container
 */
function openModal(modalElement) {
  modalElement.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Closes a modal window and restores page scroll.
 * @param {HTMLElement} modalElement - Modal backdrop container
 */
function closeModal(modalElement) {
  modalElement.classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * Clears form fields and inline error states.
 */
function resetFormErrors() {
  const inputs = [
    DOM.studentIdInput,
    DOM.rollNumberInput,
    DOM.fullNameInput,
    DOM.departmentSelect,
    DOM.yearSelect,
    DOM.emailInput
  ];

  inputs.forEach(input => {
    input.classList.remove('input-error');
  });

  DOM.studentIdError.textContent = '';
  DOM.rollNumberError.textContent = '';
  DOM.fullNameError.textContent = '';
  DOM.departmentError.textContent = '';
  DOM.yearError.textContent = '';
  DOM.emailError.textContent = '';
}

/**
 * Prepares and opens modal for adding a new student.
 */
function handleOpenAddModal() {
  resetFormErrors();
  DOM.studentForm.reset();
  DOM.originalStudentId.value = '';
  DOM.modalTitle.textContent = 'Add New Student Record';
  DOM.modalSubtitle.textContent = 'Enter student academic details. All fields are required.';
  
  // Suggest next ID based on existing records
  const existingIds = studentsList.map(s => {
    const match = s.id.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  });
  const nextNumber = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1001;
  DOM.studentIdInput.value = `STU-${nextNumber}`;

  openModal(DOM.studentModal);
  DOM.fullNameInput.focus();
}

/**
 * Opens modal for viewing student information.
 * @param {string} studentId - Student ID to view
 */
function handleViewStudent(studentId) {
  const student = studentsList.find(s => s.id === studentId);
  if (!student) {
    showToast('Record Not Found', `No student found with ID ${studentId}`, 'error');
    return;
  }

  DOM.viewAvatar.textContent = getInitials(student.name);
  DOM.viewFullName.textContent = student.name;
  DOM.viewDeptBadge.textContent = student.department;
  DOM.viewYearBadge.textContent = student.year;
  DOM.viewStudentId.textContent = student.id;
  DOM.viewRollNumber.textContent = student.rollNumber;
  DOM.viewDepartment.textContent = student.department;
  DOM.viewYear.textContent = student.year;
  DOM.viewEmail.textContent = student.email;

  // Set action for Edit button inside View dialog
  DOM.viewModalEditBtn.onclick = () => {
    closeModal(DOM.viewModal);
    handleOpenEditModal(student.id);
  };

  openModal(DOM.viewModal);
}

/**
 * Opens modal for editing an existing student record.
 * @param {string} studentId - Student ID to edit
 */
function handleOpenEditModal(studentId) {
  const student = studentsList.find(s => s.id === studentId);
  if (!student) {
    showToast('Record Not Found', `No student found with ID ${studentId}`, 'error');
    return;
  }

  resetFormErrors();
  DOM.modalTitle.textContent = 'Edit Student Record';
  DOM.modalSubtitle.textContent = `Update details for ${student.name} (${student.id})`;
  DOM.originalStudentId.value = student.id;

  DOM.studentIdInput.value = student.id;
  DOM.rollNumberInput.value = student.rollNumber;
  DOM.fullNameInput.value = student.name;
  DOM.departmentSelect.value = student.department;
  DOM.yearSelect.value = student.year;
  DOM.emailInput.value = student.email;

  openModal(DOM.studentModal);
  DOM.fullNameInput.focus();
}

/**
 * Initiates delete confirmation workflow.
 * @param {string} studentId - ID of student to delete
 */
function handlePromptDelete(studentId) {
  const student = studentsList.find(s => s.id === studentId);
  if (!student) {
    showToast('Record Not Found', 'The requested student record could not be found.', 'error');
    return;
  }

  studentPendingDeletion = student;
  DOM.deleteStudentName.textContent = student.name;
  DOM.deleteStudentRoll.textContent = student.rollNumber;
  openModal(DOM.deleteModal);
}

/**
 * Confirms and executes record deletion.
 */
function handleConfirmDelete() {
  if (!studentPendingDeletion) return;

  const targetId = studentPendingDeletion.id;
  const targetName = studentPendingDeletion.name;

  studentsList = studentsList.filter(s => s.id !== targetId);
  saveStudentsToStorage();
  updateDashboardMetrics();
  renderStudentsTable();

  closeModal(DOM.deleteModal);
  showToast('Record Deleted', `Successfully removed record for ${targetName}.`, 'success');
  studentPendingDeletion = null;
}

/* --------------------------------------------------------------------------
   Form Submission & Comprehensive Validation
   -------------------------------------------------------------------------- */

/**
 * Validates form data and prevents duplicate IDs or Roll Numbers.
 * @returns {object|null} Student object if valid, or null if validation failed
 */
function validateStudentForm() {
  resetFormErrors();

  const originalId = DOM.originalStudentId.value.trim();
  const isEditing = Boolean(originalId);

  const studentId = DOM.studentIdInput.value.trim();
  const rollNumber = DOM.rollNumberInput.value.trim();
  const name = DOM.fullNameInput.value.trim();
  const department = DOM.departmentSelect.value.trim();
  const year = DOM.yearSelect.value.trim();
  const email = DOM.emailInput.value.trim();

  let hasError = false;

  // 1. Student ID validation
  if (!studentId) {
    DOM.studentIdInput.classList.add('input-error');
    DOM.studentIdError.textContent = 'Student ID is required.';
    hasError = true;
  } else {
    // Check duplicate Student ID (ignoring the student itself if editing)
    const duplicateId = studentsList.some(s => {
      if (isEditing && s.id.toLowerCase() === originalId.toLowerCase()) return false;
      return s.id.toLowerCase() === studentId.toLowerCase();
    });

    if (duplicateId) {
      DOM.studentIdInput.classList.add('input-error');
      DOM.studentIdError.textContent = `Student ID '${studentId}' is already registered.`;
      hasError = true;
    }
  }

  // 2. Roll Number validation
  if (!rollNumber) {
    DOM.rollNumberInput.classList.add('input-error');
    DOM.rollNumberError.textContent = 'Roll Number is required.';
    hasError = true;
  } else {
    // Check duplicate Roll Number (ignoring the student itself if editing)
    const duplicateRoll = studentsList.some(s => {
      if (isEditing && s.id.toLowerCase() === originalId.toLowerCase()) return false;
      return s.rollNumber.toLowerCase() === rollNumber.toLowerCase();
    });

    if (duplicateRoll) {
      DOM.rollNumberInput.classList.add('input-error');
      DOM.rollNumberError.textContent = `Roll Number '${rollNumber}' is already assigned.`;
      hasError = true;
    }
  }

  // 3. Full Name validation
  if (!name) {
    DOM.fullNameInput.classList.add('input-error');
    DOM.fullNameError.textContent = 'Full Name is required.';
    hasError = true;
  } else if (name.length < 2) {
    DOM.fullNameInput.classList.add('input-error');
    DOM.fullNameError.textContent = 'Name must be at least 2 characters long.';
    hasError = true;
  }

  // 4. Department validation
  if (!department) {
    DOM.departmentSelect.classList.add('input-error');
    DOM.departmentError.textContent = 'Please select an academic department.';
    hasError = true;
  }

  // 5. Year validation
  if (!year) {
    DOM.yearSelect.classList.add('input-error');
    DOM.yearError.textContent = 'Please select year of study.';
    hasError = true;
  }

  // 6. Email validation
  if (!email) {
    DOM.emailInput.classList.add('input-error');
    DOM.emailError.textContent = 'Email address is required.';
    hasError = true;
  } else if (!isValidEmail(email)) {
    DOM.emailInput.classList.add('input-error');
    DOM.emailError.textContent = 'Please enter a valid email address (e.g. name@example.edu).';
    hasError = true;
  }

  if (hasError) return null;

  return {
    id: studentId,
    name,
    rollNumber,
    department,
    year,
    email
  };
}

/**
 * Handles Form Submit for both Add and Edit operations.
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const validatedData = validateStudentForm();
  if (!validatedData) {
    showToast('Validation Error', 'Please check highlighted fields.', 'error');
    return;
  }

  const originalId = DOM.originalStudentId.value.trim();

  if (originalId) {
    // Edit Mode: update existing student record
    const targetIndex = studentsList.findIndex(s => s.id === originalId);
    if (targetIndex !== -1) {
      studentsList[targetIndex] = validatedData;
      saveStudentsToStorage();
      updateDashboardMetrics();
      renderStudentsTable();
      closeModal(DOM.studentModal);
      showToast('Record Updated', `Successfully updated information for ${validatedData.name}.`, 'success');
    } else {
      showToast('Update Failed', 'Student record not found.', 'error');
    }
  } else {
    // Add Mode: prepend or append new student record
    studentsList.unshift(validatedData);
    saveStudentsToStorage();
    updateDashboardMetrics();
    renderStudentsTable();
    closeModal(DOM.studentModal);
    showToast('Student Added', `${validatedData.name} has been enrolled successfully.`, 'success');
  }
}

/**
 * Resets student records back to initial 6 sample records after confirmation.
 */
function handleResetSampleData() {
  const confirmed = window.confirm(
    'Reset all records back to the initial 6 sample students?\nAny custom students entered will be replaced.'
  );

  if (confirmed) {
    studentsList = [...INITIAL_SAMPLE_STUDENTS];
    saveStudentsToStorage();
    updateDashboardMetrics();
    renderStudentsTable();
    showToast('Reset Complete', 'Loaded 6 initial sample student records.', 'info');
  }
}

/* --------------------------------------------------------------------------
   Event Listeners Setup
   -------------------------------------------------------------------------- */
function initializeEventListeners() {
  // Mobile Sidebar Toggle
  DOM.menuToggle.addEventListener('click', () => {
    DOM.sidebar.classList.toggle('open');
  });

  DOM.sidebarCloseBtn.addEventListener('click', () => {
    DOM.sidebar.classList.remove('open');
  });

  // Header Actions
  DOM.openAddModalBtn.addEventListener('click', handleOpenAddModal);
  DOM.resetDataBtn.addEventListener('click', handleResetSampleData);

  // Search & Filter Listeners
  DOM.searchInput.addEventListener('input', renderStudentsTable);
  DOM.searchClearBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    renderStudentsTable();
    DOM.searchInput.focus();
  });

  DOM.departmentFilter.addEventListener('change', renderStudentsTable);
  DOM.yearFilter.addEventListener('change', renderStudentsTable);

  DOM.emptyStateActionBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    DOM.departmentFilter.value = '';
    DOM.yearFilter.value = '';
    renderStudentsTable();
  });

  // Table Event Delegation (View, Edit, Delete)
  DOM.studentsTableBody.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    const studentId = btn.getAttribute('data-id');

    if (action === 'view') {
      handleViewStudent(studentId);
    } else if (action === 'edit') {
      handleOpenEditModal(studentId);
    } else if (action === 'delete') {
      handlePromptDelete(studentId);
    }
  });

  // Form submission & cancellation
  DOM.studentForm.addEventListener('submit', handleFormSubmit);
  DOM.modalCloseBtn.addEventListener('click', () => closeModal(DOM.studentModal));
  DOM.modalCancelBtn.addEventListener('click', () => closeModal(DOM.studentModal));

  // Live input error removal on typing
  [
    DOM.studentIdInput,
    DOM.rollNumberInput,
    DOM.fullNameInput,
    DOM.departmentSelect,
    DOM.yearSelect,
    DOM.emailInput
  ].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('input-error');
    });
  });

  // View Modal actions
  DOM.viewModalCloseBtn.addEventListener('click', () => closeModal(DOM.viewModal));
  DOM.viewModalDoneBtn.addEventListener('click', () => closeModal(DOM.viewModal));

  // Delete Modal actions
  DOM.deleteModalCloseBtn.addEventListener('click', () => closeModal(DOM.deleteModal));
  DOM.deleteModalCancelBtn.addEventListener('click', () => closeModal(DOM.deleteModal));
  DOM.deleteModalConfirmBtn.addEventListener('click', handleConfirmDelete);

  // DevOps Architecture Modal
  DOM.navArchitecture.addEventListener('click', () => openModal(DOM.architectureModal));
  DOM.archModalCloseBtn.addEventListener('click', () => closeModal(DOM.architectureModal));
  DOM.archModalCloseFooterBtn.addEventListener('click', () => closeModal(DOM.architectureModal));

  // Close modals when clicking outside dialog backdrop
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeModal(e.target);
    }
  });

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
        closeModal(modal);
      });
    }
  });
}

/* --------------------------------------------------------------------------
   Application Initialization
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize data from localStorage or sample fallback
  loadStudentsFromStorage();

  // 2. Set up all DOM event listeners
  initializeEventListeners();

  // 3. Compute and display initial dashboard metrics
  updateDashboardMetrics();

  // 4. Render the students table
  renderStudentsTable();

  console.log('Student Information System initialized successfully. Ready for ASDD evaluation.');
});
