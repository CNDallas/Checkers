import react, {Component } from 'react';

class checkers extends component {
	render(){
		//the webpage and what not
	}
}

var socket = io('/checkers');

export default checkers;

var selectedCell = null;

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
        cell.innerHTML = '<img src="img/p1_img.png"/>';
      } else if (i >= 40) {
        cell.innerHTML = '<img src="img/p2_img.png"/>';
      }
    } else {
      cell.backgroundColor = "white";
    }
  }
}

function selectCell(cell) {
  if (cell.style.backgroundColor == "black") {
    if (selectedCell != null) {
      if (selectedCell != cell) {
        doMove(selectedCell, cell);
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
  if (destination.innerHTML == "") {
    destination.innerHTML = origin.innerHTML;
    origin.innerHTML = "";
  }
}
