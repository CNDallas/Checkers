/*import react, {Component } from 'react';

class checkers extends component {
	render(){
		//the webpage and what not
	}
}

var socket = io('/checkers');

export default checkers;*/

var spaces = [[],[],[],[],[],[],[],[]]; //each element is either a piece object or null

var selectedCell = null;
var turn = 0;

function onCreate() {
	initBoard();
}

function initBoard() {
	var x = 0;
	var y = 0;
	for (y = 0; y < 8; y++) {
		for (x = 0; x < 8; x++) {
			console.log(y);
			var cell = document.getElementById("board").rows[y].cells[x];

			if ((y % 2) != (x % 2)) {
				cell.style.backgroundColor = "black";
				if (y < 3) {
					spaces[y][x] = /*piece : */{
						id: "piece" + (y*8 + x),
						isKing: false,
						isP1: true,
						posX: x,
						posY: y
					};
					cell.innerHTML = '<img src="img/p1_img.png"/>';
				} else if (y >= 6) {
					spaces[y][x] = /*piece : */{
						id: "piece" + (y*8 + x),
						isKing: false,
						isP1: false,
						posX: x,
						posY: y
					};
					cell.innerHTML = '<img src="img/p2_img.png"/>';
				}
			} else {
				cell.backgroundColor = "white";
			}
			console.log(spaces[y][x]);
		}
	}
}

function selectCell(cell) {
	if (cell.style.backgroundColor == "black") {
		if (selectedCell != null) {
			if ((turn === 0 && selectedCell.innerHTML.includes("p1_img")) || (turn === 1) && selectedCell.innerHTML.includes("p2_img")) {

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

	if (destination.innerHTML !== "") {
		return;
	}

	if (destination.innerHTML === "" && (Math.abs(parseInt(origin.id.substr(4)) - parseInt(destination.id.substr(4))) === 7 || Math.abs(parseInt(origin.id.substr(4)) - parseInt(destination.id.substr(4))) === 9)) {
		destination.innerHTML = origin.innerHTML;
		origin.innerHTML = "";
		turn = Math.abs(turn - 1);
		return;
	}
	var str
	str = destination.id.replace(destination.id.substr(4), parseInt(origin.id.substr(4)) + (parseInt(destination.id.substr(4)) - parseInt(origin.id.substr(4))) / 2);
	//str2=destination.id.replace(destination.id.substr(4),parseInt(origin.id.substr(4))-(parseInt(destination.id.substr(4))-parseInt(origin.id.substr(4)))/2);
	var i = document.getElementById(str);
	if (turn == 0 && (parseInt(destination.id.substr(4)) - parseInt(origin.id.substr(4))) === 14 && document.getElementById(str).innerHTML !== "" && document.getElementById(str).innerHTML.includes("2")) {
		destination.innerHTML = origin.innerHTML;
		document.getElementById(str).innerHTML = "";
		origin.innerHTML = "";
		turn = Math.abs(turn - 1);
	}
	else if (turn == 1 && (parseInt(origin.id.substr(4)) - parseInt(destination.id.substr(4))) === 14 && document.getElementById(str).innerHTML !== "" && document.getElementById(str).innerHTML.includes("1")) {
		destination.innerHTML = origin.innerHTML;
		document.getElementById(str).innerHTML = "";
		origin.innerHTML = "";
		turn = Math.abs(turn - 1);
	}
	else if (turn == 0 && (parseInt(destination.id.substr(4)) - parseInt(origin.id.substr(4))) === 18 && document.getElementById(str).innerHTML !== "" && document.getElementById(str).innerHTML.includes("2")) {
		destination.innerHTML = origin.innerHTML;
		document.getElementById(str).innerHTML = "";
		origin.innerHTML = "";
		turn = Math.abs(turn - 1);
	}
	else if (turn == 1 && (parseInt(origin.id.substr(4)) - parseInt(destination.id.substr(4))) === 18 && document.getElementById(str).innerHTML !== "" && document.getElementById(str).innerHTML.includes("1")) {
		destination.innerHTML = origin.innerHTML;
		document.getElementById(str).innerHTML = "";
		origin.innerHTML = "";
		turn = Math.abs(turn - 1);
	}
	var d = document.getElementById(str).innerHTML;
	var t = Math.abs(parseInt(origin.id.substr(4)) - parseInt(destination.id.substr(4)));
}
