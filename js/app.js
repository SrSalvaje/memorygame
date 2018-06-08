/*
*
*
this section builds a random deck when page loads and when repeat is clciked
*
*
*/ 

//access the DOM Elements and declares the variables needed to build deck 
let cardSymbols = [ //holds cards symbols (remember index is 0 to 15)
    "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor","fa fa-bolt",
    "fa fa-cube", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle",
    "fa fa-diamond", "fa fa-bomb", "fa fa-leaf", "fa fa-bomb",
    "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube",
]
let getDeck = document.getElementsByClassName("deck"); //gets a NodeList with the ul element
let useDeck = getDeck[0]; // access the ul from the NodeList
let getListItems = useDeck.getElementsByTagName("i"); //gets  the card symbols from the ul element
let repeat = document.querySelector(".fa-repeat"); // gets the repeat icon

/*
*functions
*
*/
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// builds a random card deck
function buildDeck(){
    let symbolsShuffle = shuffle(cardSymbols); // shuffles symbol list
    for (let i = 0; i<cardSymbols.length; i++){ //iterates through the 16 symbols held in the array
        let modifyListItem = getListItems[i]; //takes one i element based on index
        modifyListItem.className = symbolsShuffle[i]; //changes the class of the i element to one taken from the shuffled array
    }
}
/*
*
event listeners
*
*/
// builds deck on page load
document.onload = buildDeck(); 
// builds deck when repeat is clicked
repeat.addEventListener("click", function(){
    buildDeck();
});

/*
*
*
this section deals with flipping cards
*
*
*/

//variables and DOM elements


let getCards=useDeck.getElementsByClassName("card");

//functions

function openShow(){
    for(let i=0; i<getCards.length; i++){
        getCards[i].addEventListener("click", function(){
            this.classList.toggle("open");
            this.classList.toggle("show");
        });
    }
}
this.onclick=openShow();











/*
 * set up the event listener for a card. If a card is clicked:
 * 
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
