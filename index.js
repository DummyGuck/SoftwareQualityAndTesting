
var cellSize = window.innerWidth*0.9/50;
var windowHeight = window.innerHeight;

var gameTable = new Array();
var log = new Array();

var playerPos = 0;
var isGameStarted = false;

var monsterPositions = new Array(9);
var isCombat = false;

const Class = {
  Mage: "Mage",
  Warrior: "Warrior"
}

const SpellType = {
  Fire: 0,
  Ice: 1,
  Mind: 2,
  Poison: 3,
  Phisical: 4,
}

const SpellId = {
  //Mage
  Fireball: 0,
  IceArrow: 1,
  MindControl: 2,

  //Warrior
  Poison: 3,
  HeavySlash: 4,
  Smash: 5
}

var spells = {
    0: {
      displayName: "Fireball",
      type: SpellType.Fire,
      manaCost: 38,
      dmg: 22
    },
    1: {
      displayName: "Ice Arrow",
      type: SpellType.Ice,
      manaCost: 30,
      dmg: 18
    },
    2: {
      displayName: "Mind Control",
      type: SpellType.Mind,
      manaCost: 2,
      dmg: 400
    },
    5: {
      displayName: "Smash",
      type: SpellType.Phisical,
      manaCost: 3,
      dmg: 25
    }
  };

var monster = {
  displayName: "Small Goblin",
  maxHP: 80,
  currentHP: 80,
  maxMP: 20,
  currentMP: 20,
  basedmg: 10,
  resist: {
    0: 20,
    1: 12,
    2: 0,
    3: 12,
    4: 15
  },
  avatarPath: "resources/goblinSmall.png",
  spell: SpellId.Smash
}

var player = {
  displayName: "You",
  class: Class.Mage,
  maxHP: 200,
  currentHP: 200,
  maxMP: 300,
  currentMP: 300,
  basedmg: 5,
  resist: {
    0: 8,
    1: 8,
    2: 12,
    3: 2,
    4: 4
  },
  protraitPath: "resources/femaleMage.jpeg",
  avatarPath: "resources/femaleMageFull.jpeg",
  spells: [
    SpellId.Fireball,
    SpellId.IceArrow,
    SpellId.MindControl
  ],
  hpPotions: 3
}

const Actor = {
  Player: 0,
  Tree: 1,
  Monster: 2,
  Empty: 3
}

document.addEventListener('keydown', function(event) {
  
  if(isGameStarted && !isCombat)
  {
    console.log(event.keyCode);
    if((event.keyCode == 68)) //right direction - press 'D'
    {
      movementRight();
    }else if((event.keyCode == 65)) //left direction - press 'A'
    {
      movementLeft();
    }
  }
 });

function mapInitialization(){
  
  var counter = 0;
  var rndPos = Math.floor(Math.random() * 50) + 1; // number from 1..50 can't be player's initial position
  monsterPositions[counter] = rndPos;
  
  while (counter < 9)
  {
    var rndInnerPos = Math.floor(Math.random() * 50) + 1;
    if(monsterPositions[counter] !== rndInnerPos){ // 10 unique monster position
      counter += 1;
      monsterPositions[counter] = rndInnerPos;
    }
  }
  
}


function startGame(){
  initNewStage();
  generateTable();
  displayStats();
  //startCombat();
}



function initNewStage(){
  
  if (isGameStarted == false){
    mapInitialization();
    isGameStarted = true;
  }
  
  for(let x = 0; x <= 50; ++x){
    gameTable[x] = Actor.Empty;
  }

  for (let x = 0; x <= monsterPositions.length; ++x){
    if(playerPos == monsterPositions[x]) {
      startCombat();
    }
    gameTable[monsterPositions[x]] = Actor.Monster;
  }

  gameTable[playerPos] = Actor.Player;
}


function movementRight()
{
  if (playerPos < 50)
  {
    playerPos += 1;
    generateTable();
  }
}

function movementLeft()
{
  if (playerPos > 0)
  {
    playerPos -= 1;
    generateTable();
  }
}

function generateTable(){
  document.getElementById("startGameButton").style.display = "none";

  initNewStage();

  let mytable = "<table><tr>";
  for (var cell of gameTable) {  mytable += "<td>" + loadImg(cell) + "</td>"; }
  mytable += "</tr></table>";
  document.getElementById("gameTable").innerHTML = mytable;
}

function displayStats(){
  let playerPortrait = "<img src=\"resources/femaleMage.jpeg\" alt=\"Female Mage\" height=\"200px\">";

  let mytable =
    "<table>"+
      "<tr>" +
        "<td rowspan= \"9\">" + playerPortrait+ "</td>" +
        "<td>Class:</td>"+
        "<td>"+player.class+"</td>"+
      "</tr><tr>" +
        "<td>HP:</td>"+
        "<td>"+player.currentHP+"/"+player.maxHP+"</td>"+
      "</tr><tr>" +
        "<td>MP:</td>"+
        "<td>"+player.currentMP+"/"+player.maxMP+"</td>"+
      "</tr><tr>" +
        "<td>Base damage:</td>"+
        "<td>"+player.basedmg+"</td>"+
      "</tr><tr>" +
        "<td>Fire Resistance:</td>"+
        "<td>"+player.resist[SpellType.Fire]+"</td>"+
      "</tr><tr>" +
        "<td>Ice Resistance:</td>"+
        "<td>"+player.resist[SpellType.Ice]+"</td>"+
      "</tr><tr>" +
        "<td>Mind control Resistance:</td>"+
        "<td>"+player.resist[SpellType.Mind]+"</td>"+
      "</tr><tr>" +
        "<td>Poison Resistance:</td>"+
        "<td>"+player.resist[SpellType.Poison]+"</td>"+
      "</tr><tr>" +
        "<td>Phisical Resistance:</td>"+
        "<td>"+player.resist[SpellType.Phisical]+"</td>"+
      "</tr>"+
    "</table>"
  document.getElementById("statTable").innerHTML = mytable;
}

