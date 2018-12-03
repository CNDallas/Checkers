import * as checkerP1 from './img/p1_img.png';
import * as checkerP2 from './img/p2_img.png';
import * as kingP1 from './img/p1_king_img.png';
import * as kingP2 from './img/p2_king_img.png';
const {MAKE_MOVE} = require('../api/Events');
const {USER_WIN,USER_LOSE,USER_KING} = require('../api/Events');
var spaces = [[],[],[],[],[],[],[],[]]; //each element is either a piece object or null

var selectedCell = null;
var turn = 0;
var p1PiecesLeft = 12;
var p2PiecesLeft = 12;
var won =0;

function onCreate() {
	initBoard();
}

class piece {
  constructor(id, isKing, isP1, posX, posY) {
  this.id= id;
	this.isKing=isKing;
	this.isP1=isP1;
	this.posX=posX;
	this.posY=posY;
  }
}

function initBoard() {
	turn = 0;
	var x = 0;
	var y = 0;
	turn=0;
	for (y = 0; y < 8; y++) {
		for (x = 0; x < 8; x++) {
			console.log(y);
			var cell = document.getElementById("board").rows[y].cells[x];

			if ((y % 2) !== (x % 2)) {
				cell.style.backgroundColor = "black";
				if (y <= 2) {
					spaces[y][x] = new piece ("piece" + (y*8 + x),false,true,x,y);
				} else if (y >= 5) {
					spaces[y][x] = new piece ("piece" + (y*8 + x),false,false,x,y);
				}
				else
				{
					//TODO
					spaces[y][x] = null;
						//spaces[y][x] = new piece ("piece" + (y*8 + x),false,false,x,y);
				}
			} else {
				cell.backgroundColor = "white";
			}
			//console.log(spaces[y][x]);
		}
	}
	update_board();
}

function update_board(){
	var y,x;
	for(y=0;y<8;y++)
	{
		for(x=0;x<8;x++)
		{
			var cell = document.getElementById("board").rows[y].cells[x];
			if(spaces[y][x] && typeof(spaces[y][x]) !== typeof(spaces[0][0]))//this assumes that cells without pieces are null
			{
				spaces[y][x].posY=y;
				spaces[y][x].posX=x;
				if (spaces[y][x].isP1) {
					cell.innerHTML = (spaces[y][x].isKing)?cell.innerHTML = "<img src=" + kingP1.default + ">" : "<img src=" + checkerP1.default + ">";
				} else {
					cell.innerHTML = (spaces[y][x].isKing)?cell.innerHTML = "<img src=" + kingP2.default + ">" : "<img src=" + checkerP2.default + ">";
				}
			}
			else
			{
				cell.innerHTML = "";
			}
		}
	}
	var t1=(turn)? "red":"blue";
	if(won>=2)
	{

	}
	else{
	document.getElementById("turn").innerHTML=t1+"'s turn";
	}
}

