console.log("coucou");

// IIFE to avoid  creating global variables
(function() {
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
    const allCards = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
    const suffledCards = shuffle(allCards);
    console.log(suffledCards);
  }
  resetGame();
})();
