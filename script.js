const questData = questDataJSON.sort((a, b) => a.name - b.name);

const settings = {
  easy: { count: 3, interval: 1000, timeLimit: 7 },
  normal: { count: 5, interval: 700, timeLimit: 8 },
  master: { count: 7, interval: 400, timeLimit: 7 },
  lunatic: { count: 10, interval: 250, timeLimit: 8 },
};

let numbers = [],
  answer = 0,
  timer,
  countdown,
  startTime;
let score = localStorage.getItem("flashScore") || 0;
$("#score").text("スコア: " + score);

function showNumbers(nums, interval, callback) {
  let i = 0;
  const display = setInterval(() => {
    if (i >= nums.length) {
      clearInterval(display);
      $("#number").text("");
      callback();
    } else {
      $("#number").text(nums[i].name);
      i++;
    }
  }, interval);
}

function downScore(numScore) {
  if (numScore < 15) {
    return 0;
  } else {
    return numScore - 15;
  }
}

function startGame() {
  answer = 0;
  const difficulty = $("#difficulty").val();
  const setting = settings[difficulty];
  numbers = Array.from(
    { length: setting.count },
    () => questData[Math.floor(Math.random() * questData.length)]
  );

  for (const { num } of numbers) {
    answer += parseInt(num);
  }

  $("#result").text("");
  $("#answer").hide();
  $("#submitAnswer").hide();
  $("#timer").hide();
  $("#startBtn").prop("disabled", true);

  showNumbers(numbers, setting.interval, () => {
    $("#answer").val("").show();
    $("#submitAnswer").show();
    $("#timer").show();

    let timeLeft = setting.timeLimit;
    $("#timeLeft").text(timeLeft);
    countdown = setInterval(() => {
      timeLeft--;
      $("#timeLeft").text(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(countdown);
      }
    }, 1000);

    startTime = Date.now();
    timer = setTimeout(() => {
      score = downScore(score);
      clearInterval(countdown);
      $("#result")
        .text("失敗!  スコアダウン!! 正解は " + answer)
        .css("color", "red");
      $("#score").text("スコア: " + score);
      $("#startBtn").prop("disabled", false);
      $("#answer").hide();
      $("#submitAnswer").hide();
      $("#timer").hide();
      localStorage.setItem("flashScore", score);
    }, setting.timeLimit * 1000);
  });
}

function submitAnswer() {
  clearTimeout(timer);
  clearInterval(countdown);
  const userAnswer = parseInt($("#answer").val());
  const endTime = Date.now();
  const timeTaken = (endTime - startTime) / 1000;
  const difficulty = $("#difficulty").val();
  const setting = settings[difficulty];

  if (userAnswer === answer) {
    let gained = 10;
    if (timeTaken < setting.timeLimit) {
      gained += Math.floor((setting.timeLimit - timeTaken) * 2);
    }
    score = parseInt(score) + gained;

    $("#result")
      .css("color", "green")
      .text("正解！+" + gained + "点");
  } else {
    $("#result")
      .css("color", "red")
      .text("失敗!  スコアダウン!! 正解は " + answer);
    score = downScore(score);
  }

  localStorage.setItem("flashScore", score);
  $("#score").text("スコア: " + score);
  $("#startBtn").prop("disabled", false);
  $("#answer").hide();
  $("#submitAnswer").hide();
  $("#timer").hide();
}

$("#startBtn").click(startGame);
$("#submitAnswer").click(submitAnswer);
