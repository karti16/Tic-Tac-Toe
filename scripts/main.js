const game = (function () {
  //game pos and value are stored in object
  const gamePlayScore = {};
  const winmap = ["123", "456", "789", "147", "258", "369", "159", "357"];
  let positions = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  let compFlag = true;

  const boxes = document.querySelectorAll(".box");
  const resetBtns = document.querySelectorAll(".reset-game");
  const result = document.querySelector("#result");
  const winnerDisplay = document.querySelector("#winner");

  resetBtns.forEach((resetBtn) => {
    resetBtn.addEventListener("click", resetGame);
  });

  gamePlay();

  function gamePlay() {
    boxes.forEach((box) => {
      box.addEventListener("click", function (e) {
        e.preventDefault();
        renderPlayerPlay(e);
        if (compFlag) {
          setTimeout(renderCompPlay, 0.3 * 1000);
        }
      });
    });
  }

  function renderPlayerPlay(e) {
    if (e.target.textContent != "x" && e.target.textContent != "o") {
      updateGamePlay((pos = e.target.id), (value = "x"));
      popPosition(e.target.id);
      compFlag = true;
      e.target.textContent = "x";
      whoWon();
    } else {
      compFlag = false;
    }
  }

  function renderCompPlay() {
    if (positions.length) {
      let num = getRandNum();
      updateGamePlay((pos = num), (value = "o"));
      document.getElementById(num).innerHTML = "o";
      whoWon();
    } else {
      renderResult("Match Tied");
      boxes.forEach((box) => {
        box.classList.add("tie");
      });
    }
  }

  function popPosition(num) {
    return positions.splice(positions.indexOf(num), 1);
  }

  function renderResult(winner) {
    winnerDisplay.innerHTML = `
    ${winner}`;
    result.style.visibility = "visible";
  }

  function resetGame() {
    compFlag = true;
    result.style.visibility = "hidden";
    boxes.forEach((box) => {
      box.innerHTML = "";
      box.classList.remove("won", "tie");
    });
    for (let score in gamePlayScore) {
      delete gamePlayScore[score];
    }
    positions = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  }

  function updateGamePlay(pos, value) {
    let objLen = Object.keys(gamePlayScore).length;
    if (objLen < 9) {
      gamePlayScore[pos] = value;
    } else {
      compFlag = false;
    }
  }

  function getRandNum() {
    let num;
    num = positions[Math.floor(Math.random() * positions.length)];
    popPosition(num);
    return num;
  }

  function whoWon() {
    checkifPlayerWon();
    checkifCompWon();
  }

  function checkifPlayerWon() {
    for (let i = 0; i < winmap.length; i++) {
      const len = winmap[i]
        .split("")
        .filter((item) => gamePlayScore[item] !== "x").length;
      if (len == 0) {
        winmap[i].split("").forEach((item) => winningBgColor(item));
        renderResult("Player Won");
        compFlag = false;
      }
    }
  }

  function checkifCompWon() {
    for (let i = 0; i < winmap.length; i++) {
      const len = winmap[i]
        .split("")
        .filter((item) => gamePlayScore[item] !== "o").length;
      if (len == 0) {
        winmap[i].split("").forEach((item) => winningBgColor(item));
        renderResult("Computer Won");
        compFlag = false;
      }
    }
  }

  function winningBgColor(id) {
    document.getElementById(id).classList.add("won");
  }

  return {};
})();
