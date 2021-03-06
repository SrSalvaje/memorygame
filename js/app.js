
//access the DOM Elements and declares the variables

const cardSymbols = [ //holds cards symbols (remember index is 0 to 15)
    "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor","fa fa-bolt",
    "fa fa-cube", "fa fa-anchor", "fa fa-leaf", "fa fa-bicycle",
    "fa fa-diamond", "fa fa-bomb", "fa fa-leaf", "fa fa-bomb",
    "fa fa-bolt", "fa fa-bicycle", "fa fa-paper-plane-o", "fa fa-cube",
];
const getDeck = document.getElementsByClassName("deck"); //gets a NodeList with the ul element
const useDeck = getDeck[0]; // access the ul from the NodeList
const getListItems = useDeck.getElementsByTagName("i"); //gets  the card symbols from the ul element
const repeat = document.querySelector(".fa-repeat"); // gets the repeat icon
const openedCards=[]; //array to check for match
const matchedCards=[]; //array to store matched cards
let myTimeOut; //assigened by timeOut() line 127
let counter=0;//stores mouse clicks on cards 
const moveC= document.querySelector(".moves"); //used to update the move counter html 
const modal = document.querySelector(".modal");//used to apply the class the makes the modal window visble
const closeButton = document.querySelector(".close-modal");
const tMinutes= document.querySelector(".minutes");//updates the minutes counter html
const tSeconds=document.querySelector(".seconds");
let minTimer=0;//keeps track of minutes
let secTimer=0;//keeps track of seconds
let secInterval;//sotres the interval function used for timer
const stars=document.querySelectorAll(".fa-star");//used to acces the stars
const starOne=stars[0];
const starTwo=stars[1];
const starThree=stars[2];
const starsScore = document.querySelector(".stars-score");//to update the modal window html
const minComplete= document.querySelector(".min-complete");
const secComplete= document.querySelector(".sec-complete");
const playAgain = document.querySelector(".play-again");

/*
*Functions 
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
*this section deals with the restart button
*/
//function called when restart is clicked
function restart(){ 
    stopGameTimer();//stops game timer (see line 242)
    clearScore(); //clear all the score and time counters (line 80)
    if(matchedCards.length>0){
        resetCards(matchedCards);//resets the matchedCards[](line 94)
    }
    if(openedCards.length>0){
        resetCards(openedCards);// resets the openedCards[](line 94)
    }
    buildDeck(); //builds the deck (line 56)
}
//clears score and timer
function clearScore(){//called by restart() line 68
    minTimer=0;
    secTimer=0;
    counter=0;
    tMinutes.innerHTML="00";
    tSeconds.innerHTML="00";
    moveC.innerHTML=0;
    for(let i=0; i<stars.length;i++){
        if(stars[i].getAttribute("class")=="fa fa-star"){
            stars[i].classList.toggle("starsOn");
        }
    }
}
//splices the given array b
function resetCards(array){ //called by restart() line 68
    closeCards(array); //see line 167
    clearArray(array, array.length); //see line 163
}
/*
this section deals with flipping cards
*/
//function called from the event listener, it uses the event object to leverage event delegation
function flipCards(e) { 
    if(counter==0){
        gameTimer();//starts the game timer (line 218)
    } 
    if (e.target !== e.currentTarget && openedCards.length<2) { //first condition keeps the event from being trigered by parent element (ul) second one keeps user from turning more than 2 cards
        let clickedItem = e.target; //gets the event target
        openShow(clickedItem); //flips cards (line 137)
        pushToArray(clickedItem); //pushes to the array used to check for match (line 145)
        if(openedCards.length==2){
            checkMatch(); // check if its a match, if it is, send cards to a new array (line 151)           
            timeOut(); //sets a 1000 mms timer to close opened cards (line 125)
            return timeOut; //returns setTimeout() to be able to use clearTimeOut()
        }
    }else if(openedCards.length==2 && e.target !== e.currentTarget){
        stopTimeout(); //clears the timeout (line 133)
        closeCards(openedCards); //closes the opened cards (line 167)
        clearArray(openedCards, openedCards.length);//clears the opened cards array (line 163)
        openShow(e.target);//opens the clicked card (line 137)
        pushToArray(e.target);//pushes the clicked card to the openedCards[](line 145)
    }
    e.stopPropagation(); //keeps the event from propagating (bubling) past the clicked item
}
// waits .5 sec and then clear the cards
function timeOut(){
    myTimeOut = setTimeout(function(){
        closeCards(openedCards);//(line 167)
        clearArray(openedCards, openedCards.length);
    }, 500);//(line 163)
    return myTimeOut;
}
//stops the timeout
function stopTimeout(){
    clearTimeout(myTimeOut);
}
//opens cards
function openShow(clickedItem){ //adds/removes the open and show classes, called by flipCards line 102
    counter++;
    clickedItem.classList.toggle("open");
    clickedItem.classList.toggle("show");
    clickedItem.classList.toggle("stop-click");
    moveC.innerHTML=counter;
}
// pushes opened card to array
function pushToArray(clickedItem){ //it adds opened cards to an empty array, called by flipCards line 102
    if(clickedItem.getAttribute("class")=="card open show stop-click"){ 
        openedCards.push(clickedItem); //pushes to given array array
    }   
}
//checks for match
function checkMatch(){ //checks the array that holds the opened cards for a match, called by flipCards line 102
    let cardOne=openedCards[0].children[0].getAttribute("class"); //gets the class of the i elelements present in the openedCards array
    let cardTwo=openedCards[1].children[0].getAttribute("class");
    if(cardOne==cardTwo){ //checks if they have the same class
        for(let i=0;i<openedCards.length;i++){ //if they do, it adds the match class
            openedCards[i].classList.toggle("match");
            matchedCards.push(openedCards[i]); //pushes the cards to an array with matched cards
        }
        victory(); //asses the victory condition and if they apply it stops timer and calls modal window(line 186)
    }
}
//clears arrays
function clearArray(arrayName, cardsToErase){
    arrayName.splice(0, cardsToErase); //clears the array
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
            arrayName[i].classList.toggle("stop-click");
        }
    }
}
/*
*this sections deals with the modal window
*/
//toggles the class that appluies the modal window style
function toggleModal() { 
    modal.classList.toggle("show-modal");

}
/*
*this section deals with the victorry coinditions
*/

