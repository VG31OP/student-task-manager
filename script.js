/**
 * ==============================================================================
 * EduTask - Student Task Manager Web Application
 * College Mini-Project | Web Application Development (WAD PBL)
 * 
 * Core Features:
 * 1. State Management with Browser localStorage
 * 2. Real-time Dashboard KPI Metrics (Total, Pending, Completed, Overdue)
 * 3. Full CRUD: Add, Read, Edit, Delete (with confirmation), and Status Toggle
 * 4. Multi-criteria Filtering (Status, Priority, Subject) and Real-time Search
 * 5. Dynamic Sorting (by Due Date, Priority, Title)
 * 6. Responsive UI with Grid and List view switching
 * ==============================================================================
 */

// Strict mode for cleaner and safer JavaScript execution
'use strict';

/* ==============================================================================
   1. CONSTANTS & INITIAL DATA
   ============================================================================== */
const STORAGE_KEY = 'edutask_student_tasks_wad';
const VIEW_PREF_KEY = 'edutask_view_mode';

/**
 * Realistic default sample tasks for college students.
 * Pre-populated when the application is launched for the first time.
 */
function getInitialSampleTasks() {
  const now = new Date();
  
  // Helper to format ISO date strings relative to today
  const createDate = (daysOffset, hours = 18, minutes = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() + daysOffset);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString().slice(0, 16); // Formats as YYYY-MM-DDTHH:mm
  };

  return [
    {
      id: 'task-1',
      title: 'Submit Web Development PBL Project & Report',
      subject: 'Web Development',
      category: 'Project',
      priority: 'High',
      dueDate: createDate(2, 23, 59), // Due in 2 days
      description: 'Prepare final source code repository, documentation PDF, and live deployment demonstration.',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-2',
      title: 'Data Structures Lab 4 - Binary Search Tree Analysis',
      subject: 'Data Structures & Algorithms',
      category: 'Lab Work',
      priority: 'High',
      dueDate: createDate(-1, 17, 0), // Overdue by 1 day (for testing overdue display)
      description: 'Complete C++ code for AVL tree rotation and write the time complexity comparison.',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-3',
      title: 'DBMS Midterm Exam Revision - Normalization & SQL Queries',
      subject: 'Database Management (DBMS)',
      category: 'Exam',
      priority: 'Medium',
      dueDate: createDate(5, 9, 30), // Due in 5 days
      description: 'Revise 1NF, 2NF, 3NF, BCNF decomposition examples and solve previous year question papers.',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-4',
      title: 'Operating Systems - CPU Scheduling Presentation Slides',
      subject: 'Operating Systems',
      category: 'Presentation',
      priority: 'Low',
      dueDate: createDate(7, 14, 0), // Due in 7 days
      description: 'Finalize presentation deck for Round Robin and Shortest Job First scheduling comparison with Gantt charts.',
      completed: true, // Marked completed for testing completed views
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-5',
      title: 'Computer Networks - TCP vs UDP Wireshark Packet Capture',
      subject: 'Computer Networks',
      category: 'Assignment',
      priority: 'Medium',
      dueDate: createDate(4, 16, 0), // Due in 4 days
      description: 'Capture 3-way handshake packets in Wireshark and answer the questions on section 4.',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ];
}

/* ==============================================================================
   2. APPLICATION STATE
   ============================================================================== */
let tasks = [];
let taskToDeleteId = null;

// Filter & Sort State Object
const appState = {
  searchQuery: '',
  statusFilter: 'all',     // 'all' | 'pending' | 'completed' | 'overdue'
  priorityFilter: 'all',   // 'all' | 'High' | 'Medium' | 'Low'
  subjectFilter: 'all',    // 'all' | specific subject string
  sortBy: 'deadline-asc',  // 'deadline-asc' | 'deadline-desc' | 'priority-desc' | 'priority-asc' | 'title-asc'
  viewMode: 'grid'         // 'grid' | 'list'
};

/* ==============================================================================
   3. DOM ELEMENT REFERENCES
   ============================================================================== */
// Sidebar & Header
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const navItems = document.querySelectorAll('.nav-item');
const resetSampleDataBtn = document.getElementById('resetSampleDataBtn');
const currentDateDisplay = document.getElementById('currentDateDisplay');

