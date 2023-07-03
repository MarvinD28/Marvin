const startbutton = document.querySelector("#startbutton");
const resetbutton = document.querySelector("#resetbutton");
const playername = document.getElementById('playername');
const name = document.getElementById('name');
let gameBoard = document.querySelector("#gameboard");
const width = 10;
let startBoard = [
  "", "", "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "", "", "",
];
const time = {
    startTime:0,
    elapsedTime:0,
    currentTime:0,
    paused:true,
    intervalId: null,
    hrs:0,
    mins:0,
    secs:0,
    timeDisplay:document.querySelector("#timeDisplay")
}
let executed = 0;
let amountrocks;
let amounttrees;
let zufallszahlrocks = [];
let zufallszahltrees = [];
/*class creature{
    constructor(Image, Element){
        this.Image = Image;
        this.Element = Element;
    }
}
const sheep = new creature("", "");*/
const sheep = {
    sheepImage:"schaf.png",
    sheepImageElement: document.createElement("img")
}
const wolf = {
    wolfImage:"wolf.png",
    wolfImageElement:document.createElement("img")
}
const shepherd = {
    shepherdImage:"shepherd.png",
    shepherdImageElement:document.createElement("img"),
    
}
let shepherdSteps = 0;
const amountrocksInput = document.querySelector("#amountrocks");
const amounttreesInput = document.querySelector("#amounttrees");
window.addEventListener("DOMContentLoaded", () => {
  const initialAmountRocks = parseInt(amountrocksInput.value);
  const initialAmountTrees = parseInt(amounttreesInput.value);
  if (initialAmountRocks > 9 || initialAmountTrees > 9) {
    startbutton.disabled = true;
  }
});
amountrocksInput.addEventListener("input", () => {
  const amountrocks = parseInt(amountrocksInput.value);
  const amounttrees = parseInt(amounttreesInput.value);
  startbutton.disabled = amountrocks > 9 || amounttrees > 9;
});
amounttreesInput.addEventListener("input", () => {
  const amountrocks = parseInt(amountrocksInput.value);
  const amounttrees = parseInt(amounttreesInput.value);
  startbutton.disabled = amountrocks > 9 || amounttrees > 9;
});
startbutton.addEventListener("click", () => {
  if (time.paused) {
    time.paused = false;
    let rootElement = document.querySelector(":root");
    rootElement.style.setProperty("--displaymenu", "none");
    rootElement.style.setProperty("--displaygame", "inline-grid");
    rootElement.style.setProperty("--displaygameboard", "flex");
    rootElement.style.setProperty("--displaylink", "none");
    rootElement.style.setProperty("--displaynametag", "block");
    time.startTime = Date.now() - time.elapsedTime;
    time.intervalId = setInterval(updateTime, 1000);
    amountrocks = document.querySelector("#amountrocks").value;
    amounttrees = document.querySelector("#amounttrees").value;
    name.innerHTML = playername.value;
    createBoard();
  }
});
function createBoard() {
  executed = 0;
  zufallszahlrocks = [];
  zufallszahltrees = [];
  for (let j = 0; j < amountrocks; j++) {
    let randomNumber = generateRandomNumber();
    zufallszahlrocks.push(randomNumber);
  }
  for (let l = 0; l < amounttrees; l++) {
    let randomNumber = generateRandomNumber();
    zufallszahltrees.push(randomNumber);
  }
  gameBoard.innerHTML = "";
  startBoard.forEach((startsquare, i) => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.setAttribute("square-id", i);
    square.style.backgroundImage = "url('ground_gras.png')";
    for (let k = 0; k < amountrocks; k++) {
      if (zufallszahlrocks[k] === i) {
        const rockImage = document.createElement("img");
        rockImage.setAttribute("src", "ground_rock.png");
        rockImage.classList.add("blocking")
        square.appendChild(rockImage);
        break;
      }
    }
    for (let o = 0; o < amounttrees; o++) {
      if (zufallszahltrees[o] === i) {
        const treeImage = document.createElement("img");
        treeImage.setAttribute("src", "ground_tree.png");
        treeImage.classList.add("blocking")
        square.appendChild(treeImage);
        break;
      }
    }
    gameBoard.append(square);
  });
  sheep.sheepImageElement.setAttribute("src", sheep.sheepImage);
  sheep.sheepImageElement.classList.add("blocking")
  gameBoard.appendChild(sheep.sheepImageElement);
  wolf.wolfImageElement.setAttribute("src", wolf.wolfImage);
  wolf.wolfImageElement.classList.add("blocking")
  gameBoard.appendChild(wolf.wolfImageElement);
  shepherd.shepherdImageElement.setAttribute("src", shepherd.shepherdImage);
  shepherd.shepherdImageElement.classList.add("blocking")
  gameBoard.appendChild(shepherd.shepherdImageElement);
  let startingquarter = wolfPosition(wolf.wolfImageElement);
  let sheepquarter = sheepPosition(sheep.sheepImageElement, startingquarter);
  shepherdPosition(shepherd.shepherdImageElement, sheepquarter);
  gameBoard.querySelectorAll(".square").forEach((square) => {
    square.addEventListener("click", () => {
      if (isAdjacent(square, shepherd.shepherdImageElement)) {
        let shepherdSquare = document.querySelector(".shepherd");
        shepherdSquare.classList.remove("shepherd");
        square.classList.add("shepherd");
        square.appendChild(shepherd.shepherdImageElement);
        shepherdSteps++;
        moveSheep(startingquarter, sheepquarter);
        
        moveWolf();
      }
    });
  });
}
function moveWolf() {
    let wolfSquare = document.querySelector(".wolf");
    let sheepSquare = document.querySelector(".sheep");
    let wolfSquareID = parseInt(wolfSquare.getAttribute("square-id"));
    let sheepSquareID = parseInt(sheepSquare.getAttribute("square-id"));
    let distance1 = calculateDistance(wolfSquareID, sheepSquareID);
    let wolfAdjacentSquares = getAdjacentSquares(wolfSquare);
    let wolfAdjacentSquaresSquareID = (8)
    let wolfSquareFound = false;
    let wolfNewSqare;
    let distance2;
    for (let i = 0; i < 8; i++){
        if(!wolfSquareFound && wolfAdjacentSquares[i] != null){
            wolfAdjacentSquaresSquareID[i] = parseInt(wolfAdjacentSquares[i].getAttribute("square-id"));
            distance2 = calculateDistance(wolfAdjacentSquaresSquareID[i], sheepSquare)
            if(distance2 < distance1 && !isObstacle(wolfAdjacentSquares[i])){
                wolfNewSqare = wolfAdjacentSquares[i];
                wolfSquareFound = true;
            }
        }
    }
    wolfSquare.classList.remove("wolf");
    wolfNewSqare.classList.add("wolf");
    wolfNewSqare.appendChild(wolf.wolfImageElement);
}
function isAdjacent(square, element) {
    const currentSquareId = parseInt(square.getAttribute("square-id"));
    const shepherdSquareId = parseInt(document.querySelector(".shepherd").getAttribute("square-id"));
    const rowDiff = Math.abs(Math.floor(currentSquareId / width) - Math.floor(shepherdSquareId / width));
    const colDiff = Math.abs((currentSquareId % width) - (shepherdSquareId % width));
    if (rowDiff <= 1 && colDiff <= 1 && !isObstacle(square)) {
      return true;
    }
    return false;
  }
  function isObstacle(square) {
    const obstacles = square.getElementsByClassName("blocking");
    return obstacles.length > 0;
  }
  
  function calculateDistance(squareId1, squareId2) {
    const row1 = Math.floor(squareId1 / width);
    const col1 = squareId1 % width;
    const row2 = Math.floor(squareId2 / width);
    const col2 = squareId2 % width;
    return Math.abs(row1 - row2) + Math.abs(col1 - col2);
  }
  function moveSheep(startingquarter, sheepquarter) {
    let sheepSquare = document.querySelector(".sheep");
        sheepSquare.classList.remove("sheep");
    let targetQuarter;
    let adjacentSquares = getAdjacentSquares(sheepSquare);
    let sheepNewSquare;
        switch(startingquarter){
            case 1:
                targetQuarter = 99;
                switch(sheepquarter){
                    case 2:
                    if(adjacentSquares[5] != null && !isObstacle(adjacentSquares[5])){ 
                        sheepNewSquare = adjacentSquares[5];  
                    } 
                    else if(adjacentSquares[7] != null && !isObstacle(adjacentSquares[7])){
                        sheepNewSquare = adjacentSquares[7]; 
                    }
                    else if(adjacentSquares[3] != null && !isObstacle(adjacentSquares[3])){
                        sheepNewSquare = adjacentSquares[3]; 
                    }
                    else if(adjacentSquares[2] != null && !isObstacle(adjacentSquares[2])){
                        sheepNewSquare = adjacentSquares[2]; 
                    }
                    else if(adjacentSquares[4] != null && !isObstacle(adjacentSquares[4])){
                        sheepNewSquare = adjacentSquares[4]; 
                    }
                    else if(adjacentSquares[0] != null && !isObstacle(adjacentSquares[0])){
                        sheepNewSquare = adjacentSquares[0]; 
                    }
                    else if(adjacentSquares[6] != null && !isObstacle(adjacentSquares[6])){
                        sheepNewSquare = adjacentSquares[6]; 
                    }
                    else if(adjacentSquares[1] != null && !isObstacle(adjacentSquares[1])){
                        sheepNewSquare = adjacentSquares[1]; 
                    }
                        break;
                    case 3:
                        if(adjacentSquares[5] != null && !isObstacle(adjacentSquares[5])){ 
                            sheepNewSquare = adjacentSquares[5];  
                        } 
                        else if(adjacentSquares[3] != null && !isObstacle(adjacentSquares[3])){
                            sheepNewSquare = adjacentSquares[3]; 
                        }
                        else if(adjacentSquares[7] != null && !isObstacle(adjacentSquares[7])){
                            sheepNewSquare = adjacentSquares[7]; 
                        }
                        else if(adjacentSquares[4] != null && !isObstacle(adjacentSquares[4])){
                            sheepNewSquare = adjacentSquares[4]; 
                        }
                        else if(adjacentSquares[2] != null && !isObstacle(adjacentSquares[2])){
                            sheepNewSquare = adjacentSquares[2]; 
                        }
                        else if(adjacentSquares[6] != null && !isObstacle(adjacentSquares[6])){
                            sheepNewSquare = adjacentSquares[6]; 
                        }
                        else if(adjacentSquares[0] != null && !isObstacle(adjacentSquares[0])){
                            sheepNewSquare = adjacentSquares[0]; 
                        }
                        else if(adjacentSquares[1] != null && !isObstacle(adjacentSquares[1])){
                            sheepNewSquare = adjacentSquares[1]; 
                        }
                        break;
                }
                break;
            case 2:
                targetQuarter = 90;
                switch(sheepquarter){
                    case 1:
                        if(adjacentSquares[4] != null && !isObstacle(adjacentSquares[4])){ 
                            sheepNewSquare = adjacentSquares[4];  
                        } 
                        else if(adjacentSquares[3] != null && !isObstacle(adjacentSquares[3])){
                            sheepNewSquare = adjacentSquares[3]; 
                        }
                        else if(adjacentSquares[6] != null && !isObstacle(adjacentSquares[6])){
                            sheepNewSquare = adjacentSquares[6]; 
                        }
                        else if(adjacentSquares[5] != null && !isObstacle(adjacentSquares[5])){
                            sheepNewSquare = adjacentSquares[5]; 
                        }
                        else if(adjacentSquares[1] != null && !isObstacle(adjacentSquares[1])){
                            sheepNewSquare = adjacentSquares[1]; 
                        }
                        else if(adjacentSquares[0] != null && !isObstacle(adjacentSquares[0])){
                            sheepNewSquare = adjacentSquares[0]; 
                        }
                        else if(adjacentSquares[7] != null && !isObstacle(adjacentSquares[7])){
                            sheepNewSquare = adjacentSquares[7]; 
                        }
                        else if(adjacentSquares[2] != null && !isObstacle(adjacentSquares[2])){
                            sheepNewSquare = adjacentSquares[2]; 
                        }
                        break;
                    case 4:
                        if(adjacentSquares[4] != null && !isObstacle(adjacentSquares[4])){ 
                            sheepNewSquare = adjacentSquares[4];  
                        } 
                        else if(adjacentSquares[6] != null && !isObstacle(adjacentSquares[6])){
                            sheepNewSquare = adjacentSquares[6]; 
                        }
                        else if(adjacentSquares[3] != null && !isObstacle(adjacentSquares[3])){
                            sheepNewSquare = adjacentSquares[3]; 
                        }
                        else if(adjacentSquares[1] != null && !isObstacle(adjacentSquares[1])){
                            sheepNewSquare = adjacentSquares[1]; 
                        }
                        else if(adjacentSquares[5] != null && !isObstacle(adjacentSquares[5])){
                            sheepNewSquare = adjacentSquares[5]; 
                        }
                        else if(adjacentSquares[7] != null && !isObstacle(adjacentSquares[7])){
                            sheepNewSquare = adjacentSquares[7]; 
                        }
                        else if(adjacentSquares[0] != null && !isObstacle(adjacentSquares[0])){
                            sheepNewSquare = adjacentSquares[0]; 
                        }
                        else if(adjacentSquares[2] != null && !isObstacle(adjacentSquares[2])){
                            sheepNewSquare = adjacentSquares[2]; 
                        }
                        break;
                }
                break;
            case 3:
                targetQuarter = 9;
                switch(sheepquarter){
                    case 1:
                        if(adjacentSquares[2] != null && !isObstacle(adjacentSquares[2])){ 
                            sheepNewSquare = adjacentSquares[2];  
                        } 
                        else if(adjacentSquares[7] != null && !isObstacle(adjacentSquares[7])){
                            sheepNewSquare = adjacentSquares[7]; 
                        }
                        else if(adjacentSquares[0] != null && !isObstacle(adjacentSquares[0])){
                            sheepNewSquare = adjacentSquares[0]; 
                        }
                        else if(adjacentSquares[5] != null && !isObstacle(adjacentSquares[5])){
                            sheepNewSquare = adjacentSquares[5]; 
                        }
                        else if(adjacentSquares[1] != null && !isObstacle(adjacentSquares[1])){
                            sheepNewSquare = adjacentSquares[1]; 
                        }
                        else if(adjacentSquares[6] != null && !isObstacle(adjacentSquares[6])){
                            sheepNewSquare = adjacentSquares[6]; 
                        }
                        else if(adjacentSquares[3] != null && !isObstacle(adjacentSquares[3])){
                            sheepNewSquare = adjacentSquares[3]; 
                        }
                        else if(adjacentSquares[4] != null && !isObstacle(adjacentSquares[4])){
                            sheepNewSquare = adjacentSquares[4]; 
                        }    
                        break;
                    case 4:
                        if(adjacentSquares[2] != null && !isObstacle(adjacentSquares[2])){ 
                            sheepNewSquare = adjacentSquares[2];  
                        } 
                        else if(adjacentSquares[0] != null && !isObstacle(adjacentSquares[0])){
                            sheepNewSquare = adjacentSquares[0]; 
                        }
                        else if(adjacentSquares[7] != null && !isObstacle(adjacentSquares[7])){
                            sheepNewSquare = adjacentSquares[7]; 
                        }
                        else if(adjacentSquares[1] != null && !isObstacle(adjacentSquares[1])){
                            sheepNewSquare = adjacentSquares[1]; 
                        }
                        else if(adjacentSquares[5] != null && !isObstacle(adjacentSquares[5])){
                            sheepNewSquare = adjacentSquares[5]; 
                        }
                        else if(adjacentSquares[3] != null && !isObstacle(adjacentSquares[3])){
                            sheepNewSquare = adjacentSquares[3]; 
                        }
                        else if(adjacentSquares[6] != null && !isObstacle(adjacentSquares[6])){
                            sheepNewSquare = adjacentSquares[6]; 
                        }
                        else if(adjacentSquares[4] != null && !isObstacle(adjacentSquares[4])){
                            sheepNewSquare = adjacentSquares[4]; 
                        }        
                        break;
                }
                break;
            case 4:
                targetQuarter = 0;
                switch(sheepquarter){
                    case 2:
                        if(adjacentSquares[1] != null && !isObstacle(adjacentSquares[1])){ 
                            sheepNewSquare = adjacentSquares[1];  
                        } 
                        else if(adjacentSquares[6] != null && !isObstacle(adjacentSquares[6])){
                            sheepNewSquare = adjacentSquares[6]; 
                        }
                        else if(adjacentSquares[0] != null && !isObstacle(adjacentSquares[0])){
                            sheepNewSquare = adjacentSquares[0]; 
                        }
                        else if(adjacentSquares[4] != null && !isObstacle(adjacentSquares[4])){
                            sheepNewSquare = adjacentSquares[4]; 
                        }
                        else if(adjacentSquares[2] != null && !isObstacle(adjacentSquares[2])){
                            sheepNewSquare = adjacentSquares[2]; 
                        }
                        else if(adjacentSquares[7] != null && !isObstacle(adjacentSquares[7])){
                            sheepNewSquare = adjacentSquares[7]; 
                        }
                        else if(adjacentSquares[3] != null && !isObstacle(adjacentSquares[3])){
                            sheepNewSquare = adjacentSquares[3]; 
                        }
                        else if(adjacentSquares[5] != null && !isObstacle(adjacentSquares[5])){
                            sheepNewSquare = adjacentSquares[5]; 
                        }          
                        break;
                    case 3:
                        if(adjacentSquares[1] != null && !isObstacle(adjacentSquares[1])){ 
                            sheepNewSquare = adjacentSquares[1];  
                        } 
                        else if(adjacentSquares[0] != null && !isObstacle(adjacentSquares[0])){
                            sheepNewSquare = adjacentSquares[0]; 
                        }
                        else if(adjacentSquares[6] != null && !isObstacle(adjacentSquares[6])){
                            sheepNewSquare = adjacentSquares[6]; 
                        }
                        else if(adjacentSquares[2] != null && !isObstacle(adjacentSquares[2])){
                            sheepNewSquare = adjacentSquares[2]; 
                        }
                        else if(adjacentSquares[4] != null && !isObstacle(adjacentSquares[4])){
                            sheepNewSquare = adjacentSquares[4]; 
                        }
                        else if(adjacentSquares[3] != null && !isObstacle(adjacentSquares[3])){
                            sheepNewSquare = adjacentSquares[3]; 
                        }
                        else if(adjacentSquares[7] != null && !isObstacle(adjacentSquares[7])){
                            sheepNewSquare = adjacentSquares[7]; 
                        }
                        else if(adjacentSquares[5] != null && !isObstacle(adjacentSquares[5])){
                            sheepNewSquare = adjacentSquares[5]; 
                        }    
                        break;
                    }
                    break;
        }
      sheepNewSquare.classList.add("sheep");
      sheepNewSquare.appendChild(sheep.sheepImageElement);
  }
  function getAdjacentSquares(square) {
  const squareId = parseInt(square.getAttribute("square-id"));
  const adjacentSquares = [];
  if (squareId >= width) {
    adjacentSquares.push(gameBoard.querySelector(`[square-id="${squareId - width}"]`));
    if (squareId % width !== 0) {
      adjacentSquares.push(gameBoard.querySelector(`[square-id="${squareId - width - 1}"]`));
    } else {adjacentSquares.push(null);}
    if ((squareId + 1) % width !== 0) {
      adjacentSquares.push(gameBoard.querySelector(`[square-id="${squareId - width + 1}"]`));
    } else {adjacentSquares.push(null);}
  } else {
    adjacentSquares.push(null);
    adjacentSquares.push(null);
    adjacentSquares.push(null);
  }
  if (squareId < width * (width - 1)) {
    adjacentSquares.push(gameBoard.querySelector(`[square-id="${squareId + width}"]`));
    if (squareId % width !== 0) {
      adjacentSquares.push(gameBoard.querySelector(`[square-id="${squareId + width - 1}"]`));
    } else {adjacentSquares.push(null);}
    if ((squareId + 1) % width !== 0) {
      adjacentSquares.push(gameBoard.querySelector(`[square-id="${squareId + width + 1}"]`));
    } else {adjacentSquares.push(null);}
  } else {
    adjacentSquares.push(null);
    adjacentSquares.push();
    adjacentSquares.push();
}
  if (squareId % width !== 0) {
    adjacentSquares.push(gameBoard.querySelector(`[square-id="${squareId - 1}"]`));
  } else {adjacentSquares.push(null);}
  if ((squareId + 1) % width !== 0) {
    adjacentSquares.push(gameBoard.querySelector(`[square-id="${squareId + 1}"]`));
  } else {adjacentSquares.push(null);}
  return adjacentSquares;
}
function wolfPosition(wauwau){
    let side = Math.round(Math.random() * 3)
    let squareElements
    let targetSquare
    let wolfStart
    switch(side){
        case 0: 
                do{wolfStart = Math.round(Math.random() * 9);
                }while (zufallszahlrocks.includes(wolfStart) || zufallszahltrees.includes(wolfStart))
                squareElements = document.querySelectorAll(".square");
                targetSquare = squareElements[wolfStart];
                targetSquare.classList.add("wolf");
                targetSquare.appendChild(wauwau);
                if(wolfStart < 5)
                {
                    startingquarter = 1;
                }
                else{
                    startingquarter = 2;
                }
                break;
        case 1: 
                do{wolfStart = Math.round(Math.random() * 9) + 90;
                }while (zufallszahlrocks.includes(wolfStart) || zufallszahltrees.includes(wolfStart))
                squareElements = document.querySelectorAll(".square");
                targetSquare = squareElements[wolfStart];
                targetSquare.classList.add("wolf");
                targetSquare.appendChild(wauwau);
                if(wolfStart < 95)
                {
                    startingquarter = 3;
                }
                else{
                    startingquarter = 4;
                }
                break;
        case 2: 
                do{wolfStart = Math.round(Math.random() * 9) * 10;
                }while (zufallszahlrocks.includes(wolfStart) || zufallszahltrees.includes(wolfStart))
                squareElements = document.querySelectorAll(".square");
                targetSquare = squareElements[wolfStart];
                targetSquare.classList.add("wolf");
                targetSquare.appendChild(wauwau);
                if(wolfStart < 50)
                {
                    startingquarter = 1;
                }
                else{
                    startingquarter = 3;
                }
                break;
        case 3: 
                do{wolfStart = (Math.round(Math.random() * 9) * 10) + 9;
                }while (zufallszahlrocks.includes(wolfStart) || zufallszahltrees.includes(wolfStart))
                squareElements = document.querySelectorAll(".square");
                targetSquare = squareElements[wolfStart];
                targetSquare.classList.add("wolf");
                targetSquare.appendChild(wauwau);
                if(wolfStart < 50)
                {
                    startingquarter = 2;
                }
                else{
                    startingquarter = 4;
                }
                break;
    }
    return startingquarter;
}
function sheepPosition(meheheh, startingquarter) {
    let targetSquare;
    let sheepstart;
    let rechnung;
    switch (startingquarter) {
      case 1:
        do {
            rechnung = Math.floor(Math.random() * 49);
            if((rechnung % 10) < 5){
                rechnung += 50;
            }
            sheepstart = rechnung;
        } while (zufallszahlrocks.includes(sheepstart) || zufallszahltrees.includes(sheepstart))
        targetSquare = document.querySelectorAll(".square")[sheepstart];
        targetSquare.classList.add("sheep");
        targetSquare.appendChild(meheheh);
        if(sheepstart < 50)
                {
                    sheepquarter = 2;
                }
                else{
                    sheepquarter = 3;
                }
        break;
      case 2:
        do {
            rechnung = Math.floor(Math.random() * 49);
            if((rechnung % 10) > 4){
                rechnung += 50;
            }
            sheepstart = rechnung;
        } while (zufallszahlrocks.includes(sheepstart) || zufallszahltrees.includes(sheepstart))
        targetSquare = document.querySelectorAll(".square")[sheepstart];
        targetSquare.classList.add("sheep");
        targetSquare.appendChild(meheheh);
        if(sheepstart < 50)
                {
                    sheepquarter = 1;
                }
                else{
                    sheepquarter = 4;
                }
        break;
      case 3:
        do {
            rechnung = Math.floor(Math.random() * 49);
            if((rechnung % 10) > 4){
                rechnung += 50;
            }
            sheepstart = rechnung;
        } while (zufallszahlrocks.includes(sheepstart) || zufallszahltrees.includes(sheepstart))
        targetSquare = document.querySelectorAll(".square")[sheepstart];
        targetSquare.classList.add("sheep");
        targetSquare.appendChild(meheheh);
        if(sheepstart < 50)
                {
                    sheepquarter = 1;
                }
                else{
                    sheepquarter = 4;
                }
        break;
      case 4:
        do {
            rechnung = Math.floor(Math.random() * 49);
            if((rechnung % 10) < 5){
                rechnung += 50;
            }
            sheepstart = rechnung;
        } while (zufallszahlrocks.includes(sheepstart) || zufallszahltrees.includes(sheepstart))
        targetSquare = document.querySelectorAll(".square")[sheepstart];
        targetSquare.classList.add("sheep");
        targetSquare.appendChild(meheheh);
        if(sheepstart < 50)
                {
                    sheepquarter = 2;
                }
                else{
                    sheepquarter = 3;
                }
        break;
    }
    return sheepquarter;
  }
  function shepherdPosition(shepherdElement, startingQuarter){
    let squareElements;
    let targetSquare;
    let shepherdStart;
    let placeholder;
    switch(startingQuarter){
        case 1:
                do{placeholder = Math.round((Math.random() * 49) + 50);
                if ((placeholder % 10) < 5){
                    placeholder += 5;
                }
                shepherdStart = placeholder
                } while (zufallszahlrocks.includes(shepherdStart) || zufallszahltrees.includes(shepherdStart))
                squareElements = document.querySelectorAll(".square");
                targetSquare = squareElements[shepherdStart];
                targetSquare.classList.add("shepherd");
                targetSquare.appendChild(shepherdElement);
            break;
            case 2:
                do {placeholder = Math.round((Math.random() * 49) + 50);
                if ((placeholder % 10) > 4){
                    placeholder -= 5;
                }
                shepherdStart = placeholder
                }while (zufallszahlrocks.includes(shepherdStart) || zufallszahltrees.includes(shepherdStart))
                squareElements = document.querySelectorAll(".square");
                targetSquare = squareElements[shepherdStart];
                targetSquare.classList.add("shepherd");
                targetSquare.appendChild(shepherdElement);
            break;
            case 3:
                do{placeholder = Math.round(Math.random() * 49);
                if ((placeholder % 10) < 5){
                    placeholder += 5;
                }
                shepherdStart = placeholder
                }while (zufallszahlrocks.includes(shepherdStart) || zufallszahltrees.includes(shepherdStart))
                squareElements = document.querySelectorAll(".square");
                targetSquare = squareElements[shepherdStart];
                targetSquare.classList.add("shepherd");
                targetSquare.appendChild(shepherdElement);
            break;
            case 4:
                    do{placeholder = Math.round(Math.random() * 49);
                    if ((placeholder % 10) > 4){
                        placeholder -= 5;
                    }
                    shepherdStart = placeholder
                    }while (zufallszahlrocks.includes(shepherdStart) || zufallszahltrees.includes(shepherdStart))
                    squareElements = document.querySelectorAll(".square");
                    targetSquare = squareElements[shepherdStart];
                    targetSquare.classList.add("shepherd");
                    targetSquare.appendChild(shepherdElement);
                break;
    }
}
function generateRandomNumber() {
  let randomNumber = Math.round(Math.random() * 99);
  while (zufallszahlrocks.includes(randomNumber) || zufallszahltrees.includes(randomNumber)){
    randomNumber = Math.round(Math.random() * 99);
  }
  return randomNumber;
}
function resetGame() {
  time.paused = true;
  clearInterval(time.intervalId);
  time.startTime = 0;
  time.elapsedTime = 0;
  time.currentTime = 0;
  time.hrs = 0;
  time.mins = 0;
  time.secs = 0;
  time.timeDisplay.textContent = "00:00:00";
  createBoard();
}
resetbutton.addEventListener("click", resetGame);
function updateTime() {
  time.elapsedTime = Date.now() - time.startTime;
  time.secs = Math.floor((time.elapsedTime / 1000) % 60);
  time.mins = Math.floor((time.elapsedTime / (1000 * 60)) % 60);
  time.hrs = Math.floor((time.elapsedTime / (1000 * 60 * 60)) % 60);
  time.secs = pad(time.secs);
  time.mins = pad(time.mins);
  time.hrs = pad(time.hrs);
  time.timeDisplay.textContent = `${time.hrs}:${time.mins}:${time.secs}`;
  function pad(unit) {
    return ("0" + unit).slice(-2);
  }
}
function back() {
  resetGame();
  let rootElement = document.querySelector(":root");
  rootElement.style.setProperty("--displaymenu", "block");
  rootElement.style.setProperty("--displaygame", "none");
  rootElement.style.setProperty("--displaygameboard", "none");
  rootElement.style.setProperty("--displaylink", "inline-grid");
  rootElement.style.setProperty("--displaynametag", "none");
  shepherdSteps = 0;
}
function win() {
  time.paused = true;
  clearInterval(timer);
  alert("You Win!");
}