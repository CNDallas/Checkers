var spaces = [[],[],[],[],[],[],[],[]]; //each element is either a piece object or null

var selectedCell = null;
var turn = 0;
var p1PiecesLeft = 12;
var p2PiecesLeft = 12;

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
				if (y <= 2) {
					spaces[y][x] = new piece ("piece" + (y*8 + x),false,true,x,y);
				} else if (y >= 5) {
					spaces[y][x] = new piece ("piece" + (y*8 + x),false,false,x,y);
				}
				else
				{
					//TODO
						spaces[y][x] = new piece ("piece" + (y*8 + x),false,false,x,y);
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
					cell.innerHTML = (spaces[y][x].isKing)?cell.innerHTML = '<img src="img/p1_king_img.png"/>' : '<img src="img/p1_img.png"/>';
				} else {
					cell.innerHTML = (spaces[y][x].isKing)?cell.innerHTML = '<img src="img/p2_king_img.png"/>' : '<img src="img/p2_img.png"/>';
				}
			}
			else
			{
				cell.innerHTML = "";
			}
		}
	}
	var t1=(turn)? "red":"blue";

	document.getElementById("turn").innerHTML=t1+"'s turn";

}
function selectCell(cell) {
	if (cell.style.backgroundColor == "black") {
		if (selectedCell !== null) {
			if ((turn === 0 && selectedCell.innerHTML.includes("p1"))  ||(turn === 1 && selectedCell.innerHTML.includes("p2")))
			{

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

/*function doMove(origin, destination) {
	//TODO clean this code up its really messy and has alot of things we dont need any more also probably comments as well.... i suppose


	var originId = parseInt(origin.id.substr(4));
	var originY = Math.floor(originId / 8);
	var originX = originId % 8;
	var destinationId = parseInt(destination.id.substr(4));
	var destinationY = Math.floor(destinationId / 8);
	var destinationX = destinationId % 8;
	var to_move=spaces[originY][originX];
	var abs_dif=Math.abs(originId - destinationId)
	if(spaces[destinationY][destinationX])return;
	if(!to_move.isKing&&((to_move.isP1&&originId>destinationId)||(!to_move.isP1&&originId<destinationId)))return;//automaticly exit if a player trys to move a non king against its direction
	if (!spaces[destinationY][destinationY] && (abs_dif === 7 || abs_dif === 9)) {
		spaces[destinationY][destinationX] = spaces[originY][originX];
		spaces[originY][originX] = null;
		if ((turn === 0 && destinationY == 7) || (turn === 1 && destinationY == 0)) {
			spaces[destinationY][destinationX].isKing = true;
		}

		turn = 1 - turn;
		update_board();
		return;
	}
	var to_kill=originId + (destinationId - originId) / 2;
	var to_killY=Math.floor(to_kill / 8);
	var to_killX=Math.floor(to_kill%8);
	to_kill =spaces[to_killY][to_killX];
	if (turn === 0 && (abs_dif === 18||abs_dif===14) && to_kill && !to_kill.isP1) {
		spaces[to_killY][to_killX]=null;
		spaces[destinationY][destinationX] = spaces[originY][originX];
		spaces[originY][originX] = null;
		p2PiecesLeft--;
		if (p2PiecesLeft === 0) {
			winner(1);
		}
		if (destinationY === 7) {
			spaces[destinationY][destinationX].isKing = true;
		}

		turn = 1 - turn;
		update_board();
	}
	else if (turn === 1 && (abs_dif === 18||abs_dif===14) && to_kill && to_kill.isP1) {
		spaces[to_killY][to_killX]=null;
		spaces[destinationY][destinationX] = spaces[originY][originX];
		spaces[originY][originX] = null;
		p1PiecesLeft--;
		if (p1PiecesLeft == 0) {
			winner(2);
		}
		if (destinationY == 0) {
			spaces[destinationY][destinationX].isKing = true;
		}

		turn = 1 - turn;
		update_board();
	}
	//var d = document.getElementById(str).innerHTML;
	//var t = Math.abs(originId - destinationId);
}
*/
var last_move=null;
function doMove(origin, destination) {
	//TODO clean this code up its really messy and has alot of things we dont need any more also probably comments as well.... i suppose


	var originId = parseInt(origin.id.substr(4));
	var originY = Math.floor(originId / 8);
	var originX = originId % 8;
	var destinationId = parseInt(destination.id.substr(4));
	var destinationY = Math.floor(destinationId / 8);
	var destinationX = destinationId % 8;
	var to_move=spaces[originY][originX];
	var abs_dif=Math.abs(originId - destinationId)
	if(spaces[destinationY][destinationX])return;
	if(!to_move.isKing&&((to_move.isP1&&originId>destinationId)||(!to_move.isP1&&originId<destinationId)))return;//automaticly exit if a player trys to move a non king against its direction
	if(last_move!==null&&last_move!==to_move) return; //exit if a player trys to move a piece who is not the last capture used while it still has captures avalible
	var t=has_valid_capture();
	if(has_valid_capture()&& (abs_dif !== 18&&abs_dif!==14))return; //if the palyer has valid captures and isn't trying to make one
	if (!spaces[destinationY][destinationY] && (abs_dif === 7 || abs_dif === 9)) {
		spaces[destinationY][destinationX] = spaces[originY][originX];
		spaces[originY][originX] = null;
		if ((turn === 0 && destinationY == 7) || (turn === 1 && destinationY == 0)) {
			spaces[destinationY][destinationX].isKing = true;
		}

		turn = 1 - turn;
		update_board();
		return;
	}
	var to_kill=originId + (destinationId - originId) / 2;
	var to_killY=Math.floor(to_kill / 8);
	var to_killX=Math.floor(to_kill%8);
	to_kill =spaces[to_killY][to_killX];
	if (turn === 0 && (abs_dif === 18||abs_dif===14) && to_kill && !to_kill.isP1) {
		spaces[to_killY][to_killX]=null;
		spaces[destinationY][destinationX] = spaces[originY][originX];
		spaces[originY][originX] = null;
		p2PiecesLeft--;
		if (p2PiecesLeft === 0) {
			winner(1);
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
	else if (turn === 1 && (abs_dif === 18||abs_dif===14) && to_kill && to_kill.isP1) {
		spaces[to_killY][to_killX]=null;
		spaces[destinationY][destinationX] = spaces[originY][originX];
		spaces[originY][originX] = null;
		p1PiecesLeft--;
		if (p1PiecesLeft == 0) {
			winner(2);
		}
		if (destinationY == 0) {
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
	//var d = document.getElementById(str).innerHTML;
	//var t = Math.abs(originId - destinationId);
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

		}
	destinationId=(originY*8)+originX+tar;
	if(destinationId<0||destinationId>62) continue;//if outside of valid cells
	var destinationY = Math.floor(destinationId / 8);
	var destinationX = destinationId % 8;
	var originId=originY*8+originX
	var to_kill=originId + (destinationId - originId) /2;
	var to_killY=Math.floor(to_kill / 8);
	var to_killX=Math.floor(to_kill%8);
	if(!origin.isKing&&((origin.isP1&&originId>destinationId)||(!origin.isP1&&originId<destinationId)))continue;
	if(to_killY===destinationY) return false;
	if(typeof(spaces[destinationY][destinationX])===typeof(spaces[0][0]))return false;
	if(!spaces[destinationY][destinationX]&&spaces[to_killY][to_killX]&&(spaces[to_killY][to_killX].isP1!==to_move.isP1))//if nothing in destination and their is a piece in capture squares and its the other players piece
		{
			return true;
		}
	}
	return false;

}
function has_valid_capture()
{
	for(var y=0;y<8;y++){
		for(var x =0;x<8;x++){
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
//function has_valid_moves()//TODO function that returns an array of valid move ids //TODO2 adjust the highlighting function to turn valid move back grounds yellow
function winner(player) {
	console.log("player " + player + " won!");
	//update player stats (wins, losses)
	//make some sort of while loop for until you navigate away //i would add an optional rematch button as well
	//just something to freeze any moves
	//maybe turn = 2?
}

export {winner, has_valid_capture, has_valid_captures, doMove, selectCell, update_board,
				initBoard, piece, onCreate, spaces, selectedCell, turn, p1PiecesLeft, p2PiecesLeft};
