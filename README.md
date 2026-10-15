# EduTask - Student Task Manager Web Application

> **Course / Subject:** Web Application Development (WAD PBL Mini-Project)  
> **Tech Stack:** HTML5, CSS3, JavaScript (Vanilla ES6+), Browser `localStorage` (No server or external dependencies needed).

---

## 📌 Project Overview
**EduTask** is a modern, lightweight, student-centric task manager created to help college students efficiently organize their assignments, exams, laboratory submissions, homework, and project deadlines in a single dashboard. 

The application operates completely on client-side technologies without requiring any external database, API keys, node backend, or paid subscriptions. All data persists reliably in the student's browser using the HTML5 Web Storage API (`localStorage`).

---

## ✨ Key Features

1. **Academic Dashboard:**
   - Real-time KPI summary cards: **Total Tasks**, **Pending Tasks**, **Completed Tasks**, and **Overdue Tasks**.
   - Dynamic academic completion rate percentage bar with motivational messaging.
2. **Task Management (Full CRUD):**
   - **Create:** Add new tasks with title, course/subject, category (Assignment, Exam, Project, Lab Work, Presentation, Homework), priority level (High, Medium, Low), and deadline timestamp.
   - **Read & View:** Clean, responsive task cards with subject chips, priority badges, and countdown tags (e.g., *"Due in 2 days"*, *"Overdue by 1d"*).
   - **Update / Edit:** Modal interface to modify existing task details.
   - **Delete:** Unwanted task removal backed by an intuitive confirmation dialog.
   - **Toggle Completion:** One-click custom checkboxes with dynamic strike-through styling.
3. **Advanced Filtering & Real-Time Search:**
   - Live instant text search filtering by task title, course name, or description.
   - Filter by status (`All`, `Pending`, `Completed`, `Overdue`).
   - Filter by priority (`High`, `Medium`, `Low`).
   - Dynamically populated subject filter dropdown extracted from current tasks.
4. **Sorting:**
   - Sort by Deadline (Soonest first, Furthest first).
   - Sort by Priority (High to Low, Low to High).
   - Alphabetical sorting (A to Z).
5. **View Toggle:**
   - Seamless switching between **Grid View** (cards) and **List View** (compact rows), with view preference saved in `localStorage`.
6. **Form Validation & User Feedback:**
   - Mandatory validation for title, subject, and valid deadlines.
   - Non-blocking floating toast notifications for user actions (create, edit, complete, delete).
7. **Sample College Tasks:**
   - Pre-populated with 5 realistic academic tasks on first launch.
   - Built-in *"Load Sample Tasks"* button to restore demonstration data at any time.

---

## 📁 File Structure

```text
wad-pbl/
├── index.html         # Semantic HTML5 structure, modals, forms & SVGs
├── style.css          # CSS3 custom properties, responsive layout & animations
├── script.js          # JavaScript logic, DOM manipulation, filters & localStorage
├── README.md          # Project overview, setup & running instructions
└── PROJECT_REPORT.md  # Academic project report (Objectives, methodology & output)
```

---

## 🚀 How to Run the Project

Since EduTask uses pure HTML5, CSS3, and JavaScript, **no installation or `npm install` is required**.

### Method 1: Direct Browser Launch (Easiest)
1. Navigate to the project folder in your File Explorer.
2. Double-click `index.html` (or right-click -> **Open with** -> **Google Chrome / Microsoft Edge / Mozilla Firefox**).
3. The application will immediately run in your browser.

### Method 2: Using VS Code Live Server
1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension (by Ritwick Dey) if not already installed.
3. Right-click `index.html` and click **"Open with Live Server"**.
4. The site will open at `http://127.0.0.1:5500`.

### Method 3: Using Python Built-in Server
If you prefer running a local HTTP server:
```bash
# In the project directory, run:
python -m http.server 8080
```
Then visit: `http://localhost:8080` in any web browser.

---

## 🧠 Academic Concepts Demonstrated

- **HTML5:** Semantic layout tags (`<main>`, `<aside>`, `<header>`, `<article>`, `<section>`), accessible form controls with datalists and date-time pickers.
- **CSS3:** Modern CSS Custom Properties (CSS variables), Flexbox, CSS Grid layouts, media queries for responsive design, custom checkbox styling, backdrop blur effects.
- **JavaScript (ES6+):**
  - **DOM Manipulation:** `document.getElementById`, `document.querySelectorAll`, `createElement`, `innerHTML`, `classList` toggling.
  - **Event Delegation:** Attaching a centralized event listener to parent containers to handle dynamic child elements efficiently.
  - **Array Methods:** `.filter()`, `.sort()`, `.find()`, `.findIndex()`, `.forEach()`, `.map()`, and ES6 Sets.
  - **HTML5 Web Storage API:** `localStorage.getItem()`, `localStorage.setItem()`, and `JSON.parse()` / `JSON.stringify()`.
  - **Date Operations:** JavaScript `Date` parsing, timestamp difference calculation for relative remaining time and overdue detection.

---

## 👥 Authors / Acknowledgments
- Developed as a Project-Based Learning (PBL) mini-project for the **Web Application Development (WAD)** course.