// Dashboard Statistics Elements
const statTotalCount = document.getElementById('statTotalCount');
const statPendingCount = document.getElementById('statPendingCount');
const statCompletedCount = document.getElementById('statCompletedCount');
const statOverdueCount = document.getElementById('statOverdueCount');
const sidebarProgressPercent = document.getElementById('sidebarProgressPercent');
const sidebarProgressBar = document.getElementById('sidebarProgressBar');
const sidebarProgressText = document.getElementById('sidebarProgressText');

// Badges in Sidebar
const badgeAll = document.getElementById('badgeAll');
const badgePending = document.getElementById('badgePending');
const badgeCompleted = document.getElementById('badgeCompleted');
const badgeOverdue = document.getElementById('badgeOverdue');

// Toolbar Controls
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const filterSubjectSelect = document.getElementById('filterSubjectSelect');
const filterPrioritySelect = document.getElementById('filterPrioritySelect');
const filterStatusSelect = document.getElementById('filterStatusSelect');
const sortTasksSelect = document.getElementById('sortTasksSelect');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');

// Banner & Task Containers
const activeFilterBanner = document.getElementById('activeFilterBanner');
const filterSummaryText = document.getElementById('filterSummaryText');
const clearFilterLink = document.getElementById('clearFilterLink');
const tasksContainer = document.getElementById('tasksContainer');
const emptyState = document.getElementById('emptyState');
const emptyStateTitle = document.getElementById('emptyStateTitle');
const emptyStateMessage = document.getElementById('emptyStateMessage');
const emptyStateActionBtn = document.getElementById('emptyStateActionBtn');

// Add/Edit Task Modal
const openAddTaskModalBtn = document.getElementById('openAddTaskModalBtn');
const taskModalOverlay = document.getElementById('taskModalOverlay');
const closeTaskModalBtn = document.getElementById('closeTaskModalBtn');
const cancelTaskModalBtn = document.getElementById('cancelTaskModalBtn');
const taskForm = document.getElementById('taskForm');
const modalTitle = document.getElementById('modalTitle');
const saveBtnText = document.getElementById('saveBtnText');
const taskIdInput = document.getElementById('taskIdInput');
const taskTitleInput = document.getElementById('taskTitleInput');
const taskSubjectInput = document.getElementById('taskSubjectInput');
const taskCategorySelect = document.getElementById('taskCategorySelect');
const taskPrioritySelect = document.getElementById('taskPrioritySelect');
const taskDueDateInput = document.getElementById('taskDueDateInput');
const taskDescriptionInput = document.getElementById('taskDescriptionInput');
const taskStatusCheckboxGroup = document.getElementById('taskStatusCheckboxGroup');
const taskCompletedCheckbox = document.getElementById('taskCompletedCheckbox');

// Validation Error Elements
const taskTitleError = document.getElementById('taskTitleError');
const taskSubjectError = document.getElementById('taskSubjectError');
const taskDueDateError = document.getElementById('taskDueDateError');

// Delete Confirmation Modal
const deleteModalOverlay = document.getElementById('deleteModalOverlay');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const deleteModalDescription = document.getElementById('deleteModalDescription');

// Toast Notification Container
const toastContainer = document.getElementById('toastContainer');

/* ==============================================================================
   4. LOCALSTORAGE MANAGEMENT
   ============================================================================== */

/**
 * Loads tasks from localStorage or initial sample dataset if empty.
 */
function loadTasksFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      tasks = JSON.parse(stored);
    } else {
      // First time loading - initialize with mock academic tasks
      tasks = getInitialSampleTasks();
      saveTasksToStorage();
    }
  } catch (error) {
    console.error('Error reading localStorage:', error);
    tasks = getInitialSampleTasks();
  }

  // Load preferred view mode
  const savedViewMode = localStorage.getItem(VIEW_PREF_KEY);
  if (savedViewMode === 'list' || savedViewMode === 'grid') {
    appState.viewMode = savedViewMode;
  }
}

/**
 * Saves current tasks array to browser localStorage.
 */
function saveTasksToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
    showToast('Failed to save to local storage (quota exceeded or private browsing)', 'danger');
  }
}

