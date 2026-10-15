# Academic Mini-Project Report
## Subject: Web Application Development (WAD PBL)
### Project Title: Student Task Manager Web Application ("EduTask")

---

## 1. Introduction
In higher education, undergraduate and graduate students balance multiple concurrent academic obligations, including laboratory assignments, continuous assessment tests, midterm exams, semester projects, and group presentations. Without an organized scheduling tool, students frequently face deadline confusion, missed submissions, and increased academic stress.

The **Student Task Manager ("EduTask")** is an intuitive, web-based single-page application (SPA) created specifically to address this problem. It allows students to log academic tasks with corresponding course codes/subjects, task categories, priority levels, and exact deadlines. The application calculates real-time academic workload metrics and deadline countdowns, operating purely in the client's web browser without necessitating backend infrastructure or internet-dependent databases.

---

## 2. Objectives
The key objectives of this mini-project are:
1. **Centralized Academic Task Tracking:** Provide a unified interface for scheduling assignments, homework, lab reports, exams, and project milestones.
2. **Real-time Status Monitoring:** Automatically compute and display key indicators including total tasks, pending tasks, completed tasks, and overdue tasks.
3. **Comprehensive Task Life-Cycle (CRUD):** Implement complete functionality to create, view, edit, mark complete, and delete tasks with user safety checks.
4. **Flexible Organization & Retrieval:** Implement instantaneous multi-attribute search and filtering (by status, priority, and subject) along with deadline-based and priority-based sorting.
5. **Zero-Configuration Client Persistence:** Exploit browser `localStorage` to retain student records across sessions, page reloads, and browser restarts.
6. **Academic Demonstration of Core Web Standards:** Exhibit proficient implementation of semantic HTML5, responsive CSS3 Grid/Flexbox design, and clean, modular vanilla JavaScript.

---

## 3. Technologies Used

| Technology | Purpose & Implementation Role |
| :--- | :--- |
| **HTML5** | Semantic structural organization (`<header>`, `<aside>`, `<main>`, `<article>`, `<section>`), accessible dialog modals, custom form controls, and embedded SVG icons. |
| **CSS3** | Modern aesthetic design using CSS Custom Properties (variables), CSS Grid & Flexbox, micro-transitions, responsive media queries, and accessible focus states. |
| **JavaScript (ES6+)** | Dynamic state management, asynchronous event delegation, array manipulation (`filter`, `sort`, `map`), DOM mutation, and Date difference calculations. |
| **Web Storage API (`localStorage`)** | Client-side serialization (`JSON.stringify` / `JSON.parse`) to provide non-volatile offline persistence. |
| **Google Fonts (Inter)** | Clean, accessible typography optimized for dashboard interfaces. |

---

## 4. Methodology & Implementation

### 4.1 Architecture & State Flow
EduTask is structured around an event-driven Single Page Application model:
1. **Application State (`appState` & `tasks`):** State is held in a centralized JavaScript array of task objects and a filter configuration object.
2. **Storage Synchronization:** Every mutating action (create, update, toggle, delete) writes to `localStorage` through `saveTasksToStorage()`.
3. **Reactive Re-rendering:** UI views are updated deterministically by running data through the filter/sort pipeline (`getFilteredAndSortedTasks()`) before rendering DOM elements (`renderTasks()`).

```
+-------------------------------------------------------------+
|                     User Interaction                        |
|  (Add Task / Toggle Checkbox / Search / Filter / Delete)    |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                   JavaScript Event Handlers                 |
|   (Event Delegation, Form Validation, Array Manipulation)   |
+------------------------------+------------------------------+
                               |
                +--------------+---------------+
                |                              |
                v                              v
+-------------------------------+ +---------------------------+
|    Browser localStorage       | |   Dashboard Calculations  |
| (JSON Serialization & Storage)| |(Total, Pending, Overdue, %)|
+-------------------------------+ +-------------+-------------+
                                                |
                                                v
+-------------------------------------------------------------+
|                      DOM Rendering                          |
| (Task Cards Grid/List, KPI Counters, Toast Notifications)   |
+-------------------------------------------------------------+
```

### 4.2 Data Model Structure
Each academic task is stored as a structured JSON object:
```javascript
{
  "id": "task-1729000000000",
  "title": "Submit Web Development PBL Project & Report",
  "subject": "Web Development",
  "category": "Project",
  "priority": "High",       // High | Medium | Low
  "dueDate": "2026-10-18T23:59",
  "description": "Prepare final source code, documentation, and demo.",
  "completed": false,
  "createdAt": "2026-10-15T11:34:00.000Z"
}
```

### 4.3 Validation Strategy
- **Title Validation:** Ensures the task title is non-empty after trimming whitespace.
- **Subject Validation:** Requires an academic subject or course name.
- **Deadline Validation:** Ensures a valid date-time string is supplied.
- **Visual Feedback:** Highlights error inputs with soft red borders and shows clear inline error messages. Errors clear automatically as the user types.

---

## 5. Demonstration & Output Descriptions

