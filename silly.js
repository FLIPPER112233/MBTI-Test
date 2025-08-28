<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MBTI Personality Quiz</title>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #74ABE2, #5563DE);
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      color: #333;
    }
    .quiz-container {
      background: #fff;
      width: 90%;
      max-width: 700px;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.2);
      text-align: center;
    }
    h1 { margin-bottom: 10px; }
    #progress {
      margin: 10px 0 20px;
      font-size: 14px;
      color: #555;
    }
    .question {
      font-size: 18px;
      margin: 20px 0;
    }
    .options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    button.option {
      padding: 12px;
      border: none;
      border-radius: 8px;
      background: #5563DE;
      color: white;
      font-size: 16px;
      cursor: pointer;
      transition: 0.2s;
    }
    button.option:hover {
      background: #3949ab;
    }
    #result {
      display: none;
      padding: 20px;
      border-radius: 10px;
      background: #f4f6ff;
    }
    #mbtiType {
      font-size: 24px;
      font-weight: bold;
      color: #222;
    }
  </style>
</head>
<body>
  <div class="quiz-container">
    <h1>MBTI Personality Quiz</h1>
    <div id="progress"></div>
    <div id="quiz">
      <p class="question" id="questionText"></p>
      <div class="options" id="options"></div>
    </div>
    <div id="result">
      <h2>Your MBTI Type:</h2>
      <p id="mbtiType"></p>
      <p id="description"></p>
    </div>
  </div>

<script>
const questions = [
  // Social Life
  {q:"When you have a free evening, do you usually prefer going out to a lively event, or staying in for something quieter?",
    options:[{text:"Going out", value:"E"}, {text:"Staying in", value:"I"}]},
  {q:"When you meet new people, do you feel energized and excited, or does it feel draining?",
    options:[{text:"Energized and excited", value:"E"}, {text:"Draining, prefer small groups", value:"I"}]},
  {q:"Do you typically start conversations, or prefer others to initiate?",
    options:[{text:"Start conversations", value:"E"}, {text:"Let others initiate", value:"I"}]},
  // Work & Learning
  {q:"When working on a project, do you prefer collaborating or working alone?",
    options:[{text:"Collaborating with a group", value:"E"}, {text:"Working on my own", value:"I"}]},
  {q:"When sorting thoughts, do you talk them through or reflect quietly?",
    options:[{text:"Talk them through", value:"E"}, {text:"Think quietly", value:"I"}]},
  // Energy & Recharge
  {q:"I feel refreshed after spending time alone.", options:[{text:"True", value:"I"}, {text:"False", value:"E"}]},
  {q:"I feel refreshed after spending time around a lot of people.", options:[{text:"True", value:"E"}, {text:"False", value:"I"}]},
  // Communication
  {q:"In a group discussion, do you share often or wait until ready?",
    options:[{text:"Share often", value:"E"}, {text:"Listen, then share", value:"I"}]},
  {q:"Starting conversations with strangers feels easy for me.", 
    options:[{text:"True", value:"E"}, {text:"False", value:"I"}]},

  // Thinking/Feeling
  {q:"I usually make decisions based on logic rather than emotions.", options:[{text:"True", value:"T"}, {text:"False", value:"F"}]},
  {q:"I focus more on how decisions affect people than rules.", options:[{text:"True", value:"F"}, {text:"False", value:"T"}]},

  // Sensing/Intuition
  {q:"I trust facts more than abstract ideas.", options:[{text:"True", value:"S"}, {text:"False", value:"N"}]},
  {q:"I enjoy imagining future possibilities more than focusing on details.", options:[{text:"True", value:"N"}, {text:"False", value:"S"}]},

  // Judging/Perceiving
  {q:"I prefer planning and schedules over spontaneity.", options:[{text:"True", value:"J"}, {text:"False", value:"P"}]},
  {q:"I like to stay flexible and adapt as things happen.", options:[{text:"True", value:"P"}, {text:"False", value:"J"}]},

  // Extra Balanced Questions
  {q:"At a big social event, how do you feel?",
    options:[{text:"Energized and excited", value:"E"}, {text:"Comfortable for a while but need a break", value:"I"}, {text:"Overwhelmed, prefer quiet", value:"I"}]},
  {q:"When working on a project, do you prefer:", 
    options:[{text:"Big team", value:"E"}, {text:"Small group", value:"I"}, {text:"Solo work", value:"I"}]},
  {q:"Your ideal vacation would be:", 
    options:[{text:"Exploring a busy city", value:"E"}, {text:"A mix of adventure & downtime", value:"N"}, {text:"Quiet cabin/beach", value:"I"}]},
  {q:"I find it easy to strike up conversations with strangers.", options:[{text:"True", value:"E"}, {text:"False", value:"I"}]},
  {q:"I often prefer listening over talking in groups.", options:[{text:"True", value:"I"}, {text:"False", value:"E"}]}
];

let current = 0;
let scores = {E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0};

function loadQuestion() {
  if(current >= questions.length) {
    showResult();
    return;
  }
  document.getElementById("progress").innerText = `Question ${current+1} of ${questions.length}`;
  let q = questions[current];
  document.getElementById("questionText").innerText = q.q;
  let optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  q.options.forEach(opt => {
    let btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = opt.text;
    btn.onclick = () => {
      scores[opt.value]++;
      current++;
      loadQuestion();
    };
    optionsDiv.appendChild(btn);
  });
}

function showResult() {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("progress").style.display = "none";
  document.getElementById("result").style.display = "block";

  let mbti = "";
  mbti += scores.E >= scores.I ? "E" : "I";
  mbti += scores.S >= scores.N ? "S" : "N";
  mbti += scores.T >= scores.F ? "T" : "F";
  mbti += scores.J >= scores.P ? "J" : "P";

  document.getElementById("mbtiType").innerText = mbti;

  const descriptions = {
    "INTJ":"The Mastermind – strategic, logical, independent.",
    "ENFP":"The Inspirer – creative, social, enthusiastic.",
    "ISTJ":"The Inspector – practical, detail-oriented, reliable.",
    "ESFP":"The Performer – spontaneous, fun-loving, energetic."
    // (add more descriptions as needed)
  };
  document.getElementById("description").innerText = descriptions[mbti] || "Your unique MBTI profile.";
}

loadQuestion();
</script>
</body>
</html>
