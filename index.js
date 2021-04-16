var gameTable = new Array();
var log = new Array();

var playerPos = 0;
var treeOfLife;
var monsterPositions = new Array(9);

var isCombat = false;
var isPlayerAlive = true;
var isGameStarted = false;

var player = new Object();
var monster = new Object();

const Class = {
  Mage: "Mage",
  Warrior: "Warrior"
}

const MonsterType = {
  SmallGoblin: 0,
  GoblinSorcerer: 1
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
  PoisonDart: 3,
  HeavySlash: 4,
  Smash: 5
}

var spells = {
    0: {
      displayName: "Fireball",
      type: SpellType.Fire,
      manaCost: 38,
      dmg: 80
    },
    1: {
      displayName: "Ice Arrow",
      type: SpellType.Ice,
      manaCost: 30,
      dmg: 65
    },
    2: {
      displayName: "Mind Control",
      type: SpellType.Mind,
      manaCost: 50,
      dmg: 100
    },
    3: {
      displayName: "Poison Dart",
      type: SpellType.Poison,
      manaCost: 12,
      dmg: 50
    },
    4: {
      displayName: "Heavy Slash",
      type: SpellType.Phisical,
      manaCost: 18,
      dmg: 90
    },
    5: {
      displayName: "Smash",
      type: SpellType.Phisical,
      manaCost: 15,
      dmg: 80
    }
  };

var monsters = {
  0: {
  displayName: "Small Goblin",
  maxHP: 120,
  currentHP: 120,
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
},
1: {
  displayName: "Goblin Sorcerer",
  maxHP: 100,
  currentHP: 100,
  maxMP: 50,
  currentMP: 20,
  basedmg: 10,
  resist: {
    0: 30,
    1: 18,
    2: 10,
    3: 8,
    4: 12
  },
  avatarPath: "resources/goblinMage.png",
  spell: SpellId.Fireball
  }
}

var playerTypes = {
  0 : {
  displayName: "You",
  class: Class.Mage,
  maxHP: 200,
  currentHP: 200,
  maxMP: 300,
  currentMP: 300,
  basedmg: 20,
  resist: {
    0: 8,
    1: 8,
    2: 12,
    3: 2,
    4: 4
  },
  portraitPath: "resources/femaleMage.jpeg",
  avatarPath: "resources/femaleMageFull.png",
  spells: [
    SpellId.Fireball,
    SpellId.IceArrow,
    SpellId.MindControl
  ],
  hpPotions: 3,
  canRest: true
  },
  1 : {
    displayName: "You",
    class: Class.Warrior,
    maxHP: 500,
    currentHP: 500,
    maxMP: 100,
    currentMP: 100,
    basedmg: 40,
    resist: {
      0: 8,
      1: 8,
      2: 2,
      3: 12,
      4: 15
    },
    portraitPath: "resources/maleWarrior.jpeg",
    avatarPath: "resources/maleWarriorFull.png",
    spells: [
      SpellId.PoisonDart,
      SpellId.HeavySlash,
      SpellId.Smash
    ],
    hpPotions: 3,
    canRest: true
  }
}

const Actor = {
  Player: 0,
  Tree: 1,
  SmallGoblin: 2,
  GoblinSorcerer: 3,
  Empty: 4
}

document.addEventListener('keydown', function(event) {
  
  if(!isCombat && isPlayerAlive)
  {
    if((event.keyCode == 68)) //right direction - press 'D'
    {
      movementRight();
    }else if((event.keyCode == 65)) //left direction - press 'A'
    {
      movementLeft();
    }
  }
 });

function mapInitialization(playerClass){
  player = playerTypes[playerClass];

  isPlayerAlive = true;
  playerPos = 0;
  
  let counter = 0;

  //replaced 50 with 49. You only have 49 index to place monsters. 49 is the last index in the array.
  treeOfLife = Math.floor(Math.random() * 20) + 13; // number from 1..50 can't be player's initial position 
  
  while (counter < 10)
  {
    let rndPos = Math.floor(Math.random() * 49) + 1;
    if(!monsterPositions.includes(rndPos) && treeOfLife != rndPos) { // 10 unique monster position
      counter += 1;
      monsterPositions[counter] = rndPos;
    }
  }
  
}

function startGame(playerClass){
  mapInitialization(playerClass);
  generateTable();
  displayStats();
}

