// Data
const teachers = [
  { id: 1, name: "Khouloud Ahmed", subject: "Math" },
  { id: 2, name: "Amina Khalid", subject: "Science" }
];
const subs = [
  { id: 101, name: "Yasmin Abdullah", subjects: ["Math", "Science"] }
];
const schedule = { 1: [101, null, 101, null, null, 102, null, null] };

// Initialize Teachers
function initTeachers() {
  const list = document.getElementById('teacherList');
  teachers.forEach(t => {
    const card = document.createElement('div');
    card.className = 'teacher-card';
    card.textContent = `${t.name} (${t.subject})`;
    card.onclick = () => selectTeacher(t.id);
    list.appendChild(card);
  });
}

// Core Functions
let currentTeacher, currentCell, currentPeriod;
initTeachers();

document.getElementById('showSubstitutesBtn').onclick = showSchedule;
document.getElementById('saveBtn').onclick = () => alert("Saved!");
document.getElementById('notifyBtn').onclick = () => alert("Notifications sent!");
