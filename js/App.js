//Bhavesh Gupta PG10. Battleships game.
'use strict';
const MAX_ROWS = 10;
const MAX_COLS = 10;


let matrix;
let fleet;
let shotsLeft = 0;
let score = 0;
var mySound = new buzz.sound("songs/BackgorundMusic.wav");
var Losing = new buzz.sound("songs/LosingSong.wav");
var Win = new buzz.sound("songs/VictorySong.wav");

// making class app to handle the entire app.
class App{

  constructor(){
    // when an app object is created then setupStartPage method is called.
    this.setupStartPage();
  }
  //setupStartPage: this method is used to add functionality to "single" and "instructions"
  // options on the start page. "single" unhides the game page and hides the startpage.
  setupStartPage(){
    //creating a variable for start song using buzz.js
    var  menusong= new buzz.sound("songs/menusong.wav");
    //playing the start song.
    menusong.play();
    //selecting the id single to add a click event to it.
    document.querySelector("#single")
      .addEventListener('click', (event) => {
        //hide startPage div and unhide game div.
        document.querySelector(".startPage").classList.add("hide");
        document.querySelector(".game").classList.remove("hide");
        //calling the startGame function to start the game.
        this.startGame();
        menusong.stop();
      });
      //selecting the instructions id to add a click event to it.
      document.querySelector("#instructions")
        .addEventListener('click', (event) => {
          //unhide the instruction div.
          document.querySelector(".Instruction").classList.remove("hide");
        });
        //adding click event to the id goback
      document.querySelector(".goback").addEventListener('click', (event)=>{
        //hide the instruction div
        document.querySelector(".Instruction").classList.add("hide");
      })
  }

//function that constructs the matrix, places the ships and is responsible for
//the game functionality.
  startGame(){
    //play the game mode song.
    mySound.play();
    mySound.loop();
    // Initialize the data
    matrix = this.matrixCons(10,10);
    fleet =[5,4,4,3,2];
    score = 0;
    shotsLeft = 40;
    document.querySelector("#scoreCount").innerHTML = 0;
    document.querySelector("#shotsLeft").innerHTML = 40;
    for (let i = 0; i < fleet.length ; i++){
      this.changeSkullFlex(i);
    }
    //place the ships in the matrix
    matrix = this.placeShips(matrix, fleet);
    // initialize screen
    this.initScreen();
    //setup handlers
    this.setupHandlers();
  }
  matrixCons(m, n) {
    let matrix = [];
    for(let i = 0; i<m ; i++ ){
    matrix[i] = [];
    for(let j = 0; j<n; j++){
      matrix[i][j] = -1;
      }
    }
    return matrix;
  }

  //place ships on the grid.
  placeShips(matrix, fleet){
    //for each of the ships
    for(let i = 0 ; i< fleet.length; i++){
      //let shipplaced = false
      let shipPlaced = 0;
      //while shipplaced = false
      while(shipPlaced === 0){
        let vh =  this.getRandomIntInclusive(0,1);
        //if horizontal:
        if(vh === 1){
          //generate a random no. (0-10-shipsize) for cols and generate a random no.(0-9) for rows.
          let col = this.getRandomIntInclusive(0, 10-fleet[i]);
          let row = this.getRandomIntInclusive(0, 9);
          //checkShipPlacementHorizontal i.e. check if the ship can be placed on that spot horizontally.
          //if true place the ship
          if(this.checkShipPlacementHorizontal(row, col, matrix, fleet[i])){
            for(let k= 0; k< fleet[i] ; k++){
              matrix[row][col+k] = i;
            }
            //shipplaced = true
            shipPlaced= 1;
          }
        }
        // else if vertical:
        else if(vh === 0){
          //generate a random no. (0-10-shipsize) for rows and generate a random no.(0-9) for cols.
          let row = this.getRandomIntInclusive(0, 10-fleet[i]);
          let col = this.getRandomIntInclusive(0, 9);
          //checkShipPlacementVertical i.e. check if the ship can be placed vertically at that spot.
          // if true place the ship
          if(this.checkShipPlacementVertical(row, col, matrix, fleet[i])){
            for(let k= 0; k< fleet[i] ; k++){
              matrix[row+k][col] = i;
            }
            shipPlaced= 1;
          }
        }
      }
    }
    return matrix;
  }
  //reset the skulls by changing their class from sink back to normal
  changeSkullFlex(index){
    for(let i = 0; i<fleet[index] ; i++){
      document.body.querySelectorAll(`.skullflexSink${index}`).forEach( (e) => {
        e.classList.add(`skullflex${index}`);
        e.classList.remove(`skullflexSink${index}`);
      });
    }
  }