function initNewStage(){
  for(let x = 0; x <= 50; ++x){
    gameTable[x] = Actor.Empty;
  }

  for (let x = 0; x <= monsterPositions.length; ++x){
    if(playerPos == monsterPositions[x]) {
      monster = Math.random() < 0.5 ? monsters[0] : monsters[1];
      startCombat();
    }
    gameTable[monsterPositions[x]] = Actor.Monster;
  }

  gameTable[treeOfLife] = Actor.Tree;
  gameTable[playerPos] = Actor.Player;

  if(playerPos == treeOfLife)
    rest();
}

function rest(){
  if(player.canRest) {
    player.currentHP = player.maxHP;
    player.currentMP = player.maxMP;
    player.canRest = false;
    log.unshift({msg: "Tree of Life blessed you. HP and mana restored to maximum.", color: "green"});

    displayStats();
    drawCombatTable();
  }
  else {
    log.unshift({msg: "You've been already blessed by the Tree of Life.", color: "orange"});
    drawCombatTable();
  }
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
  document.getElementById("startMageButton").style.display = "none";
  document.getElementById("startWarriorButton").style.display = "none";

  initNewStage();

  let table = document.createElement("table");
  table.id = "gameTable";
  table.style.width = "100vh";
  table.style.backgroundImage = "resources/backgroundForest.jpg";
  let row = table.insertRow();

  for(let object of gameTable){
    let cell = row.insertCell();
    let img = document.createElement("img");
    img.src = loadImg(object);
    img.style.width ="1.72vw";
    img.style.height = "6vh";
    cell.append(img);
  }

  document.getElementById("gameTable").innerHTML = table.innerHTML;

}

function displayStats(){

  let table = document.createElement("table");
  table.id = "statTable";
  let row = table.insertRow();

  let cell = row.insertCell();
  let img = document.createElement("img");
  img.src = player.portraitPath;
  img.style.height = "21vh";
  cell.append(img);
  cell.rowSpan = 9;

  cell = row.insertCell();
  cell.innerText = "Class:";
  cell = row.insertCell();
  cell.innerText = player.class;

  row = table.insertRow();
  cell = row.insertCell();
  cell.innerText = "HP:";
  cell = row.insertCell();
  cell.innerText = player.currentHP + "/" + player.maxHP;


  row = table.insertRow();
  cell = row.insertCell();
  cell.innerText = "MP:";
  cell = row.insertCell();
  cell.innerText = player.currentMP + "/" + player.maxMP;


  row = table.insertRow();
  cell = row.insertCell();
  cell.innerText = "Fire Resistance:";
  cell = row.insertCell();
  cell.innerText = player.resist[SpellType.Fire];


  row = table.insertRow();
  cell = row.insertCell();
  cell.innerText = "Ice Resistance:";
  cell = row.insertCell();
  cell.innerText = player.resist[SpellType.Ice];


  row = table.insertRow();
  cell = row.insertCell();
  cell.innerText = "Mind Control Resistance:";
  cell = row.insertCell();
  cell.innerText = player.resist[SpellType.Mind];


  row = table.insertRow();
  cell = row.insertCell();
  cell.innerText = "Poison Resistance:";
  cell = row.insertCell();
  cell.innerText = player.resist[SpellType.Poison];


  row = table.insertRow();
  cell = row.insertCell();
  cell.innerText = "Phisical Resistance:";
  cell = row.insertCell();
  cell.innerText = player.resist[SpellType.Phisical];

   document.getElementById("statTable").innerHTML = table.innerHTML; 

}

function loadImg(cell) {
  switch(cell) {
    case Actor.Player:
      return "resources/hero.jpeg";
      break;
    case Actor.Tree:
      return "resources/TreeOfLife.jpg";
      break;
    case Actor.Monster:
      return "resources/yellow.png";
      break;
    default:
      return "resources/road.png";
  } 
}

function startCombat(){
  isCombat = true;
  monster.currentHP = monster.maxHP;
  monster.currentMP = monster.maxMP;

  //TODO: Set different type of monster here;

  console.log(monster.currentMP);
  log.unshift({msg : monster.displayName + " has appeared.", color: "yellow"});

  drawCombatTable(monster);
}

function drawCombatTable(){
  let table = document.createElement("table");
  table.id = "combatTable";
  table.style.textAlign = "center";
  table.style.width = "100vw";
  let row = table.insertRow();

  let cell = row.insertCell();
  let img = document.createElement("img");
  img.src = player.avatarPath;
  img.style.height = "40vh";
  cell.append(img);

  cell = row.insertCell();
  img = document.createElement("img");
  img.src = monster.avatarPath;
  img.style.height = "40vh";
  cell.style.width = "50vw";
  cell.append(img);

  row = table.insertRow();
  cell = row.insertCell();
  cell = row.insertCell();
  cell.style.color = "#f2e60e";
  cell.style.fontWeight = 1000;
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
  cell.style.backgroundColor = "#aa999e";
  cell.style.textAlign = "left";
  cell.append(createLogList());


  let cTable = document.getElementById("combatTable");
  cTable.remove();

  document.getElementById("actualGame").appendChild(table);  
  //document.getElementById("combatTable").innerHTML = table.innerHTML;
}