/* ==============================================================================
   5. DATE & TIME UTILITY FUNCTIONS
   ============================================================================== */

/**
 * Checks whether a task is overdue (past deadline and not yet completed).
 * @param {string} dueDateString - ISO date string or datetime-local format
 * @param {boolean} isCompleted - task completion state
 * @returns {boolean}
 */
function isTaskOverdue(dueDateString, isCompleted) {
  if (isCompleted || !dueDateString) return false;
  return new Date(dueDateString).getTime() < Date.now();
}

/**
 * Formats a date string for display (e.g. "Oct 18, 2026, 11:59 PM").
 * @param {string} dateString 
 * @returns {string}
 */
function formatDisplayDate(dateString) {
  if (!dateString) return 'No deadline set';
  const dateObj = new Date(dateString);
  if (isNaN(dateObj.getTime())) return 'Invalid date';

  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

/**
 * Generates human-friendly relative time remaining or overdue status.
 * @param {string} dueDateString 
 * @param {boolean} isCompleted 
 * @returns {{ text: string, className: string }}
 */
function getRelativeDeadlineInfo(dueDateString, isCompleted) {
  if (isCompleted) {
    return { text: 'Completed', className: 'tag-completed' };
  }
  if (!dueDateString) {
    return { text: 'No Date', className: '' };
  }

  const now = Date.now();
  const due = new Date(dueDateString).getTime();
  const diffMs = due - now;

  if (diffMs < 0) {
    // Overdue
    const absDiff = Math.abs(diffMs);
    const diffHours = Math.floor(absDiff / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return { text: `Overdue by ${diffDays}d`, className: 'tag-overdue' };
    } else if (diffHours > 0) {
      return { text: `Overdue by ${diffHours}h`, className: 'tag-overdue' };
    } else {
      return { text: 'Just Overdue', className: 'tag-overdue' };
    }
  }

  // Upcoming
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 0) {
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return { text: `Due in ${diffMins}m`, className: 'tag-today' };
    }
    return { text: `Due today (${diffHours}h left)`, className: 'tag-today' };
  } else if (diffDays === 1) {
    return { text: 'Due tomorrow', className: 'tag-today' };
  } else {
    return { text: `Due in ${diffDays} days`, className: '' };
  }
}

/**
 * Sets human greeting and date in the top bar.
 */
function renderHeaderDate() {
  const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  const formattedToday = new Date().toLocaleDateString('en-US', options);
  currentDateDisplay.textContent = `Today is ${formattedToday}. Stay organized and reach your academic goals!`;
}

/* ==============================================================================
   6. DASHBOARD & STATS COMPUTATION
   ============================================================================== */

/**
 * Calculates metrics and updates all statistics cards and badges.
 */
function updateDashboardStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const overdue = tasks.filter(t => isTaskOverdue(t.dueDate, t.completed)).length;
  const pending = total - completed;

  // Percentage calculation
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Update KPI card numbers
  statTotalCount.textContent = total;
  statPendingCount.textContent = pending;
  statCompletedCount.textContent = completed;
  statOverdueCount.textContent = overdue;

  // Update Sidebar Badges
  badgeAll.textContent = total;
  badgePending.textContent = pending;
  badgeCompleted.textContent = completed;
  badgeOverdue.textContent = overdue;

  // Update Progress Widget
  sidebarProgressPercent.textContent = `${percentage}%`;
  sidebarProgressBar.style.width = `${percentage}%`;

  if (percentage === 100 && total > 0) {
    sidebarProgressText.textContent = '🎉 Incredible! All assignments completed!';
  } else if (percentage >= 50) {
    sidebarProgressText.textContent = 'Great momentum! More than halfway there.';
  } else if (total === 0) {
    sidebarProgressText.textContent = 'No tasks yet. Create one to begin.';
  } else {
    sidebarProgressText.textContent = 'Keep going! Finish your pending work.';
  }
}

/* ==============================================================================
   7. DYNAMIC SUBJECT FILTER OPTIONS
   ============================================================================== */

/**
 * Extracts unique subjects from tasks and populates the subject filter dropdown.
 */
