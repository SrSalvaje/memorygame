
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
let myTimeOut;
let counter=0;
let moveC= document.querySelector(".moves");
let modal = document.querySelector(".modal");
let closeButton = document.querySelector(".close-modal");
let tMinutes= document.querySelector(".minutes");
let tSeconds=document.querySelector(".seconds");
let minTimer=0;
let secTimer=0;
let secInterval;
let stars=document.querySelectorAll(".fa-star");
let starOne=stars[0];
let starTwo=stars[1];
let starThree=stars[2];
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
    if(matchedCards.length>0){
        closeCards(matchedCards);
        clearArray(matchedCards);
    } else if(openedCards.length>0){
        stopTimeout(myTimeOut);
        closeCards(openedCards);
        clearArray(openedCards);
    }
    for (let i = 0; i<cardSymbols.length; i++){ //iterates through the 16 symbols held in the array
        let modifyListItem = getListItems[i]; //takes one i element based on index
        modifyListItem.className = symbolsShuffle[i]; //changes the class of the i element to one taken from the shuffled array
    }
    moveC.innerHTML=0; //Resets counter
    counter=0;
}
/*
this section deals with flipping cards
*/
function flipCards(e) { //function called from the event listener, it uses the event object to leverage event delegation
    if(counter==0){
        gameTimer();
    }; 
    if (e.target !== e.currentTarget && openedCards.length<2) { //first condition keeps the event from being trigered by parent element (ul) second one keeps user from turning more than 2 cards
        let clickedItem = e.target; //gets the event target
        openShow(clickedItem); //flips card
        pushToArray(clickedItem); //pushes to the array used to check for match
        if(openedCards.length==2){
            checkMatch(); // check if its a match, if it is, send cards to a new array             
            timeOut(); //sets a 1000 mms timer to close opened cards
            return timeOut; //returns setTimeout() to be able to use clearTimeOut()
        }
    }else if(openedCards.length==2 && e.target !== e.currentTarget){
        stopTimeout(); //clears the timeout
        closeCards(openedCards); //closes the opened cards
        clearArray(openedCards);//clears the opened cards arra//
        openShow(e.target);//opens the clicked card
        pushToArray(e.target);//pushes the clicked card to the openedCards[]
    }
    e.stopPropagation(); //keeps the event from propagating (bubling) past the clicked item
}
// wait 1 sec and then clear the cards (consider decreasing time)
function timeOut(){
    myTimeOut = setTimeout(function(){
        closeCards(openedCards)
        clearArray(openedCards)}, 1000);
    return myTimeOut;
}
//stops the timeout
function stopTimeout(){
    clearTimeout(myTimeOut)
}
//opens cards
function openShow(clickedItem){ //adds/removes the open and show classes
    counter++;
    clickedItem.classList.toggle("open");
    clickedItem.classList.toggle("show");
    clickedItem.classList.toggle("stopClick");
    moveC.innerHTML=counter;
}
// pushes opend card to array
function pushToArray(clickedItem){ //it adds opened cards to an empty array
    if(clickedItem.getAttribute("class")=="card open show stopClick"){ 
        openedCards.push(clickedItem); //pushes to given array array
    }   
}
//checks for match
function checkMatch(){ //checks the array that holds the opened cards for a match
    let cardOne=openedCards[0].firstChild.nextSibling.getAttribute("class"); //gets the class of the i elelements present in the openedCards array
    let cardTwo=openedCards[1].firstChild.nextSibling.getAttribute("class");
    if(cardOne==cardTwo){ //checks if they have the same class
        for(let i=0;i<openedCards.length;i++){ //if they do, it adds the match class
            openedCards[i].classList.toggle("match");
            matchedCards.push(openedCards[i]); //pushes the cards to an array with matched cards
        }
        victory(); //asses the victory condition and if they apply it stops timer and calls modal window (add here the code to update modal window with score)
    }
}
//clears the array
function clearArray(arrayName){
    arrayName.splice(0,2); //clears the array
}
//closes cards
function closeCards(arrayName){
    if(arrayName[0].getAttribute("class")=="card match"){ //checks if its being used for the matched cards array
        for(let i=0;i<arrayName.length;i++){ //if it is, it removes the match class
            arrayName[i].classList.toggle("match");
        }
    }else{//if its not being used for matched cards then its being used for the opened cards array
        for(let i=0;i<arrayName.length;i++){ //if they don't it removes the open and show classes
            arrayName[i].classList.toggle("open");
            arrayName[i].classList.toggle("show");
            arrayName[i].classList.toggle("stopClick");
        }
    }
}
/*
*this sections deals with the modal window
*/
function toggleModal() { //toggles the class that appluies the modal window style
    modal.classList.toggle("show-modal");

}
/*
*this section deals with the victorry coinditions
*/

function victory(){
    if(matchedCards.length==16){ //checks if all cards have been matched
        stopGameTimer(); //stops timer
        showScore();
        toggleModal()//launches modal window
    }
}
let scores = document.querySelector(".score-panel");
let modalContent = document.querySelector(".modal-text");
function showScore(){
    modalContent.innerHTML=`Your rating is ${document.querySelector(".score-panel").outerHTML}`;
} 
/*
*this section deals with the timer and stars score
*/
function gameTimer(){
    secInterval=setInterval(function(){ //stores the setinterval value to use it for clearInterval
        secTimer++;//increments the counter by 1
        if(secTimer<9){
            tSeconds.innerHTML=`0${secTimer}`;//updates the time html with the current value of secTimer
        }else{
            tSeconds.innerHTML=secTimer;
        }
        if(secTimer==31){
            starThree.classList.toggle("starsOn");
        }else if(secTimer==45){
            starTwo.classList.toggle("starsOn");
        }else if(secTimer==59){ //if the seconds reach 59
            secTimer=0; //it resets the seconds counter
            tSeconds.innerHTML=secTimer; //modifies rhe HTML
            minTimer++;//increments the minute counter
            tMinutes.innerHTML=`0${minTimer}`; //modifies the html
            starOne.classList.toggle("starsOn"); 
        }
    }, 1000);//the code repeats every second
}

function stopGameTimer(){
    clearInterval(secInterval); //it stops the interval
}
/*
*this section deals with stars
*/
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
//closes the modal window when the close button is clicked
closeButton.addEventListener("click", toggleModal);
/*To Do:
 *
 * 
 *  
 *  
 *    + sort out star rating
 *    + add flipping animations
 *   
 *    +write code to update modal window with score 
 *    + make responsive
 *    
 *    
 */