function createLogList(){
  let list = document.createElement("ul");

  for(let e of log){
    let li = document.createElement("li");
    li.innerText = e.msg;
    li.style.color = e.color;
    list.appendChild(li);
  }

  return list;
}

function createSpellButton(spellId) {
  let spell = spells[spellId];
  let buttonId = "button" +spellId;

  let button = document.createElement("button");
  button.id = buttonId;
  button.onclick = function() { 
    useSpell(spellId, player, monster);
    if(monster.currentHP > 0) {
      monsterAttack();
    }
    else {
      monsterDefeated();
    }
  }

  button.innerHTML = 
        spell.displayName + 
        ", dmg: " + spell.dmg +
        ", mana cost: " + spell.manaCost;

  if(player.currentMP < spell.manaCost || !isCombat)
    button.disabled = true;

  return button;
}

function createBasicAttackButton() {
  let button = document.createElement("button");
  button.id = "basicAttackButton";
  button.onclick = function() { 
    basicAttack(player, monster); 
    if(monster.currentHP > 0){
      monsterAttack();
    }
    else {
      monsterDefeated();
    }
  }

  button.innerHTML = 
        "Basic Attack" + 
        ", dmg: " + player.basedmg +
        ", mana cost: 0";

  if(!isCombat)
    button.disabled = true;

  return button;
}

function usePotionButton() {
  let button = document.createElement("button");
  button.id = "usePotionButton";
  button.onclick = function() {
    if(player.hpPotions > 0) {
      player.currentHP += 50;
      if(player.currentHP > player.maxHP)
        player.currentHP = player.maxHP;
      player.hpPotions -= 1;

      log.unshift({msg: "HP potion used. 50 damage healed.", color : "green"});

      if(isCombat)
        monsterAttack();

      displayStats();
      drawCombatTable();
    }
  }

  button.innerHTML = 
        "Use HP Potion" + 
        ", heal: 50"+
        ", remaing: " + player.hpPotions;

  if(player.hpPotions <=0 || !isPlayerAlive)
    button.disabled = true;

  return button;
}

function monsterDefeated(){
  monster.currentHP = 0;
  monsterPositions.splice (monsterPositions.indexOf(playerPos), 1);
  log.unshift({msg: monster.displayName + " has been defeated.", color: "orange"});
  isCombat = false;
  drawCombatTable();
}

function monsterAttack() {

  let spell = spells[monster.spell];
  if(monster.currentMP < spell.manaCost)
    basicAttack(monster, player);
  else
    useSpell(monster.spell, monster, player)

  if(player.currentHP <= 0) {
      player.currentHP = 0;
      isPlayerAlive = false;
      isCombat = false;

      log.unshift({msg: monster.displayName + " killed you. Your andventure has ended. :\"("})

      displayStats();
      drawCombatTable();


      document.getElementById("startGameButton").style.display = "initial";
  }
}

function useSpell(spellId, caster, target) {
  let spell = spells[spellId];

  if(caster.currentMP < spell.manaCost){
    log.unshift({msg : "Not enough mana to use this spell", color : "orange"});
  }
  else {
    caster.currentMP -= spell.manaCost;

    let spellDmg = caster == monster ? spell.dmg / 2 : spell.dmg;
    let actualDmg = spellDmg-target.resist[spell.type];
    if(actualDmg < 0) {
      log.unshift({msg :target.displayName + "received no damage. Target is resistent.", color: "orange"})
    }
    else {
      target.currentHP -= actualDmg;
      let msg = caster.displayName + " dealt " + actualDmg + " damage to " + target.displayName + " with " + spell.displayName;
      let color = target == player ? "red" : "blue";

      log.unshift({msg: msg, color: color});
    }
  }

  displayStats();
  drawCombatTable();
}

function basicAttack(caster, target){
  let actualDmg = caster.basedmg-target.resist[SpellType.Phisical];
  if(actualDmg < 0) {
    log.unshift({msg: target.displayName + "received no damage. Target is resistent.", color: "orange"});
  }
  else {
    target.currentHP -= actualDmg;
    let msg = caster.displayName + " dealt " + actualDmg + " damage to " + target.displayName;
    let color = target == player ? "red" : "blue";

    log.unshift({msg: msg, color: color});
  } 

  displayStats();
  drawCombatTable();
}