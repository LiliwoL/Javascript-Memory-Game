console.log("coucou");

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
    "lemon"
  ];
  let pair = [];
  let score = 0;

  const bar = document.querySelector(".bar");
  let elaspedTime = 0;
  const totalDurationInSec = 10;

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
    const allCards = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
    const suffledCards = shuffle(allCards);
    console.log(suffledCards);

    const shuffleCardsRowOne = suffledCards.slice(0, 7);
    console.log("shuffleCardsRowOne", shuffleCardsRowOne);

    const rowOne = createRow({
      ids: shuffleCardsRowOne,
      rowId: "row-one"
    });
    console.log("rowOne", rowOne);

    const shuffleCardsRowTwo = suffledCards.slice(7);
    console.log("shuffleCardsRowTwo", shuffleCardsRowTwo);

    const rowTwo = createRow({
      ids: shuffleCardsRowTwo,
      rowId: "row-two"
    });
    console.log("rowTwo", rowTwo);

    game.innerHTML = `${rowOne} ${rowTwo}`;

    listenToClickAndReturnCSSclasses();

    startTimer();
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
    // startPairing(c.children[0]);
  }

  function clickBackCardHandler(card) {
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
        }, 1000);
      }
    }
  }

  function handleSuccess() {
    score = score + 1;
    console.log("score", score);
    pair[0].removeEventListener("click", clickHandler);
    pair[0].classList.add("disabledcard");
    pair[1].classList.add("disabledcard");
    pair = [];
  }

  function startTimer() {
    const id = setInterval(() => {
      elaspedTime = elaspedTime + 1;
      const currentWidth = (elaspedTime * 100) / totalDurationInSec;
      bar.style.width = currentWidth + "%";
      if (currentWidth >= 100) {
        clearInterval(id);
      }
    }, 1000);
  }

  resetGame();
})();