function populateSubjectFilterOptions() {
  const currentSelection = filterSubjectSelect.value;

  // Get distinct subjects using a Set
  const subjectSet = new Set();
  tasks.forEach(task => {
    if (task.subject && task.subject.trim()) {
      subjectSet.add(task.subject.trim());
    }
  });

  // Preserve the default 'All Subjects' option
  filterSubjectSelect.innerHTML = '<option value="all">All Subjects</option>';

  const sortedSubjects = Array.from(subjectSet).sort();
  sortedSubjects.forEach(subject => {
    const opt = document.createElement('option');
    opt.value = subject;
    opt.textContent = subject;
    if (subject === currentSelection) {
      opt.selected = true;
    }
    filterSubjectSelect.appendChild(opt);
  });
}

/* ==============================================================================
   8. FILTERING & SORTING LOGIC
   ============================================================================== */

/**
 * Applies active search query, status filter, priority filter, subject filter,
 * and sorts the result based on selected criteria.
 * @returns {Array} filtered and sorted tasks
 */
function getFilteredAndSortedTasks() {
  const query = appState.searchQuery.toLowerCase().trim();

  // 1. Filter
  let filtered = tasks.filter(task => {
    // Search match (title, subject, description)
    if (query) {
      const titleMatch = task.title.toLowerCase().includes(query);
      const subjectMatch = (task.subject || '').toLowerCase().includes(query);
      const descMatch = (task.description || '').toLowerCase().includes(query);
      if (!titleMatch && !subjectMatch && !descMatch) {
        return false;
      }
    }

    // Status filter
    if (appState.statusFilter === 'pending') {
      if (task.completed) return false;
    } else if (appState.statusFilter === 'completed') {
      if (!task.completed) return false;
    } else if (appState.statusFilter === 'overdue') {
      if (!isTaskOverdue(task.dueDate, task.completed)) return false;
    }

    // Priority filter
    if (appState.priorityFilter !== 'all') {
      if (task.priority !== appState.priorityFilter) return false;
    }

    // Subject filter
    if (appState.subjectFilter !== 'all') {
      if (task.subject !== appState.subjectFilter) return false;
    }

    return true;
  });

  // 2. Sort
  const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };

  filtered.sort((a, b) => {
    switch (appState.sortBy) {
      case 'deadline-asc': {
        const timeA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const timeB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return timeA - timeB;
      }
      case 'deadline-desc': {
        const timeA = a.dueDate ? new Date(a.dueDate).getTime() : -Infinity;
        const timeB = b.dueDate ? new Date(b.dueDate).getTime() : -Infinity;
        return timeB - timeA;
      }
      case 'priority-desc': {
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        return weightB - weightA;
      }
      case 'priority-asc': {
        const weightA = priorityWeight[a.priority] || 0;
        const weightB = priorityWeight[b.priority] || 0;
        return weightA - weightB;
      }
      case 'title-asc':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return filtered;
}

/**
 * Updates the active filter indicator banner if non-default filters are selected.
 */
function updateActiveFilterBanner() {
  const isSearchActive = !!appState.searchQuery;
  const isStatusActive = appState.statusFilter !== 'all';
  const isPriorityActive = appState.priorityFilter !== 'all';
  const isSubjectActive = appState.subjectFilter !== 'all';

  if (isSearchActive || isStatusActive || isPriorityActive || isSubjectActive) {
    const parts = [];
    if (isSearchActive) parts.push(`"${appState.searchQuery}"`);
    if (isStatusActive) parts.push(`Status: ${capitalize(appState.statusFilter)}`);
    if (isPriorityActive) parts.push(`Priority: ${appState.priorityFilter}`);
    if (isSubjectActive) parts.push(`Subject: ${appState.subjectFilter}`);

    filterSummaryText.textContent = parts.join(' • ');
    activeFilterBanner.classList.remove('hidden');
  } else {
    activeFilterBanner.classList.add('hidden');
  }
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ==============================================================================
   9. TASK CARD DOM RENDERING
   ============================================================================== */

/**
 * Main render function that creates HTML elements for every visible task.
 */
function renderTasks() {
  // Update view mode classes on container
  tasksContainer.className = `tasks-container ${appState.viewMode}-view`;

  // Synchronize view toggle buttons
  gridViewBtn.classList.toggle('active', appState.viewMode === 'grid');
  listViewBtn.classList.toggle('active', appState.viewMode === 'list');
  gridViewBtn.setAttribute('aria-pressed', String(appState.viewMode === 'grid'));
  listViewBtn.setAttribute('aria-pressed', String(appState.viewMode === 'list'));

  // Retrieve filtered tasks
  const visibleTasks = getFilteredAndSortedTasks();

  // Clear previous content
  tasksContainer.innerHTML = '';

  // Handle empty state
  if (visibleTasks.length === 0) {
    tasksContainer.classList.add('hidden');
    emptyState.classList.remove('hidden');

    if (tasks.length === 0) {
      emptyStateTitle.textContent = 'No Tasks in Your Workspace';
      emptyStateMessage.textContent = 'Your schedule is clear! Click below to add an assignment or load sample college tasks.';
      emptyStateActionBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <span>Add Your First Task</span>
      `;
    } else {
      emptyStateTitle.textContent = 'No Matching Tasks Found';
      emptyStateMessage.textContent = 'None of your tasks match the current search or filter combination.';
      emptyStateActionBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>
        <span>Reset Search & Filters</span>
      `;
    }
  } else {
    tasksContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');

    // Render task cards
    visibleTasks.forEach(task => {
      const card = createTaskCardElement(task);
      tasksContainer.appendChild(card);
    });
  }

  // Update statistics and badges
  updateDashboardStats();
  updateActiveFilterBanner();
}

/**
 * Creates and returns an individual task DOM element.
 * @param {Object} task
 * @returns {HTMLElement}
 */
function createTaskCardElement(task) {
  const isOverdue = isTaskOverdue(task.dueDate, task.completed);
  const deadlineInfo = getRelativeDeadlineInfo(task.dueDate, task.completed);

  const card = document.createElement('article');
  card.className = `task-card ${task.completed ? 'is-completed' : ''} ${isOverdue ? 'is-overdue' : ''}`;
  card.setAttribute('data-id', task.id);

  // Escaped text to avoid XSS vulnerability
  const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  };

  card.innerHTML = `
    <!-- Card Header: Subject, Category, Priority -->
    <div class="task-card-header">
      <div class="task-badges-left">
        <span class="badge-subject">${escapeHTML(task.subject || 'General')}</span>
        ${task.category ? `<span class="badge-category">${escapeHTML(task.category)}</span>` : ''}
      </div>
      <span class="badge-priority priority-${task.priority}">
        ${task.priority === 'High' ? '🔴' : task.priority === 'Medium' ? '🟡' : '🟢'} ${task.priority}
      </span>
    </div>

    <!-- Card Body: Checkbox & Content -->
    <div class="task-card-body">
      <div class="task-checkbox-wrap">
        <label class="custom-checkbox-wrapper" title="${task.completed ? 'Mark as Pending' : 'Mark as Completed'}">
          <input 
            type="checkbox" 
            class="task-check-input" 
            ${task.completed ? 'checked' : ''} 
            data-action="toggle" 
            data-id="${task.id}"
            aria-label="Toggle task completed"
          >
          <span class="task-check-custom"></span>
        </label>
      </div>

      <div class="task-card-content">
        <h4 class="task-title">${escapeHTML(task.title)}</h4>
        ${task.description ? `<p class="task-description">${escapeHTML(task.description)}</p>` : ''}
      </div>
    </div>

    <!-- Card Footer: Due Date & Action Buttons -->
    <div class="task-card-footer">
      <div class="due-date-info">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span>${formatDisplayDate(task.dueDate)}</span>
        <span class="due-relative-tag ${deadlineInfo.className}">${deadlineInfo.text}</span>
      </div>

      <div class="task-actions">
        <button class="btn-action btn-edit" data-action="edit" data-id="${task.id}" title="Edit Task" aria-label="Edit Task">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button class="btn-action btn-delete" data-action="delete" data-id="${task.id}" title="Delete Task" aria-label="Delete Task">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
    </div>
  `;

  return card;
}

/* ==============================================================================
   10. CRUD OPERATIONS (CREATE, READ, UPDATE, DELETE, TOGGLE)
   ============================================================================== */

/**
 * Toggles a task's completed status between true and false.
 * @param {string} id 
 */
function toggleTaskStatus(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.completed = !task.completed;
  saveTasksToStorage();
  renderTasks();

  const msg = task.completed ? `Completed: "${task.title}"` : `Marked pending: "${task.title}"`;
  showToast(msg, 'success');
}

/**
 * Opens the Modal in "Add New Task" mode with clean fields.
 */
function openAddTaskModal() {
  clearFormValidation();
  taskForm.reset();
  taskIdInput.value = '';
  modalTitle.textContent = 'Add New Task';
  saveBtnText.textContent = 'Add Task';
  taskStatusCheckboxGroup.classList.add('hidden');

  // Pre-set default due date to tomorrow at 18:00
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(18, 0, 0, 0);
  taskDueDateInput.value = tomorrow.toISOString().slice(0, 16);

  taskModalOverlay.classList.remove('hidden');
  taskTitleInput.focus();
}

/**
 * Opens the Modal in "Edit Task" mode pre-populated with task data.
 * @param {string} id 
 */
function openEditTaskModal(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  clearFormValidation();
  taskIdInput.value = task.id;
  taskTitleInput.value = task.title;
  taskSubjectInput.value = task.subject || '';
  taskCategorySelect.value = task.category || 'Assignment';
  taskPrioritySelect.value = task.priority || 'Medium';
  taskDueDateInput.value = task.dueDate ? task.dueDate.slice(0, 16) : '';
  taskDescriptionInput.value = task.description || '';

  // Show status checkbox in edit mode
  taskStatusCheckboxGroup.classList.remove('hidden');
  taskCompletedCheckbox.checked = !!task.completed;

  modalTitle.textContent = 'Edit Task Details';
  saveBtnText.textContent = 'Update Task';

  taskModalOverlay.classList.remove('hidden');
  taskTitleInput.focus();
}

/**
 * Closes the Add/Edit Task modal.
 */
function closeTaskModal() {
  taskModalOverlay.classList.add('hidden');
  taskForm.reset();
  clearFormValidation();
}

/**
 * Form submission handler for both creating and updating tasks.
 * Validates inputs and updates state.
 * @param {Event} e 
 */
function handleTaskFormSubmit(e) {
  e.preventDefault();

  // Validate Form
  const isValid = validateTaskForm();
  if (!isValid) return;

  const id = taskIdInput.value;
  const title = taskTitleInput.value.trim();
  const subject = taskSubjectInput.value.trim();
  const category = taskCategorySelect.value;
  const priority = taskPrioritySelect.value;
  const dueDate = taskDueDateInput.value;
  const description = taskDescriptionInput.value.trim();

  if (id) {
    // Edit existing task
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        title,
        subject,
        category,
        priority,
        dueDate,
        description,
        completed: taskCompletedCheckbox.checked,
        updatedAt: new Date().toISOString()
      };
      saveTasksToStorage();
      populateSubjectFilterOptions();
      renderTasks();
      closeTaskModal();
      showToast('Task updated successfully!', 'success');
    }
  } else {
    // Create new task
    const newTask = {
      id: 'task-' + Date.now(),
      title,
      subject,
      category,
      priority,
      dueDate,
      description,
      completed: false,
      createdAt: new Date().toISOString()
    };

    // Prepend to top of array
    tasks.unshift(newTask);
    saveTasksToStorage();
    populateSubjectFilterOptions();
    renderTasks();
    closeTaskModal();
    showToast('New task added to your schedule!', 'success');
  }
}

