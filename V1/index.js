// IIFE to avoid creating global variables
(function() {
  let game = document.querySelector("#game");
  const allFruits = [
    "cherry",
    "banana",
    "apricot",
    "lime",
    "redwhatever",
    "otherapricot",
    "lemon",
    "strawberry",
    "greenapple",
    "peach",
    "grape",
    "watermelon",
    "plum",
    "pear",
    "cherry",
    "raspberry",
    "mango",
    "yellowcherry"
  ];

  const allCards = [
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13
  ];

  let pair = [];
  let score = 0;
  let nbCardsClicked = 0;

  const bar = document.querySelector(".bar");
  let elaspedTime = 0;
  const totalDurationInSec = 120;
  let intervalId = -1;
  const backendURL = "http://localhost:5000/scores";
  const bestScoresDiv = document.querySelector(".best-scores");

  // Uses shuffle algorythm provided by
  // https://bost.ocks.org/mike/shuffle/
  function shuffle(array) {
    var counter = array.length,
      temp,
      index;
    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * counter);
      // Decrease counter by 1
      counter--;
      // And swap the last element with it
      temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  }

  function resetGame() {
    getBestScores();
    const suffledCards = shuffle(allCards);
    console.log(suffledCards);

    const shuffleCardsRowOne = suffledCards.slice(0, 7);
    console.log("shuffleCardsRowOne", shuffleCardsRowOne);

    const rowOne = createRow({
      ids: shuffleCardsRowOne,
      rowId: "row-one"
    });
    // console.log("rowOne", rowOne);

    const shuffleCardsRowTwo = suffledCards.slice(7, 14);
    console.log("shuffleCardsRowTwo", shuffleCardsRowTwo);

    const rowTwo = createRow({
      ids: shuffleCardsRowTwo,
      rowId: "row-two"
    });
    // console.log("rowTwo", rowTwo);

    const shuffleCardsRowThree = suffledCards.slice(14, 21);
    console.log("shuffleCardsRowThree", shuffleCardsRowThree);

    const rowThree = createRow({
      ids: shuffleCardsRowThree,
      rowId: "row-three"
    });
    // console.log("rowThree", rowThree);

    const shuffleCardsRowFour = suffledCards.slice(21);
    console.log("shuffleCardsRowFour", shuffleCardsRowFour);

    const rowFour = createRow({
      ids: shuffleCardsRowFour,
      rowId: "row-four"
    });
    // console.log("rowFour", rowFour);

    game.innerHTML = `${rowOne} ${rowTwo} ${rowThree} ${rowFour}`;

    listenToClickAndReturnCSSclasses();
    resetVariables();
    startTimer();
  }

  function getBestScores() {
    fetch(backendURL)
      .then(data => data.json())
      .then(data => {
        console.log(data);
        let scores = [];
        data.scores.map(score => {
          scores = [
            ...scores,
            `<li>${score.user} - ${score.time} secondes</li>`
          ];
        });
        scores = ["<h3>Best Scores</h3>", "<ul>", ...scores, "</ul>"];
        bestScoresDiv.innerHTML = scores.join("");
      });
  }

  function resetVariables() {
    pair = [];
    score = 0;
    elaspedTime = 0;
    nbCardsClicked = 0;
  }

  function createRow(config) {
    const { ids, rowId } = config;
    let row = [`<div class="row" id="${rowId}">`];
    ids.map((cardId, idx) => {
      row = [
        ...row,
        `<div class="card" data-id="${idx + 1}">
        <div class="front ${allFruits[cardId]} hidden"></div>
        <div class="back"></div>
            </div>`
      ];
    });
    row = [...row, "</div>"];
    return row.join("");
  }

  function toggle(frontCard, backCard) {
    if (frontCard.classList.contains("hidden")) {
      frontCard.classList.remove("hidden");
      backCard.classList.add("hidden");
      startPairing(frontCard);
    } else {
      frontCard.classList.add("hidden");
      backCard.classList.remove("hidden");
    }
  }

  function listenToClickAndReturnCSSclasses() {
    // We need to cast the retrieved array like in order for it to become a real array
    let allCardsElements = Array.from(document.querySelectorAll(".card"));
    // on click, it should return 'front apricot' or 'front lemon' etc...
    allCardsElements.map(c => {
      c.children[0].addEventListener("click", () => clickHandler(c));
      // other child is the back card
      c.children[1].addEventListener("click", () => clickBackCardHandler(c));
    });
  }

  function clickHandler(c) {
    const cssClassesOnCard = c.children[0].classList.value;
    console.log("cssClassesOnCard", cssClassesOnCard);
  }

  function clickBackCardHandler(card) {
    if (nbCardsClicked === 2) {
      return;
    }
    nbCardsClicked = nbCardsClicked + 1;
    console.log(card);
    toggle(card.children[0], card.children[1]);
  }

  function startPairing(card) {
    pair = [...pair, card];
    console.log("pair", pair);
    if (pair.length === 2) {
      // if same fruit on both cards
      if (pair[0].classList.value === pair[1].classList.value) {
        // to give time to gamer to see the matching pair
        setTimeout(() => {
          nbCardsClicked = 0;
          handleSuccess();
        }, 1000);
      } else {
        // to give time to gamer to see the none matching pair
        setTimeout(() => {
          // display the back of both unmatching cards
          toggle(
            pair[0].parentNode.children[0],
            pair[0].parentNode.children[1]
          );
          toggle(
            pair[1].parentNode.children[0],
            pair[1].parentNode.children[1]
          );
          // different cards, just reset the array
          pair = [];
          nbCardsClicked = 0;
        }, 1000);
      }
    }
  }

  function handleSuccess() {
    score = score + 1;
    console.log("score", score);
    pair[0].removeEventListener("click", clickHandler);
    pair[1].removeEventListener("click", clickHandler);
    pair = [];
    evaluatePlayer();
  }

  function startTimer() {
    intervalId = setInterval(() => {
      elaspedTime = elaspedTime + 1;
      const currentWidth = (elaspedTime * 100) / totalDurationInSec;
      bar.style.width = currentWidth + "%";
      if (currentWidth >= 100) {
        clearGameTimer();
      }
    }, 1000);
  }

  function clearGameTimer() {
    clearInterval(intervalId);
    //we set the interval to -999 to know this game is over
    intervalId = -999;
    // setTimeout(() => {
    //   evaluatePlayer(); // TODO test if causes double save ?
    // }, 1000);
  }

  function evaluatePlayer() {
    // if we evalutate right after game is over (== time elapsed)
    if (intervalId === -999) {
      if (allCards.length / 2 === score) {
        // 1 point gained per pair found so if score is half the number of cards, it's a win :)
        congratulate();
      } else {
        encourageToRetry();
      }
    } else {
      // we want to know if it's a win before time is over
      if (allCards.length / 2 === score) {
        // there is remaining time so let's clear the timer
        clearGameTimer();
        congratulate();
      }
    }
  }

  function congratulate() {
    window.alert("Vous avez gagnééééé");
    saveScoreToServer();
  }

  function encourageToRetry() {
    window.alert("Vous avez perduuuuu");
    saveScoreToServer(score);
  }

  function saveScoreToServer() {
    // posting current score to server
    fetch(backendURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        time: elaspedTime,
        date: new Date().toISOString()
      })
    }).then(data => {
      console.log(data);
    });
  }

  resetGame();
})();
