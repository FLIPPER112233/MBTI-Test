/* =========================================================
   MBTI TEAM BUILDER - Full Functionality
   ========================================================= */

// ---------- PAGE NAVIGATION ----------
function showSection(sectionId) {
  // hide all
  document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

  // show selected section
  document.getElementById(sectionId).classList.add('active');
  document.querySelector(`.nav-btn[onclick="showSection('${sectionId}')"]`).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- GLOBAL VARIABLES ----------
let currentQuestion = 0;
let answers = [];
let currentName = "";

// ---------- QUIZ QUESTIONS ----------
const questions = [
  {text:"Do you prefer to spend time with others or alone?",options:[{text:"With others",value:"E"},{text:"Alone",value:"I"}]},
  {text:"Do you focus on facts or ideas?",options:[{text:"Facts",value:"S"},{text:"Ideas",value:"N"}]},
  {text:"Do you make decisions based on logic or feelings?",options:[{text:"Logic",value:"T"},{text:"Feelings",value:"F"}]},
  {text:"Do you prefer structure or flexibility?",options:[{text:"Structure",value:"J"},{text:"Flexibility",value:"P"}]},
  {text:"At a party, do you interact with many people or just a few close friends?",options:[{text:"Many people",value:"E"},{text:"Few close friends",value:"I"}]},
  {text:"Do you prefer practical or imaginative approaches?",options:[{text:"Practical",value:"S"},{text:"Imaginative",value:"N"}]},
  {text:"When making decisions, do you prioritize fairness or harmony?",options:[{text:"Fairness",value:"T"},{text:"Harmony",value:"F"}]},
  {text:"Do you prefer to plan ahead or be spontaneous?",options:[{text:"Plan ahead",value:"J"},{text:"Be spontaneous",value:"P"}]},
  {text:"Do you gain energy from social interaction or solitude?",options:[{text:"Social interaction",value:"E"},{text:"Solitude",value:"I"}]},
  {text:"Do you focus on details or the big picture?",options:[{text:"Details",value:"S"},{text:"Big picture",value:"N"}]},
  {text:"Are you more analytical or empathetic?",options:[{text:"Analytical",value:"T"},{text:"Empathetic",value:"F"}]},
  {text:"Do you prefer closure or keeping options open?",options:[{text:"Closure",value:"J"},{text:"Keeping options open",value:"P"}]},
  {text:"Do you feel more comfortable in groups or one-on-one?",options:[{text:"Groups",value:"E"},{text:"One-on-one",value:"I"}]},
  {text:"Do you trust experience or intuition?",options:[{text:"Experience",value:"S"},{text:"Intuition",value:"N"}]},
  {text:"Do you value truth or tact?",options:[{text:"Truth",value:"T"},{text:"Tact",value:"F"}]},
  {text:"Do you prefer organized or flexible schedules?",options:[{text:"Organized",value:"J"},{text:"Flexible",value:"P"}]},
  {text:"Do you think out loud or internally?",options:[{text:"Out loud",value:"E"},{text:"Internally",value:"I"}]},
  {text:"Are you more realistic or visionary?",options:[{text:"Realistic",value:"S"},{text:"Visionary",value:"N"}]},
  {text:"Do you value competence or compassion more?",options:[{text:"Competence",value:"T"},{text:"Compassion",value:"F"}]},
  {text:"Do you like having plans or going with the flow?",options:[{text:"Having plans",value:"J"},{text:"Going with the flow",value:"P"}]}
];

// ---------- QUIZ LOGIC ----------
function startQuiz() {
  const nameInput = document.getElementById("studentName");
  if (!nameInput.value.trim()) {
    alert("Please enter your name first!");
    return;
  }
  currentName = nameInput.value.trim();
  document.getElementById("nameInput").classList.add("hidden");
  document.getElementById("quizContent").classList.remove("hidden");
  loadQuestion();
}

function loadQuestion() {
  const wrapper = document.getElementById("questionsWrapper");
  wrapper.innerHTML = "";
  const q = questions[currentQuestion];
  const div = document.createElement("div");
  div.classList.add("question", "active");
  div.innerHTML = `
    <h2>${q.text}</h2>
    <div class="answers">
      ${q.options.map(o => `<button onclick="answerQuestion('${o.value}')">${o.text}</button>`).join("")}
    </div>
  `;
  wrapper.appendChild(div);
  updateProgress();
}

function answerQuestion(value) {
  answers.push(value);
  currentQuestion++;
  if (currentQuestion < questions.length) {
    loadQuestion();
  } else {
    calculateMBTI();
  }
}

function updateProgress() {
  const progress = ((currentQuestion) / questions.length) * 100;
  document.getElementById("progressBar").style.width = progress + "%";
  document.getElementById("questionNumber").textContent = currentQuestion + 1;
}

function calculateMBTI() {
  let counts = {E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0};
  answers.forEach(v => counts[v]++);
  const type = 
    (counts.E>=counts.I?'E':'I') +
    (counts.S>=counts.N?'S':'N') +
    (counts.T>=counts.F?'T':'F') +
    (counts.J>=counts.P?'J':'P');

  document.getElementById("mbti").textContent = type;
  document.getElementById("completedName").textContent = currentName;
  document.getElementById("questionsWrapper").innerHTML = "";
  document.getElementById("result").classList.add("active");

  // save student
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  students.push({name: currentName, mbti: type});
  localStorage.setItem("students", JSON.stringify(students));
}

function resetQuiz() {
  currentQuestion = 0;
  answers = [];
  document.getElementById("nameInput").classList.remove("hidden");
  document.getElementById("quizContent").classList.add("hidden");
  document.getElementById("result").classList.remove("active");
  document.getElementById("studentName").value = "";
  document.getElementById("progressBar").style.width = "0%";
}

// ---------- TEACHER AREA ----------
function checkPassword() {
  const input = document.getElementById("passwordInput");
  const error = document.getElementById("errorMessage");
  if (input.value === "teacher123") {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("seatingSection").classList.remove("hidden");
    loadStudents();
  } else {
    error.classList.add("active");
  }
}

function logout() {
  document.getElementById("loginSection").classList.remove("hidden");
  document.getElementById("seatingSection").classList.add("hidden");
  document.getElementById("passwordInput").value = "";
}

function loadStudents() {
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  document.getElementById("totalStudents").textContent = students.length;
  const uniqueTypes = new Set(students.map(s => s.mbti));
  document.getElementById("uniqueTypes").textContent = uniqueTypes.size;

  const tbody = document.getElementById("studentTableBody");
  tbody.innerHTML = "";
  students.forEach(s => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${s.name}</td><td><span class="mbti-badge">${s.mbti}</span></td>`;
    tbody.appendChild(row);
  });

  if (students.length > 0)
    document.getElementById("studentListSection").classList.remove("hidden");
}

function createSeating() {
  const groupCount = parseInt(document.getElementById("groupCount").value);
  const seatsPerGroup = parseInt(document.getElementById("seatsPerGroup").value);
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const seatingResult = document.getElementById("seatingResult");
  seatingResult.innerHTML = "";

  if (students.length === 0) {
    seatingResult.innerHTML = "<p>No students available.</p>";
    return;
  }

  // shuffle students
  const shuffled = [...students].sort(() => 0.5 - Math.random());
  for (let i = 0; i < groupCount; i++) {
    const groupDiv = document.createElement("div");
    groupDiv.classList.add("group");
    groupDiv.innerHTML = `<h3>Group ${i + 1}</h3>`;
    const groupStudents = shuffled.slice(i * seatsPerGroup, (i + 1) * seatsPerGroup);
    groupStudents.forEach(s => {
      groupDiv.innerHTML += `<div class="student">${s.name} - <span class="mbti-badge">${s.mbti}</span></div>`;
    });
    seatingResult.appendChild(groupDiv);
  }

  document.getElementById("exportSection").classList.remove("hidden");
}

function exportToCSV() {
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  if (!students.length) return;
  let csv = "Name,MBTI\n";
  students.forEach(s => csv += `${s.name},${s.mbti}\n`);
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "mbti_results.csv";
  a.click();
}

function clearStudents() {
  const confirmClear = confirm("⚠️ Are you sure you want to delete all saved students? This action cannot be undone.");
  if (confirmClear) {
    localStorage.removeItem('mbtiStudents');
    updateTeacherDashboard(); // Refresh dashboard
    alert("All student data has been cleared.");
  }
}

localStorage.clear();