/**
 * Validates required inputs and highlights errors.
 * @returns {boolean}
 */
function validateTaskForm() {
  let valid = true;
  clearFormValidation();

  // Title validation
  if (!taskTitleInput.value.trim()) {
    taskTitleInput.parentElement.classList.add('has-error');
    valid = false;
  }

  // Subject validation
  if (!taskSubjectInput.value.trim()) {
    taskSubjectInput.parentElement.classList.add('has-error');
    valid = false;
  }

  // Due date validation
  if (!taskDueDateInput.value) {
    taskDueDateInput.parentElement.classList.add('has-error');
    valid = false;
  } else {
    const enteredDate = new Date(taskDueDateInput.value);
    if (isNaN(enteredDate.getTime())) {
      taskDueDateInput.parentElement.classList.add('has-error');
      valid = false;
    }
  }

  return valid;
}

/**
 * Removes all error highlights and error messages from the form.
 */
function clearFormValidation() {
  const errorGroups = document.querySelectorAll('.form-group.has-error');
  errorGroups.forEach(group => group.classList.remove('has-error'));
}

/**
 * Opens custom delete confirmation modal.
 * @param {string} id 
 */
function promptDeleteTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  taskToDeleteId = id;
  deleteModalDescription.textContent = `Are you sure you want to delete "${task.title}"? This cannot be recovered.`;
  deleteModalOverlay.classList.remove('hidden');
}

