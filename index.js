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

    const rowOne = createRow({ ids: shuffleCardsRowOne, rowId: "row-one" });
    console.log("rowOne", rowOne);

    const shuffleCardsRowTwo = suffledCards.slice(7);
    console.log("shuffleCardsRowTwo", shuffleCardsRowTwo);

    const rowTwo = createRow({ ids: shuffleCardsRowTwo, rowId: "row-two" });
    console.log("rowTwo", rowTwo);

    game.innerHTML = `${rowOne} ${rowTwo}`;
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

  resetGame();
})();
