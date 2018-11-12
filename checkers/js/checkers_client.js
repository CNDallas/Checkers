/*import react, {Component } from 'react';

class checkers extends component {
	render(){
		//the webpage and what not
	}
}

var socket = io('/checkers');

export default checkers;*/

var spaces = new Array(); //each element is either a piece object or null

var selectedCell = null;
var turn =0;
function onCreate(){
  initBoard();
}

function initBoard() {
  var i = 0;
  for (i = 0; i < 64; i++) {
    console.log(Math.floor(i / 8));
    var cell = document.getElementById("board").rows[Math.floor(i / 8)].cells[i % 8];

    if ((Math.floor(i / 8) % 2) != (i % 2)) {
      cell.style.backgroundColor = "black";
      if (i < 24) {
				spaces[i] = /*piece : */{id: "piece" + i, isKing: false, isP1: true, posX: Math.floor(i / 8), posY: i % 8};
        cell.innerHTML = '<img src="img/p1_img.png"/>';
      } else if (i >= 40) {
				spaces[i] = /*piece : */{id: "piece" + i, isKing: false, isP1: false, posX: Math.floor(i / 8), posY: i % 8};
        cell.innerHTML = '<img src="img/p2_img.png"/>';
      }
    } else {
      cell.backgroundColor = "white";
    }
		console.log(spaces[i]);
  }
}

function selectCell(cell) {
  if (cell.style.backgroundColor == "black") {
    if (selectedCell != null){
		if((turn===0&& selectedCell.innerHTML.includes("p1_img"))||(turn===1)&&selectedCell.innerHTML.includes("p2_img")) {

			if (selectedCell != cell) {
				doMove(selectedCell, cell);
			}
		}
      selectedCell.style.borderColor = "";
      selectedCell = null;
    }

    cell.style.borderColor = "rgb(255, 0, 0)";
    selectedCell = cell;
  } else if (selectedCell != null) {
      selectedCell.style.borderColor = "";
      selectedCell = null;
    }
}

function doMove(origin, destination) {

	if(destination.innerHTML !== "")
	{
			return;
	}

  if (destination.innerHTML === ""&&(Math.abs(parseInt(origin.id.substr(4))-parseInt(destination.id.substr(4)))===7||Math.abs(parseInt(origin.id.substr(4))-parseInt(destination.id.substr(4)))===9)) {
    destination.innerHTML = origin.innerHTML;
    origin.innerHTML = "";
	turn=Math.abs(turn-1);
	return;
	}
	var str
	str=destination.id.replace(destination.id.substr(4),parseInt(origin.id.substr(4))+(parseInt(destination.id.substr(4))-parseInt(origin.id.substr(4)))/2);
	//str2=destination.id.replace(destination.id.substr(4),parseInt(origin.id.substr(4))-(parseInt(destination.id.substr(4))-parseInt(origin.id.substr(4)))/2);
	 var i =document.getElementById(str);
	 if(turn==0&&(parseInt(destination.id.substr(4))-parseInt(origin.id.substr(4)))===14&&document.getElementById(str).innerHTML!==""&&document.getElementById(str).innerHTML.includes("2"))
	{
		destination.innerHTML = origin.innerHTML;
    document.getElementById(str).innerHTML="";
		origin.innerHTML="";
	turn=Math.abs(turn-1);
	}
	else if(turn==1&&(parseInt(origin.id.substr(4))-parseInt(destination.id.substr(4)))===14&&document.getElementById(str).innerHTML!==""&&document.getElementById(str).innerHTML.includes("1"))
	{
		destination.innerHTML = origin.innerHTML;
    document.getElementById(str).innerHTML="";
	origin.innerHTML="";
	turn=Math.abs(turn-1);
	}
	else if(turn==0&&(parseInt(destination.id.substr(4))-parseInt(origin.id.substr(4)))===18&&document.getElementById(str).innerHTML!==""&&document.getElementById(str).innerHTML.includes("2"))
	{
		destination.innerHTML = origin.innerHTML;
    document.getElementById(str).innerHTML="";
		origin.innerHTML="";
	turn=Math.abs(turn-1);
	}
	else if(turn==1&&(parseInt(origin.id.substr(4))-parseInt(destination.id.substr(4)))===18&&document.getElementById(str).innerHTML!==""&&document.getElementById(str).innerHTML.includes("1"))
	{
		destination.innerHTML = origin.innerHTML;
    document.getElementById(str).innerHTML="";
	origin.innerHTML="";
	turn=Math.abs(turn-1);
	}
	var d =document.getElementById(str).innerHTML;
	var t=Math.abs(parseInt(origin.id.substr(4))-parseInt(destination.id.substr(4)));
}
