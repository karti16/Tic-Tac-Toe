const game = (function () {
  let gamePlayScore = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let compFlag = true;
  const huPlayer = "x";
  const aiPlayer = "o";
  let compHardLevel = "noob";

  const boxes = document.querySelectorAll(".box");
  const resetBtns = document.querySelectorAll(".reset-game");
  const result = document.querySelector("#result");
  const winnerDisplay = document.querySelector("#winner");
  const noobBtn = document.querySelector(".noob-ai");
  const proBtn = document.querySelector(".pro-ai");

  noobBtn.style.backgroundColor = "#22e66fad";
  noobBtn.onclick = function () {
    compHardLevel = "noob";
    noobBtn.style.backgroundColor = "#22e66fad";
    proBtn.style.backgroundColor = "";
    resetGame();
  };

  proBtn.onclick = function () {
    compHardLevel = "pro";
    proBtn.style.backgroundColor = "#22e66fad";
    noobBtn.style.backgroundColor = "";
    resetGame();
  };

  resetBtns.forEach((resetBtn) => {
    resetBtn.addEventListener("click", resetGame);
  });

  boxes.forEach((box) => {
    box.addEventListener("click", gamePlay);
  });

  function gamePlay(e) {
    e.preventDefault();
    renderPlayerPlay(e);
    if (compFlag) {
      renderCompPlay();
    }
  }

  function renderPlayerPlay(e) {
    if (e.target.textContent != "x" && e.target.textContent != "o") {
      updateGamePlay((pos = e.target.id), (value = "x"));
      compFlag = true;
      e.target.textContent = "x";
      checkWinner(gamePlayScore, huPlayer);
    } else {
      compFlag = false;
    }
  }

  function renderCompPlay() {
    if (noOfEmptyCell()) {
      let num = getRandNum();
      updateGamePlay((pos = num), (value = "o"));
      document.getElementById(num).textContent = "o";
      checkWinner(gamePlayScore, aiPlayer);
      compFlag = true;
    } else {
      renderResult("Match Tied");
      boxes.forEach((box) => {
        box.classList.add("tie");
      });

      result.style.color = "#ffa700";
    }
  }

  function renderResult(winner) {
    winnerDisplay.innerHTML = `
    ${winner}`;
    result.style.visibility = "visible";
    boxes.forEach((box) => {
      box.removeEventListener("click", gamePlay);
    });
  }

  function resetGame() {
    compFlag = true;
    result.style.visibility = "hidden";
    result.classList.remove("won", "tie");
    boxes.forEach((box) => {
      box.innerHTML = "";
      box.classList.remove("won", "tie");
      box.addEventListener("click", gamePlay);
    });
    gamePlayScore = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }

  function updateGamePlay(pos, value) {
    if (noOfEmptyCell()) {
      gamePlayScore[pos] = value;
    } else {
      compFlag = false;
    }
  }

  function noOfEmptyCell() {
    let emptyCell = gamePlayScore.filter((item) => item != "x" && item != "o");
    return emptyCell.length;
  }

  function getEmptyCell(currBoard) {
    let emptyCell = currBoard.filter((item) => item != "x" && item != "o");
    return emptyCell;
  }

  function getRandNum() {
    function checkIfWinnerFound(currBdSt, currMark) {
      if (
        (currBdSt[0] === currMark &&
          currBdSt[1] === currMark &&
          currBdSt[2] === currMark) ||
        (currBdSt[3] === currMark &&
          currBdSt[4] === currMark &&
          currBdSt[5] === currMark) ||
        (currBdSt[6] === currMark &&
          currBdSt[7] === currMark &&
          currBdSt[8] === currMark) ||
        (currBdSt[0] === currMark &&
          currBdSt[3] === currMark &&
          currBdSt[6] === currMark) ||
        (currBdSt[1] === currMark &&
          currBdSt[4] === currMark &&
          currBdSt[7] === currMark) ||
        (currBdSt[2] === currMark &&
          currBdSt[5] === currMark &&
          currBdSt[8] === currMark) ||
        (currBdSt[0] === currMark &&
          currBdSt[4] === currMark &&
          currBdSt[8] === currMark) ||
        (currBdSt[2] === currMark &&
          currBdSt[4] === currMark &&
          currBdSt[6] === currMark)
      ) {
        return true;
      } else {
        return false;
      }
    }

    function minimax(currBdSt, currMark) {
      const availCellsIndexes = getEmptyCell(currBdSt);

      if (checkIfWinnerFound(currBdSt, huPlayer)) {
        return { score: -1 };
      } else if (checkIfWinnerFound(currBdSt, aiPlayer)) {
        return { score: 1 };
      } else if (availCellsIndexes.length === 0) {
        return { score: 0 };
      }

      const allTestPlayInfos = [];

      for (let i = 0; i < availCellsIndexes.length; i++) {
        const currentTestPlayInfo = {};
        currentTestPlayInfo.index = currBdSt[availCellsIndexes[i]];

        currBdSt[availCellsIndexes[i]] = currMark;

        if (currMark === aiPlayer) {
          const result = minimax(currBdSt, huPlayer);
          currentTestPlayInfo.score = result.score;
        } else {
          const result = minimax(currBdSt, aiPlayer);
          currentTestPlayInfo.score = result.score;
        }

        currBdSt[availCellsIndexes[i]] = currentTestPlayInfo.index;

        allTestPlayInfos.push(currentTestPlayInfo);
      }
      let bestTestPlay = null;
      if (currMark === aiPlayer) {
        let bestScore = -1000;
        for (let i = 0; i < allTestPlayInfos.length; i++) {
          if (allTestPlayInfos[i].score > bestScore) {
            bestScore = allTestPlayInfos[i].score;
            bestTestPlay = i;
          }
        }
      } else {
        let bestScore = 1000;
        for (let i = 0; i < allTestPlayInfos.length; i++) {
          if (allTestPlayInfos[i].score < bestScore) {
            bestScore = allTestPlayInfos[i].score;
            bestTestPlay = i;
          }
        }
      }
      return allTestPlayInfos[bestTestPlay];
    }
    if (compHardLevel == "pro") {
      let bestPlayInfo = minimax(gamePlayScore, aiPlayer);
      return bestPlayInfo.index;
    } else {
      let emptyArr = getEmptyCell(gamePlayScore);
      let num;
      num = emptyArr[Math.floor(Math.random() * emptyArr.length)];
      return num;
    }
  }

  function checkWinner(board, player) {
    if (board[0] === player && board[1] === player && board[2] === player) {
      resultBgColor("won", [0, 1, 2]);
      if (player == huPlayer) {
        renderResult("Player Won");
        compFlag = false;
      } else {
        renderResult("Computer Won");
        compFlag = false;
      }
      return true;
    }

    if (board[3] === player && board[4] === player && board[5] === player) {
      resultBgColor("won", [3, 4, 5]);
      if (player == huPlayer) {
        renderResult("Player Won");
        compFlag = false;
      } else {
        renderResult("Computer Won");
        compFlag = false;
      }
      return true;
    }
    if (board[6] === player && board[7] === player && board[8] === player) {
      resultBgColor("won", [6, 7, 8]);
      if (player == huPlayer) {
        renderResult("Player Won");
        compFlag = false;
      } else {
        renderResult("Computer Won");
        compFlag = false;
      }
      return true;
    }
    if (board[0] === player && board[3] === player && board[6] === player) {
      resultBgColor("won", [0, 3, 6]);
      if (player == huPlayer) {
        renderResult("Player Won");
        compFlag = false;
      } else {
        renderResult("Computer Won");
        compFlag = false;
      }
      return true;
    }
    if (board[1] === player && board[4] === player && board[7] === player) {
      resultBgColor("won", [1, 4, 7]);
      if (player == huPlayer) {
        renderResult("Player Won");
        compFlag = false;
      } else {
        renderResult("Computer Won");
        compFlag = false;
      }
      return true;
    }
    if (board[2] === player && board[5] === player && board[8] === player) {
      resultBgColor("won", [2, 5, 8]);
      if (player == huPlayer) {
        renderResult("Player Won");
        compFlag = false;
      } else {
        renderResult("Computer Won");
        compFlag = false;
      }
      return true;
    }
    if (board[0] === player && board[4] === player && board[8] === player) {
      resultBgColor("won", [0, 4, 8]);
      if (player == huPlayer) {
        renderResult("Player Won");
        compFlag = false;
      } else {
        renderResult("Computer Won");
        compFlag = false;
      }
      return true;
    }
    if (board[2] === player && board[4] === player && board[6] === player) {
      resultBgColor("won", [2, 4, 6]);
      if (player == huPlayer) {
        renderResult("Player Won");
        compFlag = false;
      } else {
        renderResult("Computer Won");
        compFlag = false;
      }
      return true;
    }
    return false;
  }

  function resultBgColor(cls, elemList) {
    result.style.color = "#22e66fad";
    for (let i = 0; i < elemList.length; i++) {
      document.getElementById(elemList[i]).classList.add(cls);
    }
  }

  return {};
})();