/**
 * Closes the delete confirmation modal.
 */
function closeDeleteModal() {
  deleteModalOverlay.classList.add('hidden');
  taskToDeleteId = null;
}

/**
 * Performs actual deletion upon user confirmation.
 */
function confirmDeleteTask() {
  if (!taskToDeleteId) return;

  const taskIndex = tasks.findIndex(t => t.id === taskToDeleteId);
  if (taskIndex !== -1) {
    const deletedTitle = tasks[taskIndex].title;
    tasks.splice(taskIndex, 1);
    saveTasksToStorage();
    populateSubjectFilterOptions();
    renderTasks();
    showToast(`Deleted "${deletedTitle}"`, 'danger');
  }

  closeDeleteModal();
}

/* ==============================================================================
   11. TOAST NOTIFICATION SYSTEM
   ============================================================================== */

/**
 * Displays a non-blocking toast message.
 * @param {string} message 
 * @param {'success'|'danger'|'info'} type 
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconSvg = type === 'success' 
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
    : type === 'danger'
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';

  toast.innerHTML = `
    ${iconSvg}
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  // Auto-remove after 3.2 seconds
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, 3200);
}

/* ==============================================================================
   12. EVENT LISTENERS & DELEGATION
   ============================================================================== */

/**
 * Event delegation for clicks inside the tasks container
 * (handles toggle, edit, and delete without attaching hundreds of listeners).
 */