//called by checkmatch() (declared in line 153, called by flipCards() in 114) to check if all cards have been matched
function victory(){
    if(matchedCards.length==16){ //checks if all cards have been matched
        stopGameTimer(); //stops timer (line 223)
        showScore();//adds score to modal window (line 198)
        toggleModal();//launches modal window (line 178)
    }
}
// displays the score and time on modal window
function showScore(){
    starsScore.innerHTML=`${starOne.outerHTML} ${starTwo.outerHTML} ${starThree.outerHTML}`;
    minComplete.innerHTML=`${tMinutes.innerHTML}`;
    secComplete.innerHTML=`${tSeconds.innerHTML}`;
} 
/*
*this section deals with the play again button
*/
// closes the modal window()(see event listener in line 260) and calls restart()(line 71)
function replay(){
    toggleModal();
    restart();
}
/*
*this section deals with the timer and stars score
*/
//sets game timer (called by flipCards() in line 107)
function gameTimer(){
    secInterval=setInterval(function(){ //stores the setinterval value to use it for clearInterval
        secTimer++;//increments the counter by 1
        if(secTimer<=9){
            tSeconds.innerHTML=`0${secTimer}`;//updates the time html with the current value of secTimer + a 0
        }else{
            tSeconds.innerHTML=secTimer; // if the secs are > than 9 no 0 to the left is needed
        }
        if(secTimer==31 && minTimer==0){
            starThree.classList.toggle("starsOn"); //at 31 secs the first star turns off
        }else if(secTimer==45 && minTimer==0){ //at 45 secs the second star turns off
            starTwo.classList.toggle("starsOn");
        }else if(secTimer==59){ //resets seconds and adds 1 to minutes
            secTimer=0; // seconds counter is reseted
            tSeconds.innerHTML=`0${secTimer}`; //modifies rhe HTML
            minTimer++;//increments the minute counter
            tMinutes.innerHTML=`0${minTimer}`; //modifies the html
        }
    }, 1000);//the code repeats every second
}

function stopGameTimer(){
    clearInterval(secInterval); //it stops the interval
}

/*
 *event listeners
*/

// for cards
useDeck.addEventListener("click", flipCards, false);
// builds deck on page load
document.onload = buildDeck(); 
// builds deck when repeat is clicked
repeat.addEventListener("click", function(){
    restart();
});
//restarts game from modal window
playAgain.addEventListener("click", function(){
    replay();
});
//closes the modal window when the close button is clicked
closeButton.addEventListener("click", toggleModal);