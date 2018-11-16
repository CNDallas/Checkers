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

	var originId = parseInt(origin.id.substr(4));
	var originY = Math.floor(originId / 8);
	var originX = originId % 8;
	var destinationId = parseInt(destination.id.substr(4));
	var destinationY = Math.floor(destinationId / 8);
	var destinationX = destinationId % 8;

	if (destination.innerHTML === "" && (Math.abs(originId - destinationId) === 7 || Math.abs(originId - destinationId) === 9)) {
		destination.innerHTML = origin.innerHTML;
		origin.innerHTML = "";
		spaces[destinationY][destinationX] = spaces[destinationY][destinationX];
		spaces[originY][originX] = null;

		turn = 1 - turn;
		return;
	}

	var str
	str = destination.id.replace(destination.id.substr(4), originId + (destinationId - originId) / 2);
	//str2=destination.id.replace(destination.id.substr(4),originId-(destinationId-originId)/2);
	var i = document.getElementById(str);

	if (turn == 0 && (destinationId - originId) === 14 && document.getElementById(str).innerHTML !== "" && document.getElementById(str).innerHTML.includes("2")) {
		destination.innerHTML = origin.innerHTML;
		document.getElementById(str).innerHTML = "";
		origin.innerHTML = "";
		spaces[destinationY][destinationX] = spaces[destinationY][destinationX];
		spaces[originY][originX] = null;

		turn = 1 - turn;
	}
	else if (turn == 1 && (originId - destinationId) === 14 && document.getElementById(str).innerHTML !== "" && document.getElementById(str).innerHTML.includes("1")) {
		destination.innerHTML = origin.innerHTML;
		document.getElementById(str).innerHTML = "";
		origin.innerHTML = "";
		spaces[destinationY][destinationX] = spaces[destinationY][destinationX];
		spaces[originY][originX] = null;

		turn = 1 - turn;
	}
	else if (turn == 0 && (destinationId - originId) === 18 && document.getElementById(str).innerHTML !== "" && document.getElementById(str).innerHTML.includes("2")) {
		destination.innerHTML = origin.innerHTML;
		document.getElementById(str).innerHTML = "";
		origin.innerHTML = "";
		spaces[destinationY][destinationX] = spaces[destinationY][destinationX];
		spaces[originY][originX] = null;

		turn = 1 - turn;
	}
	else if (turn == 1 && (originId - destinationId) === 18 && document.getElementById(str).innerHTML !== "" && document.getElementById(str).innerHTML.includes("1")) {
		destination.innerHTML = origin.innerHTML;
		document.getElementById(str).innerHTML = "";
		origin.innerHTML = "";
		spaces[destinationY][destinationX] = spaces[destinationY][destinationX];
		spaces[originY][originX] = null;

		turn = 1 - turn;
	}
	var d = document.getElementById(str).innerHTML;
	var t = Math.abs(originId - destinationId);
}