The application was tested through automated and interactive end-to-end browser verification. Below are descriptions of key screens and states:

### 5.1 Main Dashboard View
- **Sidebar:** Contains navigation views (`All Tasks`, `Pending`, `Completed`, `Overdue`) with real-time badges, an academic progress bar showing completion rate percentage, and a shortcut to reload sample tasks.
- **Header:** Features a dynamic date greeting and a prominent `+ Add New Task` action button.
- **Metric Cards:**
  - *Total Tasks:* Displays total number of active and finished assignments.
  - *Pending:* Number of unfinished assignments.
  - *Completed:* Tasks successfully completed with strike-through styling.
  - *Overdue:* Tasks where the deadline has elapsed without completion.
- **Toolbar:** Contains a live search bar, dynamic Subject filter, Priority filter, Status filter, Sort selector (by deadline, priority, title), and Grid/List view toggle.

### 5.2 Task Cards (Grid & List Mode)
Each task card renders:
- Course name chip (e.g., `Web Development`, `Operating Systems`)
- Task category badge (`Project`, `Exam`, `Assignment`, `Lab Work`)
- Color-coded priority pill: 🔴 High (Soft Rose), 🟡 Medium (Warm Gold), 🟢 Low (Soft Sky)
- Custom interactive checkbox for immediate status toggle
- Relative deadline status tag (e.g., `Due in 2 days`, `Due today`, `Overdue by 1d`)
- Action buttons for editing and deletion

### 5.3 Add & Edit Task Modal
- Clean pop-up dialog with semi-transparent backdrop blur.
- Includes course datalist autocomplete for common subjects.
- In edit mode, pre-fills all current attributes and displays a completion toggle checkbox.

### 5.4 Delete Confirmation Modal
- Instead of using the browser's default `window.confirm()`, EduTask displays a custom modal dialog warning the student of permanent deletion.

### 5.5 Toast Notifications
- Floating non-intrusive alert toasts appear at the bottom-right corner upon task addition, status toggling, modification, or removal, and fade out automatically after 3 seconds.

---

## 6. Sample Demonstration Tasks

On first launch (or when clicking *"Load Sample Tasks"*), the application seeds the following realistic academic tasks:

1. **Task 1 (Project):**  
   - *Title:* Submit Web Development PBL Project & Report  
   - *Subject:* Web Development  
   - *Priority:* High | *Status:* Pending | *Due:* In 2 days  
2. **Task 2 (Lab Work - Overdue Demonstration):**  
   - *Title:* Data Structures Lab 4 - Binary Search Tree Analysis  
   - *Subject:* Data Structures & Algorithms  
   - *Priority:* High | *Status:* Pending | *Due:* 1 day ago (Overdue)  
3. **Task 3 (Exam Preparation):**  
   - *Title:* DBMS Midterm Exam Revision - Normalization & SQL Queries  
   - *Subject:* Database Management (DBMS)  
   - *Priority:* Medium | *Status:* Pending | *Due:* In 5 days  
4. **Task 4 (Presentation - Completed Demonstration):**  
   - *Title:* Operating Systems - CPU Scheduling Presentation Slides  
   - *Subject:* Operating Systems  
   - *Priority:* Low | *Status:* Completed | *Due:* In 7 days  
5. **Task 5 (Assignment):**  
   - *Title:* Computer Networks - TCP vs UDP Wireshark Packet Capture  
   - *Subject:* Computer Networks  
   - *Priority:* Medium | *Status:* Pending | *Due:* In 4 days  

---

## 7. Testing & Verification Results

| Test Case | Test Description | Expected Result | Status |
| :---: | :--- | :--- | :---: |
| **TC-01** | First launch without prior data | Loads sample tasks, computes stats (5 Total, 1 Overdue, 1 Completed) | **PASS** |
| **TC-02** | Add task without title | Form shows validation error; task is not created | **PASS** |
| **TC-03** | Add task with valid attributes | Task appears in list; Total count increments | **PASS** |
| **TC-04** | Real-time search query | Card list filters immediately as user types keywords | **PASS** |
| **TC-05** | Mark task as completed | Card acquires strike-through; Completed counter increments; progress bar updates | **PASS** |
| **TC-06** | Edit existing task | Modal pre-populates with data; changes save correctly | **PASS** |
| **TC-07** | Delete task with confirmation | Modal prompts confirmation; confirming removes card and decrements counter | **PASS** |
| **TC-08** | Browser refresh / reopen | `localStorage` recovers all modifications without data loss | **PASS** |
| **TC-09** | Responsive view test | Layout adjusts seamlessly on mobile, tablet, and desktop screens | **PASS** |

---

## 8. Conclusion
The **EduTask Student Task Manager** successfully demonstrates the implementation of a full-featured, responsive, and aesthetically pleasing client-side web application. By leveraging HTML5, CSS3, vanilla JavaScript, and the Web Storage API, it fulfills all academic requirements for the Web Application Development course while providing a practical, production-quality tool for student task scheduling.
