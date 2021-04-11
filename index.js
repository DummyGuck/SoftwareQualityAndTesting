
var cellSize = window.innerWidth*0.9/50;
var windowHeight = window.innerHeight;
var playerPos;
var monsterEncounters;

var gameTable = new Array();


const Actor = {
  Player: 0,
  Tree: 1,
  Monster: 2,
  Empty: 3
}



function initNewStage(){
	for(let x = 0; x < 50; ++x){
		gameTable[x] = Actor.Empty;
	}

	gameTable[0] = Actor.Player;
}


function generateTable(){
  /*
  var body = document.getElementsByTagName('body')[0];
  var tbl = document.createElement('table');
  tbl.style.width = '90%';
  var tbdy = document.createElement('tbody');
  tbl.setAttribute('border', '1');
  tbl.setAttribute('centering', 'align-center');
  var tr = document.createElement('tr');
  for (var i = 0; i < 100; i++) {
      var td = document.createElement('td');
      td.appendChild(document.createTextNode('\u0020'));
      tr.appendChild(td);

    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  body.appendChild(tbl);
  */
  initNewStage();

  var mytable = "<table><tr>";
  for (var cell of gameTable) {  mytable += "<td>" + loadImg(cell) + "</td>"; }
  mytable += "</tr></table>";
  document.getElementById("gameTable").innerHTML = mytable;

}

function loadImg(cell) {
	switch(cell) {
	  case Actor.Player:
	    return "<img src=\"resources/red.png\" alt=\"P\" width=\""+cellSize+"\" height=\""+cellSize+"\">"
	    console.log("kismajom")
	    break;
	  case Actor.Tree:
	    // code block
	    break;
	  case Actor.Monster:
	  	break;
	  default:
	  	return "<img src=\"resources/blue.png\" alt=\"P\" width=\""+cellSize+"\" height=\""+cellSize+"\">"
	  	console.log("nagymajom")
	    // code block
} 
}