tasksContainer.addEventListener('click', (e) => {
  const target = e.target;

  // Toggle checkbox
  if (target.matches('.task-check-input')) {
    const id = target.getAttribute('data-id');
    toggleTaskStatus(id);
    return;
  }

  // Edit Button
  const editBtn = target.closest('.btn-edit');
  if (editBtn) {
    const id = editBtn.getAttribute('data-id');
    openEditTaskModal(id);
    return;
  }

  // Delete Button
  const deleteBtn = target.closest('.btn-delete');
  if (deleteBtn) {
    const id = deleteBtn.getAttribute('data-id');
    promptDeleteTask(id);
    return;
  }
});

// Search Input Listener
searchInput.addEventListener('input', (e) => {
  appState.searchQuery = e.target.value;
  clearSearchBtn.classList.toggle('hidden', !appState.searchQuery);
  renderTasks();
});

// Clear Search Button
clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  appState.searchQuery = '';
  clearSearchBtn.classList.add('hidden');
  renderTasks();
  searchInput.focus();
});

// Subject Filter
filterSubjectSelect.addEventListener('change', (e) => {
  appState.subjectFilter = e.target.value;
  renderTasks();
});

// Priority Filter
filterPrioritySelect.addEventListener('change', (e) => {
  appState.priorityFilter = e.target.value;
  renderTasks();
});

// Status Filter Dropdown
filterStatusSelect.addEventListener('change', (e) => {
  setNavFilter(e.target.value);
});

// Sort Select
sortTasksSelect.addEventListener('change', (e) => {
  appState.sortBy = e.target.value;
  renderTasks();
});

// Reset Filters Button
resetFiltersBtn.addEventListener('click', resetAllFilters);
clearFilterLink.addEventListener('click', resetAllFilters);

