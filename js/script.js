//Create global variables to select elements to work with
const guessedLettersElement = document.querySelector(".guessed-letters");
const guessLetterButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuessesElement = document.querySelector(".remaining");
const remainingGuessesSpan = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");

let word = "magnolia"; //change from const to let to update word from list
let guessedLetters = []; //This array will contain all the letters the player guesses. 
let remainingGuesses = 8;


const getWord = async function () { 
    const response = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    const words = await response.text(); //instead of json, using a text file
    const wordArray = words.split("\n");
    //console.log(wordArray);
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim(); //no blank spaces
    placeHolder(word);
};

//make the game start
getWord();

//Function to Add Placeholders for Each Letter
//create a funcion to update the paragraphs innerText
//for the word-in-progress element with the ● symbol
const placeHolder = function (word) { 
    //create empty array
    const placeholderLetters = [];
    
    //for each letter of the word parameter  
    //push a ● into the placeholderLetters array
    for (const letter of word) { 
        //console.log(letter);
        placeholderLetters.push("●");
    };

    //set the innerText of the word-in-progress element
    //then use join to create a string to concatenate
    //all the elements of the array. 
    wordInProgress.innerText = placeholderLetters.join("");
    
};

//placeHolder(word); 

//Add Event Listener for the Button
guessLetterButton.addEventListener("click", function (e) {
    //Because working with a form, this prevents default behavior 
    //of clicking a button, the form submitting and reloading the page
    e.preventDefault();
    //empty message text
    message.innerText = "";

    //variable to catch the value of the guessed letter
    const guess = letterInput.value;
//here
const goodGuess = validateInput(guess);

    //check to see if it logged your guess
    //console.log(guess);
    if (goodGuess) { 
        //This is a letter, let's guess!
        makeGuess(guess);
    }
    //empty the box where the letter is guessed
    letterInput.value = "";


});

//Function to validate the player's input
const validateInput = function (input) { 
    //variable for the accepted letter sequence
    //this reg expression ensures player inputs a letter
    const acceptedLetter = /[a-zA-Z]/;

    //create conditional block to check for diff scenarios.
     //then check if they entered a letter that doesn't match the 
    //regular expresson pattern. use .match() method.
    //Each condition should have its own message about what player
    //should input.
    
    
    if (input.length === 0) { //is input empty? 
        message.innerText = "Please enter a single letter.";
    } else if (input.length > 1) { //is input more than one letter? 
        message.innerText = "Please enter only one letter.";
    } else if (!input.match(acceptedLetter)) { //does letter not match reg expression. Checking for other charctiers outside of a-zA-z 
        message.innerText = "Please enter a letter from A to Z.";
    } else { 
        //if all other conditions arne't met, then it's a letter 
        //return the input
        return input;
    }
};

const makeGuess = function (guess) { 
    guess = guess.toUpperCase();
    //if they have guessed letter, update message
    //if not, add to the guessedLetters array
    if (guessedLetters.includes(guess)) {
        message.innerText = "You have guessed that letter, try again!";
    } else { 
        //push the guess onto the array
        guessedLetters.push(guess);
        //call function to show the letter when it has not
        //been guessed before
        updateGuessesRemaining(guess);
        showGuessedLetters();
        updateWordInProgress(guessedLetters);
    }
};

const showGuessedLetters = function () {
    // Clear the list first
    guessedLettersElement.innerHTML = "";
    for (const letter of guessedLetters) {
      const li = document.createElement("li");
      li.innerText = letter;
      guessedLettersElement.append(li);
    }
};
  

//This function will replace the circle symbols 
//with the correct letters guessed.
const updateWordInProgress = function (guessedLetters) { 
    const wordUpper = word.toUpperCase();
    //split the word string into an array so that
    //the letter can appear in the guessedLetters array
    const wordArray = wordUpper.split("");
    //console.log(wordArray);

    //check if wordArray has any of the letters from guessedLetters
    //if so update the circle symbol with the correct letter
    //create new array with updated characters and then use join()
    //to update the empty paragraph where the word in progress is
    const revealWord = [];
    for (const letter of wordArray) { 
        if (guessedLetters.includes(letter)) {
            revealWord.push(letter.toUpperCase());
        } else { 
            revealWord.push("●");
        }
    }
    wordInProgress.innerText = revealWord.join("");
    checkIfWon();
};



//Count guesses remaining
const updateGuessesRemaining = function (guess) {
    const upperWord = word.toUpperCase();
    if (!upperWord.includes(guess)) {
      // womp womp - bad guess, lose a chance
      message.innerText = `Sorry, the word has no ${guess}.`;
      remainingGuesses -= 1;
    } else {
      message.innerText = `Good guess! The word has the letter ${guess}.`;
    }
  
    if (remainingGuesses === 0) {
      message.innerHTML = `Game over. The word was <span class="highlight">${word}</span>.`;
      startOver();
    } else if (remainingGuesses === 1) {
      remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
    } else {
      remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
    }
  };



//see if player won
const checkIfWon = function () { 
    //verify if word in progress matches the word they should guess
    //if player won, add "win" class to empty paragraph where the 
    //messages appear.
    if (word.toUpperCase() === wordInProgress.innerText) { 
        message.classList.add("win");
        message.innerHTML = `<p class="highlight">You guessed the correct word! Congrats!</p>`;
    
        startOver();
    }
};

const startOver = function () {
    guessLetterButton.classList.add("hide");
    remainingGuessesElement.classList.add("hide");
    guessedLettersElement.classList.add("hide");
    playAgainButton.classList.remove("hide");

};

    playAgainButton.addEventListener("click", function () {
        //reset everything and get a new word
        message.classList.remove("win");
        guessedLetters = [];
        remainingGuesses = 8;
        remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
        guessedLettersElement.innerHTML = "";
        message.innerText = "";
        //get a new word
        getWord();

        //show the right UI elements
        guessLetterButton.classList.remove("hide");
        playAgainButton.classList.add("hide");
        remainingGuessesElement.classList.remove("hide");
        guessedLettersElement.classList.remove("hide");
    
    
});