function selectCell(cell,socket) {
	if (cell.style.backgroundColor === "black") {
		if (selectedCell !== null) {
			if ((turn === 0 && (selectedCell.innerHTML.includes(checkerP1)||selectedCell.innerHTML.includes(kingP1)))  ||(turn === 1 && (selectedCell.innerHTML.includes(checkerP2)||selectedCell.innerHTML.includes(kingP2))) )
			{

				if (selectedCell !== cell) {
					doMove(selectedCell, cell,socket);
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

var last_move=null;

function doMove(origin, destination,socket) {

	/*
	origin info
	*/
	var originId = parseInt(origin.id.substr(4));
	var originY = Math.floor(originId / 8);
	var originX = originId % 8;
	var to_move=spaces[originY][originX];

	/*
	destination info
	*/
	var destinationId = parseInt(destination.id.substr(4));
	var destinationY = Math.floor(destinationId / 8);
	var destinationX = destinationId % 8;

	/*
	misc info
	*/
	var abs_dif=Math.abs(originId - destinationId)
	var has_moved=false;

	/*
	checks for validity
	*/
	if(spaces[destinationY][destinationX])return;
	if(!to_move.isKing&&((to_move.isP1&&originId>destinationId)||(!to_move.isP1&&originId<destinationId)))return;//automaticly exit if a player trys to move a non king against its direction
	if(last_move!==null&&last_move!==to_move) return; //exit if a player trys to move a piece who is not the last capture used while it still has captures avalible
	if(has_valid_capture()&& (abs_dif !== 18&&abs_dif!==14))return; //if the palyer has valid captures and isn't trying to make one

	/*
	move handling
	*/
	if (!spaces[destinationY][destinationY] && (abs_dif === 7 || abs_dif === 9)) {
		spaces[destinationY][destinationX] = spaces[originY][originX];
		spaces[originY][originX] = null;
		if ((turn === 0 && destinationY === 7) || (turn === 1 && destinationY === 0)) {
			spaces[destinationY][destinationX].isKing = true;
		}

		turn = 1 - turn;
		update_board();
		has_moved=true;
		socket.emit(MAKE_MOVE, originX, originY, destinationX, destinationY);
		return;

	}
	/*
	info on jumping
	*/
	var to_jump=originId + (destinationId - originId) / 2;
	var to_jumpY=Math.floor(to_jump / 8);
	var to_jumpX=Math.floor(to_jump%8);

	to_jump =spaces[to_jumpY][to_jumpX];
	if (turn === 0 && (abs_dif === 18||abs_dif===14) && to_jump && !to_jump.isP1) {
		spaces[to_jumpY][to_jumpX]=null;
		spaces[destinationY][destinationX] = spaces[originY][originX];
		spaces[originY][originX] = null;
		p2PiecesLeft--;
		if (p2PiecesLeft === 0) {
			winner(1);
			socket.emit(USER_WIN);
		}
		if (destinationY === 7) {
			spaces[destinationY][destinationX].isKing = true;
			socket.emit(USER_KING);
		}
			update_board();
		if(has_valid_captures(to_move))
		{
			last_move=to_move;
		}
		else
		{
		last_move=null;
		turn = 1 - turn;
		}
		has_moved=true;
			update_board();
	}
	else if (turn === 1 && (abs_dif === 18||abs_dif===14) && to_jump && to_jump.isP1) {
		spaces[to_jumpY][to_jumpX]=null;
		spaces[destinationY][destinationX] = spaces[originY][originX];
		spaces[originY][originX] = null;
		p1PiecesLeft--;
		if (p1PiecesLeft === 0) {
			winner(2);
			socket.emit(USER_WIN);
		}
		if (destinationY === 0) {
			spaces[destinationY][destinationX].isKing = true;
		socket.emit(USER_KING);
		}
		update_board();
		if(has_valid_captures(to_move))
		{
			last_move=to_move;
		}
		else
		{
		turn = 1 - turn;
		last_move=null;
		}
		has_moved=true;
		update_board();
	}
	if(has_moved)
	{
		socket.emit(MAKE_MOVE, originX, originY, destinationX, destinationY);
	}
	//var d = document.getElementById(str).innerHTML;
	//var t = Math.abs(originId - destinationId);

	//check if this move resulted in the player of the current turn (recently updated) having no valid moves
	var valid_moves = has_valid_move();
	if (!valid_moves) {
		winner(2 - turn);
		socket.emit(USER_WIN);
	}
}

function process_move(origin, destination, socket) {

if(!origin)return;
	/*
	all the info for the origin
	*/
	var originName =origin.id.substr(4);
	var originId = parseInt(origin.id.substr(4));
	var originY = Math.floor(originId / 8);
	var originX = originId % 8;
	var to_move=spaces[originY][originX];

	/*
	all the info for the destination
	*/
	var destName =destination.id.substr(4);
	var destinationId = parseInt(destination.id.substr(4));
	var destinationY = Math.floor(destinationId / 8);
	var destinationX = destinationId % 8;



	var abs_dif=Math.abs(originId - destinationId);


	if(spaces[destinationY][destinationX])return;
	if(!to_move.isKing&&((to_move.isP1&&originId>destinationId)||(!to_move.isP1&&originId<destinationId)))return;//automatically exit if a player trys to move a non king against its direction
	if(last_move!==null&&last_move!==to_move) return; //exit if a player trys to move a piece who is not the last capture used while it still has captures avalible
	if(has_valid_capture()&&(abs_dif !== 18&&abs_dif!==14))return; //if the player has valid captures and isn't trying to make one
	if (!spaces[destinationY][destinationY] && (abs_dif === 7 || abs_dif === 9)) {
		spaces[destinationY][destinationX] = spaces[originY][originX];
		spaces[originY][originX] = null;
		if ((turn === 0 && destinationY === 7) || (turn === 1 && destinationY === 0)) {
			spaces[destinationY][destinationX].isKing = true;
		}

		turn = 1 - turn;
		update_board();
		return;

	}
	var to_jump=originId + (destinationId - originId) / 2;
	var to_jumpY=Math.floor(to_jump / 8);
	var to_jumpX=Math.floor(to_jump%8);
	to_jump =spaces[to_jumpY][to_jumpX];


	if (turn === 0 && (abs_dif === 18||abs_dif===14) && to_jump && !to_jump.isP1) {
		spaces[to_jumpY][to_jumpX]=null;
		spaces[destinationY][destinationX] = spaces[originY][originX];
		spaces[originY][originX] = null;
		p2PiecesLeft--;
		if (p2PiecesLeft === 0) {
			winner(1);
			socket.emit(USER_LOSE);
		}
		if (destinationY === 7) {
			spaces[destinationY][destinationX].isKing = true;
		}
			update_board();
		if(has_valid_captures(to_move))
		{
			last_move=to_move;
		}
		else
		{
		last_move=null;
		turn = 1 - turn;
		}
			update_board();
	}
	else if (turn === 1 && (abs_dif === 18||abs_dif===14) && to_jump && to_jump.isP1) {
		spaces[to_jumpY][to_jumpX]=null;
		spaces[destinationY][destinationX] = spaces[originY][originX];
		spaces[originY][originX] = null;
		p1PiecesLeft--;
		if (p1PiecesLeft === 0) {

			winner(2);
			socket.emit(USER_LOSE);
		}
		if (destinationY === 0) {
			spaces[destinationY][destinationX].isKing = true;
		}
		update_board();
		if(has_valid_captures(to_move))
		{
			last_move=to_move;
		}
		else
		{
		turn = 1 - turn;
		last_move=null;
		}
		update_board();
	}

	//check if this move resulted in the player of the current turn (recently updated) having no valid moves
	var valid_moves = has_valid_move();
	if (!valid_moves) {
		winner(2 - turn);
		socket.emit(USER_LOSE);
	}
}

function has_valid_captures(origin)
{
	if(!origin) return false;

	var originY = origin.posY;
	var originX = origin.posX;
	var to_move=spaces[originY][originX];
	var destinationId ;
	var destinationY ;
	var destinationX ;
	var originId=originY*8+originX
	for(var i=0;i<4;i++)
	{
		var tar;
		switch (i)
		{
			case 0:
			tar=14;
			break;
			case 1:
			tar=18;
			break;
			case 2:
			tar=-14;
			break;
			case 3:
			tar=-18;
			break;
			default:
			break;
		}
	destinationId=(originY*8)+originX+tar;
	if(destinationId<0||destinationId>63) continue;//if outside of valid cells
	 destinationY = Math.floor(destinationId / 8);
	 destinationX = destinationId % 8;
	var to_jump=originId + (destinationId - originId) /2;
	var to_jumpY=Math.floor(to_jump / 8);
	var to_jumpX=Math.floor(to_jump%8);
	if(!origin.isKing&&((origin.isP1&&originId>destinationId)||(!origin.isP1&&originId<destinationId)))continue;
	//if(to_jumpY===destinationY)  continue;
	if(typeof(spaces[destinationY][destinationX])===typeof(spaces[0][0]))continue;
	if(!spaces[destinationY][destinationX]&&spaces[to_jumpY][to_jumpX]&&(spaces[to_jumpY][to_jumpX].isP1!==to_move.isP1))//if nothing in destination and their is a piece in capture squares and its the other players piece
		{
			return true;
		}
	}
	return false;

}

function has_valid_capture() //checks if player of current turn has a valid move available
{
	for(var y=0;y<8;y++){
		for(var x=0;x<8;x++){
			if(!spaces[y][x]||typeof(spaces[y][x]) === typeof(spaces[0][0])) continue;//if nothing there contine
			if(spaces[y][x].isP1&&turn===1) continue;// if what is there is not the players piece
			if(!spaces[y][x].isP1&&turn===0) continue;
			if(has_valid_captures(spaces[y][x]))
			{
				return true;
			}
		}
	}
	return false;
}

function has_valid_move() //checks if player of current turn has a valid move available
{
	for(var y=0;y<8;y++){
		for(var x=0;x<8;x++){
			if(!spaces[y][x]||typeof(spaces[y][x]) === typeof(spaces[0][0])) continue; //nothing there
			if(spaces[y][x].isP1&&turn===1) continue; //not concerned with other player's pieces
			if(!spaces[y][x].isP1&&turn===0) continue;
			if(spaces[y][x].isKing) { //kings can move anywhere
				if(
					(y+1<8 && x-1>=0 && !spaces[y+1][x-1]) ||		//down and left
					(y+1<8 && x+1<8 && !spaces[y+1][x+1]) ||		//down and right
					(y-1>=0 && x-1>=0 && !spaces[y-1][x-1]) ||	//up and left
					(y-1>=0 && x+1<8 && !spaces[y-1][x+1])			//up and right
				) {
					return true;
				}
			} else if(spaces[y][x].isP1) { //P1 is generally moving down; already checked turn
				if(
					(y+1<8 && x-1>=0 && !spaces[y+1][x-1]) || //down and left
					(y+1<8 && x+1<8 && !spaces[y+1][x+1])			//down and right
				) {
						return true;
				}

			} else if(!spaces[y][x].isP1) { //P2 is generally moving up; already checked turn
				if(
					(y-1>=0 && x-1>=0 && !spaces[y-1][x-1]) ||	//up and left
					(y-1>=0 && x+1<8 && !spaces[y-1][x+1])			//up and right
				) {
						return true;
				}
			}
		}
	}
	return has_valid_capture() || false;
}

//TODO function that returns an array of valid move ids
//TODO adjust the highlighting function to turn valid move back grounds yellow

function winner(player) {
	console.log("player " + player + " won!");
	//make rematch button
	won=turn+2;
	if(player===2)
			{
				 document.getElementById("turn").innerHTML="Red Wins!";
			}
			else{
				 document.getElementById("turn").innerHTML="Blue Wins!";
			}
	console.log(won);
}

export {winner, has_valid_capture, has_valid_captures, doMove, selectCell, update_board,
				initBoard, piece, onCreate, spaces, selectedCell, turn, p1PiecesLeft, p2PiecesLeft,process_move};