function resetAllFilters() {
  searchInput.value = '';
  appState.searchQuery = '';
  clearSearchBtn.classList.add('hidden');

  appState.statusFilter = 'all';
  filterStatusSelect.value = 'all';

  appState.priorityFilter = 'all';
  filterPrioritySelect.value = 'all';

  appState.subjectFilter = 'all';
  filterSubjectSelect.value = 'all';

  appState.sortBy = 'deadline-asc';
  sortTasksSelect.value = 'deadline-asc';

  // Update active sidebar nav
  navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-filter-status') === 'all');
  });

  renderTasks();
  showToast('Filters reset to default view', 'info');
}

// Sidebar Navigation Items
navItems.forEach(item => {
  item.addEventListener('click', () => {
    const status = item.getAttribute('data-filter-status');
    setNavFilter(status);
    closeMobileSidebar();
  });
});

function setNavFilter(status) {
  appState.statusFilter = status;
  filterStatusSelect.value = status;

  navItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-filter-status') === status);
  });

  renderTasks();
}

// View Mode Toggle (Grid vs List)
gridViewBtn.addEventListener('click', () => {
  appState.viewMode = 'grid';
  localStorage.setItem(VIEW_PREF_KEY, 'grid');
  renderTasks();
});

listViewBtn.addEventListener('click', () => {
  appState.viewMode = 'list';
  localStorage.setItem(VIEW_PREF_KEY, 'list');
  renderTasks();
});

// Empty State CTA Button
emptyStateActionBtn.addEventListener('click', () => {
  if (tasks.length === 0) {
    openAddTaskModal();
  } else {
    resetAllFilters();
  }
});

// Reset / Load Sample Tasks Button
resetSampleDataBtn.addEventListener('click', () => {
  if (confirm('Load sample college tasks? This will reset your workspace tasks to demo data.')) {
    tasks = getInitialSampleTasks();
    saveTasksToStorage();
    populateSubjectFilterOptions();
    resetAllFilters();
    showToast('Loaded 5 sample student tasks', 'success');
  }
});

// Modal Events
openAddTaskModalBtn.addEventListener('click', openAddTaskModal);
closeTaskModalBtn.addEventListener('click', closeTaskModal);
cancelTaskModalBtn.addEventListener('click', closeTaskModal);
taskForm.addEventListener('submit', handleTaskFormSubmit);

// Delete Modal Events
cancelDeleteBtn.addEventListener('click', closeDeleteModal);
confirmDeleteBtn.addEventListener('click', confirmDeleteTask);

// Close modals when clicking overlay background
taskModalOverlay.addEventListener('click', (e) => {
  if (e.target === taskModalOverlay) closeTaskModal();
});

deleteModalOverlay.addEventListener('click', (e) => {
  if (e.target === deleteModalOverlay) closeDeleteModal();
});

// Keyboard Accessibility: Esc closes open modals and mobile sidebar
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!taskModalOverlay.classList.contains('hidden')) {
      closeTaskModal();
    }
    if (!deleteModalOverlay.classList.contains('hidden')) {
      closeDeleteModal();
    }
    closeMobileSidebar();
  }
});

// Real-time input error clearing on user typing
taskTitleInput.addEventListener('input', () => {
  if (taskTitleInput.value.trim()) {
    taskTitleInput.parentElement.classList.remove('has-error');
  }
});
taskSubjectInput.addEventListener('input', () => {
  if (taskSubjectInput.value.trim()) {
    taskSubjectInput.parentElement.classList.remove('has-error');
  }
});
taskDueDateInput.addEventListener('input', () => {
  if (taskDueDateInput.value) {
    taskDueDateInput.parentElement.classList.remove('has-error');
  }
});

// Mobile Sidebar Drawer Controls
hamburgerBtn.addEventListener('click', () => {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('open');
});

closeSidebarBtn.addEventListener('click', closeMobileSidebar);
sidebarOverlay.addEventListener('click', closeMobileSidebar);

function closeMobileSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('open');
}

/* ==============================================================================
   13. APPLICATION BOOTSTRAP
   ============================================================================== */
function initApp() {
  loadTasksFromStorage();
  renderHeaderDate();
  populateSubjectFilterOptions();
  renderTasks();
  console.log('EduTask initialized successfully with', tasks.length, 'tasks.');
}

// Run bootstrap when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