  //creating a table
  initScreen(){
    let gameAreaMarkup = '<table id = "board">';
    for(let r = 0 ; r < MAX_ROWS; r++){
      gameAreaMarkup += '<tr>';
      for (let c = 0; c < MAX_COLS; c++){
        gameAreaMarkup+= `<td class ="cell" data-row= " ${r}" data-col ="${c}"></td>`
      }
      gameAreaMarkup += '</tr>';
    }
    gameAreaMarkup += '</table>';
    //adding td stuff to the div of gridgame flextimes class using innerHTML.
    document.querySelector(".gridgame.flexitems").innerHTML = gameAreaMarkup;
  }

  //setupHandlers handles the game.
  setupHandlers(){
    //adding click event to the board class.
    document.querySelector("#board")
      .addEventListener('click', (event) => {
        // get the target of this event
        //if your event target becomes the table then what?
        let theCellEl = event.target;
        let Hit = new buzz.sound("soundeffects/Shot.wav");
        let Miss = new buzz.sound("soundeffects/Miss.wav");
        let Sink = new buzz.sound("soundeffects/Sink.wav");
        //if the target node is a td, then only save the position of that cell.
        //this way you wouldn't be able to click the borders of the table n stuff.
        if(event.target.nodeName == "TD"){
          //get the data-row and data-col from this cell
          let pos = {
            r: theCellEl.getAttribute('data-row'),
            c: theCellEl.getAttribute('data-col')
          };
          //pos above would be string and youd want to figure out how to convert this to a number.
          //lookup the r, c in the map to see if there is a ship there
          pos.r= parseInt(pos.r, 10);
          pos.c = parseInt(pos.c,10);

          //for the skulls to change when the player hits an aircraft carrier with value 5:
          if(matrix[pos.r][pos.c]=== 0){
            //if the position has 0(0 val for ship with val 5) in it mark it with -2.
            matrix[pos.r][pos.c]=-2;
            //increment score by 1
            score +=1;
            //decrement the score by 1
            shotsLeft-=1;
            //change the classname for the cell to show show explosion on a hit!
            theCellEl.className = "newCellHit";
            //substract 1 from the fleet array for the first ship
            fleet[0]-=1 ;
            //when the val for that ship becomes 0 in the fleet array then sink the ship by changing the skull row for that ship
            if(fleet[0]===0){
              Sink.play();
              document.body.querySelectorAll(".skullflex0").forEach( (e) => {
                e.classList.remove("skullflex0");
                e.classList.add("skullflexSink0");
              });
            }
            else{
              Hit.play();
            }
          }
          //for the skulls to change when the player hits a ship with value 4:
          else if(matrix[pos.r][pos.c]=== 1){
            //increment score by 1
            score +=1;
            //decrement the score by 1
            shotsLeft-=1;
            //if the position has 1(1 index for ship with val 4) in it mark it with -2.
            matrix[pos.r][pos.c]=-2;
            //change the classname for the cell to show show explosion on a hit!
            theCellEl.className = "newCellHit";
            //substract 1 from the fleet array for the second ship
            fleet[1]-=1 ;
            //when the val for that ship becomes 0 in the fleet array then sink the ship by changing the skull row for that ship
            if(fleet[1]===0){
              Sink.play();
              document.body.querySelectorAll(".skullflex1").forEach( (e) => {
                e.classList.remove("skullflex1");
                e.classList.add("skullflexSink1");
              });
            }
            else{
              Hit.play();
            }
          }
          //for the skulls to change when the player hits a ship with value 4:
          else if(matrix[pos.r][pos.c]=== 2){
            score +=1;
            shotsLeft-=1;
            matrix[pos.r][pos.c]=-2;
            theCellEl.className = "newCellHit";
            fleet[2]-=1 ;
            if(fleet[2]===0){
              Sink.play();
              document.body.querySelectorAll(".skullflex2").forEach( (e) => {
                e.classList.remove("skullflex2");
                e.classList.add("skullflexSink2");
              });
            }
            else{
              Hit.play();

            }
          }
          //for the skulls to change when the player hits a ship with value 3:
          else if(matrix[pos.r][pos.c]=== 3){
            score +=1;
            shotsLeft-=1;
            matrix[pos.r][pos.c]=-2;
            theCellEl.className = "newCellHit";
            fleet[3]-=1 ;
            if(fleet[3]===0){
              Sink.play();
              document.body.querySelectorAll(".skullflex3").forEach( (e) => {
                e.classList.remove("skullflex3");
                e.classList.add("skullflexSink3");
              });
            }
            else{
              Hit.play();
            }
          }
          //for the skulls to change when the player hits a ship with value 2:
          else if(matrix[pos.r][pos.c]=== 4){
            score +=1;
            shotsLeft-=1;
            matrix[pos.r][pos.c]=-2;
            theCellEl.className = "newCellHit";
            fleet[4]-=1 ;
            if(fleet[4]===0){
              Sink.play();
              document.body.querySelectorAll(".skullflex4").forEach( (e) => {
                e.classList.remove("skullflex4");
                e.classList.add("skullflexSink4");
              });
            }
            else{
              Hit.play();
            }
          }
          //when the player hits a spot whithout any ship on it. Miss.
          else if(matrix[pos.r][pos.c]=== -1){
            Miss.play();
            theCellEl.className = "newCellMiss";
            shotsLeft-=1;
            matrix[pos.r][pos.c]=-2;
          }
          //display score cound and shots left count.
          document.querySelector("#scoreCount").innerHTML = score;
          document.querySelector("#shotsLeft").innerHTML = shotsLeft;
          //when the player sinks all the ships within the given number of shots then make the player Win!
          if(shotsLeft >= 0 && fleet[0]===0 && fleet[1]===0 && fleet[2]===0 && fleet[3]===0 && fleet[4]===0){
          //remove hide class from the class list of victory class so as to display it on top of the game.
          document.querySelector(".Victory").classList.remove("hide");
          // document.querySelector(".game").classList.add("hide");
          mySound.stop();
          Win.play();
          Win.loop();
          //click on play again button to start the game again and the cancel button to return to the start page.
          document.querySelector("#playagain")
            .addEventListener('click', (event) => {
              document.querySelector(".Victory").classList.add("hide");
              // document.querySelector(".game").classList.remove("hide");
              this.startGame();
              Win.stop();
              });
          document.querySelector("#cancel")
                .addEventListener('click', (event) => {
                  document.querySelector(".Victory").classList.add("hide");
                  document.querySelector(".game").classList.add("hide");
                  document.querySelector(".startPage").classList.remove("hide");
                  this.setupStartPage();
                  Win.stop();
                  });
          }
          //when the player is not able to sink all the ships within the givin number of shots then
          if(shotsLeft === 0 && fleet[0]>=0 && fleet[1]>=0 && fleet[2]>=0 && fleet[3]>=0 && fleet[4]>=0){
          document.querySelector(".Defeat").classList.remove("hide");
          // document.querySelector(".game").classList.add("hide");
          mySound.stop();
          Losing.play();
          Losing.loop();
          //click try again to start playing the game again.
          document.querySelector("#tryagain")
            .addEventListener('click', (event) => {
              document.querySelector(".Defeat").classList.add("hide");
              // document.querySelector(".game").classList.remove("hide");
              this.startGame();
              Losing.stop();
              });
          //click cancel button to go to the start page again.
          document.querySelector("#cancel2")
                .addEventListener('click', (event) => {
                  document.querySelector(".Defeat").classList.add("hide");
                  document.querySelector(".game").classList.add("hide");
                  document.querySelector(".startPage").classList.remove("hide");
                  this.setupStartPage();
                  Losing.stop();
                  });
          }
        }

    });
  }

  //function to generate random numbers between min and max values.
  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //function to check if the ships can be placed vertically withe the given postion and ship size.
  checkShipPlacementVertical(row, col, matrix, shipSize){
    //if the position does not have -1 then return false straight away!
    if (matrix[row][col] != -1){
      return false;
    }

    //checking below. if the length of the ship is crossing the border then return false straight away
    if (row+(shipSize)>9){
      return false;
    }
    //if for the length of the ship we encounter a value that is not -1 then we return false and otherwise true.
    for (let i = 0; i<shipSize; i++){
      if(matrix[row+i][col] != -1){
        return false;
      }
    }
      return true;
  }

//function to check if the ships can be placed horizontally with the given postion and ship size.
  checkShipPlacementHorizontal(row, col, matrix, shipSize){
    //if the position does not have -1 then return false straight away!
    if (matrix[row][col] != -1){
      return false;
    }

    //checking right. if the length of the ship is crossing the border then return false straight away
    if (col+(shipSize)>9){
      return false;
    }
    //if for the length of the ship we encounter a value that is not -1 then we return false and otherwise true.
    for (let i = 0; i<shipSize; i++){
      if(matrix[row][col+i] != -1){
        return false;
        }
    }
    return true;
  }


}

let app = new App()
