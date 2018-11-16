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
class piece {
  constructor(id, isKing,isP1,posX,posY) {
    this.id= id;
	this.isKing=isKing;
	this.isP1=isP1;
	this.posX=posX;
	this.posY=posY;
  }
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
				if (y < 2) {
					spaces[y][x] = new piece ("piece" + (y*8 + x),false,true,x,y);
				} else if (y >= 6) {
					spaces[y][x] = new piece ("piece" + (y*8 + x),false,false,x,y);
				}
				else
				{
						spaces[y][x]
				}
			} else {
				cell.backgroundColor = "white";
			}
			//console.log(spaces[y][x]);
		}
	}
	update_board();
}
function update_board()
{
	var i;
	var k;
	for(y=0;y<8;y++)
	{
		for(x=0;x<8;x++)
		{
			var cell = document.getElementById("board").rows[y].cells[x];
			if(spaces[y][x]&&typeof(spaces[y][x])!==typeof(spaces[0][0]))//this assumes that cells without pieces are null
			{
				var t3=typeof(spaces[y][x])!=="piece";
				var t2=typeof(spaces[y][x])
				var t=spaces[y][x];
				cell.innerHTML=(spaces[y][x].isP1)?cell.innerHTML = '<img src="img/p1_img.png"/>':'<img src="img/p2_img.png"/>';
			}
			else
			{
				cell.innerHTML="";
			}
		}
	}
	
	
}
function selectCell(cell) {
	if (cell.style.backgroundColor == "black") {
		if (selectedCell !== null) {
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
	} else if (selectedCell !== null) {
		selectedCell.style.borderColor = "";
		selectedCell = null;
	}
}

function doMove(origin, destination) {

	if (destination.innerHTML !== "") {
		return;
	}

	var originId = parseInt(origin.id.substr(4));
	var originY = Math.floor(originId / 8);
	var originX = originId % 8;
	var destinationId = parseInt(destination.id.substr(4));
	var destinationY = Math.floor(destinationId / 8);
	var destinationX = destinationId % 8;
	var to_move=spaces[originY][originX];
	var abs_dif=Math.abs(originId - destinationId)
	if(!to_move.isKing&&((to_move.isP1&&originId>destinationId)||(!to_move.isP1&&originId<destinationId)))return;//automaticly exit if a player trys to move a non king against its direction
	if (!spaces[destinationY][destinationY] && (abs_dif === 7 || abs_dif === 9)) {
		spaces[destinationY][destinationX] = spaces[originY][originX];
		spaces[originY][originX] = null;

		turn = 1 - turn;
		update_board();
		return;
	}
	var str
	str = destination.id.replace(destination.id.substr(4), originId + (destinationId - originId) / 2);
	var i = document.getElementById(str);
	var to_kill=originId + (destinationId - originId) / 2;
	var to_killY=Math.floor(to_kill / 8);
	var to_killX=Math.floor(to_kill%8);
	if (turn === 0 && abs_dif === 18||abs_dif===14 && document.getElementById(str).innerHTML !== "" && document.getElementById(str).innerHTML.includes("2")) {
		spaces[to_killY][to_killX]=null;
		spaces[destinationY][destinationX] = spaces[originY][originX];
		spaces[originY][originX] = null;

		turn = 1 - turn;
		update_board();
	}
	else if (turn === 1 && (originId - destinationId) === 18||abs_dif===14 && document.getElementById(str).innerHTML !== "" && document.getElementById(str).innerHTML.includes("1")) {
		spaces[to_killY][to_killX]=null;
		spaces[destinationY][destinationX] = spaces[originY][originX];
		spaces[originY][originX] = null;

		turn = 1 - turn;
		update_board();
	}
	var d = document.getElementById(str).innerHTML;
	var t = Math.abs(originId - destinationId);
}
