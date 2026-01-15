let player1 = "";
let player2 = "";
let score1 = 0;
let score2 = 0;
let round = 1;
let selectedCategory = "";
let usedCategories = [];
let questions = [];
let currentQuestionIndex = 0;

let turnOrder = [
    { player: 1, difficulty: "easy" },
    { player: 2, difficulty: "easy" },
    { player: 1, difficulty: "medium" },
    { player: 2, difficulty: "medium" },
    { player: 1, difficulty: "hard" },
    { player: 2, difficulty: "hard" }
];

document.getElementById("startButton").addEventListener("click", function () {
    player1 = document.getElementById("name1").value.trim().toUpperCase();
    player2 = document.getElementById("name2").value.trim().toUpperCase();
    if (player1 === "" || player2 === "") {
        document.getElementById("errorMsg").textContent = "Both player names are required";
        return;
    }
    if (player1 === player2) {
        document.getElementById("errorMsg").textContent = "Player names must be different";
        return;
    }
    document.getElementById("screen1").style.display = "none";
    document.getElementById("screen2").style.display = "block";
    document.getElementById("roundText").textContent = "Round " + round;
});

document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", function () {
        if (usedCategories.includes(button.id)) {
            alert("This category is already used");
            return;
        }
        selectedCategory = button.id;
        document.getElementById("selectedCategoryText").textContent =
            "Selected Category: " + button.textContent;
    });
});

document.getElementById("startRoundButton").addEventListener("click", function () {
    if (selectedCategory === "") {
        alert("Please select a category");
        return;
    }
    questions = [];
    currentQuestionIndex = 0;
    EasyQuestions();
});

function EasyQuestions() {
    fetch(`https://the-trivia-api.com/v2/questions?categories=${selectedCategory}&difficulty=easy&limit=2`)
        .then(res => res.json())
        .then(data => {
            questions = questions.concat(data);
            MediumQuestions();
        });
}

function MediumQuestions() {
    fetch(`https://the-trivia-api.com/v2/questions?categories=${selectedCategory}&difficulty=medium&limit=2`)
        .then(res => res.json())
        .then(data => {
            questions = questions.concat(data);
            HardQuestions();
        });
}

function HardQuestions() {
    fetch(`https://the-trivia-api.com/v2/questions?categories=${selectedCategory}&difficulty=hard&limit=2`)
        .then(res => res.json())
        .then(data => {
            questions = questions.concat(data);
            document.getElementById("screen2").style.display = "none";
            document.getElementById("screen3").style.display = "block";
            showQuestion();
        });
}

function showQuestion() {
    let questionObj = questions[currentQuestionIndex];
    let turn = turnOrder[currentQuestionIndex];
    document.getElementById("gameInfo").textContent =
        `Round ${round} | ${selectedCategory.toUpperCase()} | ${turn.difficulty.toUpperCase()} | Player ${turn.player}'s turn`;
    document.getElementById("scoreBoard").textContent =
        `${player1}: ${score1} | ${player2}: ${score2}`;
    document.getElementById("questionText").textContent = questionObj.question.text;


    let optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";
    let options = [...questionObj.incorrectAnswers, questionObj.correctAnswer];
    options.sort(() => Math.random() - 0.5);
    options.forEach(option => {
        let btn = document.createElement("button");
        btn.textContent = option;
        btn.addEventListener("click", function () {
            handleAnswer(option, questionObj.correctAnswer, turn);
        });
        optionsDiv.appendChild(btn);
    });
    document.getElementById("nextQuestionButton").disabled = true;
}

function handleAnswer(selected, correct, turn) {
    document.querySelectorAll("#options button").forEach(btn => {
        btn.disabled = true;


        if (btn.textContent === correct) {
            btn.style.backgroundColor = "lightgreen";
        }

        if (btn.textContent === selected && selected !== correct) {
            btn.style.backgroundColor = "lightcoral";
        }
    });

    if (selected === correct) {
        let points =
            turn.difficulty === "easy" ? 10 :
            turn.difficulty === "medium" ? 15 : 20;
        if (turn.player === 1) score1 += points;
        else score2 += points;
    }
    document.getElementById("scoreBoard").textContent =
        `${player1}: ${score1} | ${player2}: ${score2}`;



    document.getElementById("nextQuestionButton").disabled = false;
}

document.getElementById("nextQuestionButton").addEventListener("click", function () {
    currentQuestionIndex++;

    if (currentQuestionIndex < 6) {
        showQuestion();
    } 
    else {
        usedCategories.push(selectedCategory);
        document.getElementById(selectedCategory).disabled = true;
        selectedCategory = "";

        document.getElementById("screen3").style.display = "none";


        document.getElementById("screen4").style.display = "block";
    }
});

document.getElementById("nextRoundButton").addEventListener("click", function () {
    round++;
    document.getElementById("screen4").style.display = "none";
    document.getElementById("screen2").style.display = "block";
    document.getElementById("roundText").textContent = "Round " + round;
    document.getElementById("selectedCategoryText").textContent = "";
});

document.getElementById("endGameButton").addEventListener("click", function () {
    document.getElementById("screen4").style.display = "none";
    document.getElementById("screen5").style.display = "block";

    document.getElementById("finalScore").textContent =
        `${player1}: ${score1} | ${player2}: ${score2}`;


    let winner =
        score1 > score2 ? player1 :
        score2 > score1 ? player2 :
        "Draw";
    document.getElementById("winnerText").textContent =
        winner === "Draw" ? "It's a Draw" : winner + " Wins";
});

document.getElementById("restartGameButton").addEventListener("click", function () {
    player1 = "";
    player2 = "";
    score1 = 0;
    score2 = 0;
    round = 1;
    selectedCategory = "";
    usedCategories = [];
    questions = [];
    currentQuestionIndex = 0;
    document.getElementById("name1").value = "";
    document.getElementById("name2").value = "";
    document.getElementById("errorMsg").textContent = "";
    document.getElementById("screen5").style.display = "none";
    document.getElementById("screen1").style.display = "block";
});

