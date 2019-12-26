console.log("coucou");

// IIFE to avoid  creating global variables
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
  const allCards = [];
  let pair = [];
  let score = 0;

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
  }

  function createRow(config) {
    const { ids, rowId } = config;
    let row = [`<div class="row" id="${rowId}">`];
    ids.map((cardId, idx) => {
      row = [
        ...row,
        `<div class="card" data-id="${idx + 1}">
            <div class="front ${allFruits[cardId]}"></div>
            </div>`
      ];
    });
    row = [...row, "</div>"];
    return row.join("");
  }

  function listenToClickAndReturnCSSclasses() {
    // We need to cast the retrieved array like in order for it to become a real array
    let allCardsElements = Array.from(document.querySelectorAll(".card"));
    // on click, it should return 'front apricot' or 'front lemon' etc...
    allCardsElements.map(c =>
      c.children[0].addEventListener("click", () => {
        const cssClassesOnCard = c.children[0].classList.value;
        console.log("cssClassesOnCard", cssClassesOnCard);
        startPairing(c.children[0]);
      })
    );
  }

  function startPairing(card) {
    pair = [...pair, card];
    if (pair.length === 2) {
      if (pair[0].classList.value === pair[1].classList.value) {
        handleSuccess();
      } else {
        pair = [];
      }
    }
  }

  function handleSuccess() {
    score = score + 1;
    console.log("score", score);
    pair = [];
  }

  resetGame();
})();

//// [-] TODO / DONE [x]

// [x] handle click on a card

// [x] after one card has been clicked, second card clicked will become a pair

// [x] if pair contains two cards with same id: its a win

// [-] if its a win replace card of the pair by empty card

// [-] make sure empty cards don't handle click event