function loadImg(cell) {
  switch(cell) {
    case Actor.Player:
      return "<img src=\"resources/red.png\" alt=\"P\" width=\""+cellSize+"\" height=\""+cellSize+"\">"
      break;
    case Actor.Tree:
      // code block
      break;
    case Actor.Monster:
    return "<img src=\"resources/yellow.png\" alt=\"P\" width=\""+cellSize+"\" height=\""+cellSize+"\">"
      break;
    default:
      return "<img src=\"resources/road.png\" alt=\"P\" width=\""+cellSize+"\" height=\""+cellSize+"\">"
      // code block
  } 
}

function startCombat(){
  isCombat = true;
  monster.currentHP = monster.maxHP;

  console.log(monster.currentHP);

  drawGameTable(monster);
}

function drawGameTable(){
  let table = document.createElement("table");
  table.id = "combatTable";
  let row = table.insertRow();

  let cell = row.insertCell();
  let img = document.createElement("img");
  img.src = player.avatarPath;
  img.height = 400;
  cell.append(img);

  cell = row.insertCell();
  img = document.createElement("img");
  img.src = monster.avatarPath;
  img.height = 400;
  cell.append(img);

  row = table.insertRow();
  cell = row.insertCell();
  cell =row.insertCell();
  cell.append(monster.currentHP + "/" + monster.maxHP);


  for(let spellId of player.spells) {
    row = table.insertRow();
    cell = row.insertCell();
    cell.append(createSpellButton(spellId));
  }

  row = table.insertRow();
  cell = row.insertCell();
  cell.append(createBasicAttackButton());


  row = table.insertRow();
  cell = row.insertCell();
  cell.append(usePotionButton());


  row = table.insertRow();
  cell = row.insertCell();
  cell.colSpan = 2;
  cell.append(createLogList());


  let cTable = document.getElementById("combatTable");
  cTable.remove();

  document.getElementById("actualGame").appendChild(table);  
}

function createLogList(){
  let list = document.createElement("ul");

  for(let e of log){
    let li = document.createElement("li");
    li.innerText = e;
    list.appendChild(li);
  }

  return list;
}

function createSpellButton(spellId) {
  let spell = spells[spellId];
  let buttonId = "button" +spellId;

  console.log(spellId);

  let button = document.createElement("button");
  button.id = buttonId;
  button.onclick = function() { 
    useSpell(spellId, player, monster);
    if(monster.currentHP > 0)
      monsterAttack();
    else
      isCombat = false;
  }

  button.innerHTML = 
        spell.displayName + 
        ", dmg: " + spell.dmg +
        ", mana cost: " + spell.manaCost;

  if(player.currentMP < spell.manaCost)
    button.disabled = true;

  return button;
}

function createBasicAttackButton() {
  let button = document.createElement("button");
  button.id = "basicAttackButton";
  button.onclick = function() { 
    basicAttack(player, monster); 
    if(monster.currentHP > 0)
      monsterAttack();
    else
      isCombat = false;
  }

  button.innerHTML = 
        "Basic Attack" + 
        ", dmg: " + player.basedmg +
        ", mana cost: 0";

  return button;
}

function usePotionButton() {
  let button = document.createElement("button");
  button.id = "usePotionButton";
  button.onclick = function() {
    if(player.phPotions > 0) {
      player.currentHP += 50;
      if(player.currentHP > player.maxHP)
        player.currentHP = player.maxHP;
      player.hpPotions -= 1;

      displayStats();
      drawGameTable();
    }
  }

  button.innerHTML = 
        "Use HP Potion" + 
        ", heal: 50"+
        ", remaing: " + player.hpPotions;

  if(player.hpPotions <=0)
    button.disabled = true;

  return button;
}

function monsterAttack() {
  if(monster.currentMP < monster.spell.manaCost)
    basicAttack(moster, player);
  else
    useSpell(monster.spell, monster, player)
}

function useSpell(spellId, caster, target) {
  let spell = spells[spellId];

  console.log(spell.displayName);
  if(caster.currentMP < spell.manaCost){
    log.unshift("Not enough mana to use this spell");
  }
  else {
    caster.currentMP -= spell.manaCost;

    console.log(target.resist[spell.type])
    let actualDmg = spell.dmg-target.resist[spell.type];
    if(actualDmg < 0) {
      log.unshift("Target resistent to this type of attack. No damage dealt.")
    }
    else {
      target.currentHP -= actualDmg;
      log.unshift(caster.displayName + " delt " + actualDmg + " damage to " + target.displayName + " with " + spell.displayName );
    }
  }

  displayStats();
  drawGameTable();
}

function basicAttack(caster, target){
  let actualDmg = caster.basedmg-target.resist[SpellType.Phisical];
  if(actualDmg < 0) {
    log.unshift("Target resistent to this type of attack. No damage dealt.")
  }
  else {
    target.currentHP -= actualDmg;
    log.unshift(caster.displayName + " delt " + actualDmg + " damage to " + target.displayName);
  } 

  displayStats();
  drawGameTable();
}