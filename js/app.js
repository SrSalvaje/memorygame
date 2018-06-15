
//access the DOM Elements and declares the variables

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
let getCards=useDeck.getElementsByClassName("card");
let openedCards=[ //array to check for match
]
let matchedCards=[ //array to store matched cards
]

/*
Functions 
*/ 

/*
this section builds a random deck when page loads and when repeat is clciked
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
this section deals with flipping cards
*/
function flipCards(e) { //function called from the event listener, it uses the event object to leverage event delegation
    if (e.target !== e.currentTarget && openedCards.length<2) { //first condition keeps the event from being trigered by parent element (ul) second one keeps user from turning more than 2 cards
        let clickedItem = e.target; //gets the event target
        openShow(clickedItem); //flips card
        pushToArray(clickedItem); //pushes to the array used to check for match
        if(openedCards.length==2){
            checkMatch(); // check if its a match, if it is, send cards to a new array             
            timeOut();
            clearArray(); 
        }
    }else if(openedCards.length==2 && e.target !== e.currentTarget){
        closeCards();
        openShow(clickedItem);
    }
    e.stopPropagation(); //keeps the event from propagating (bubling) past the clicked item
}


function timeOut(){
    setTimeout(function(){// wait 1 sec and then clear the cards (consider decreasing time)
    closeCards()}, 1000);
}

function openShow(clickedItem){ //adds/removes the open and show classes
    clickedItem.classList.toggle("open");
    clickedItem.classList.toggle("show");
    clickedItem.classList.toggle("stopClick");
}
function pushToArray(clickedItem){ //it adds opened cards to an empty array
    if(clickedItem.getAttribute("class")=="card open show stopClick"){ 
        openedCards.push(clickedItem); //pushes to given array array
    }   
}
/*
checks for match
*/

function checkMatch(){ //checks the array that holds the opened cards for a match
    let cardOne=openedCards[0].firstChild.nextSibling.getAttribute("class"); //gets the class of the i elelements present in the openedCards array
    let cardTwo=openedCards[1].firstChild.nextSibling.getAttribute("class");
    if(cardOne==cardTwo){ //checks if they have the same class
        for(let i=0;i<openedCards.length;i++){ //if they do, it adds the match class
            openedCards[i].classList.toggle("match");
            matchedCards.push(openedCards[i]); //pushes the cards to an array with matched cards
        }
    }
}

function clearArray(){
    openedCards.splice(0,2); //clears the array
}

function closeCards(){
    for(let i=0;i<openedCards.length;i++){ //if they don't it removes the open and show classes
        openedCards[i].classList.toggle("open");
        openedCards[i].classList.toggle("show");
        openedCards[i].classList.toggle("stopClick");
    }
}
/*
 event listeners
*/
//event listener for cards
useDeck.addEventListener("click", flipCards, false);
// builds deck on page load
document.onload = buildDeck(); 
// builds deck when repeat is clicked
repeat.addEventListener("click", function(){
    buildDeck();
});

/*To Do:
 *
 * 
 *  
 *    + increment the move counter and display it on the page 
 *    + if all cards have matched, display a message with the final score 
 *    + make responsive
 *    + add flipping animations
 *    + add a timer
 *    
 */
