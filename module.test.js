const all = require('./index');
const vars = all.vars
const functions = all.functions;

test('Use potion full HP', () => {
	vars.player = vars.playerTypes[1];
	let hpBefore = vars.player.currentHP;
	functions.usePotion();
	expect(hpBefore).toBe(vars.player.currentHP);
});

test('Use potion 30 hp missing', () => {
	vars.player = vars.playerTypes[1];
	expect(vars.player.currentHP).toBe(500)
	vars.player.currentHP -= 30;
	functions.usePotion();
	expect(vars.player.currentHP).toBe(vars.player.maxHP);
	vars.player.currentHP = vars.player.maxHP;
});

test('Use potion 100 HP missing', () => {
	vars.player = vars.playerTypes[1];
	vars.player.currentHP -= 100;
	functions.usePotion();
	expect(vars.player.currentHP).toBe(450);
	vars.player.currentHP = vars.player.maxHP;
});

test('Use potion 4 times', () => {
	vars.player = vars.playerTypes[1];
	vars.player.currentHP -= 200;
	functions.usePotion();
	functions.usePotion();
	functions.usePotion();
	functions.usePotion();
	expect(vars.player.currentHP).toBe(450);
	vars.player.currentHP = vars.player.maxHP;
});


test('Rest wounded', () => {
	vars.player = vars.playerTypes[1];
	vars.player.currentHP -= 200;
	vars.player.currentMP -= 10;
	functions.rest();
	expect(vars.player.currentHP).toBe(500);
	vars.player.currentHP -= 200;
	functions.rest();
	expect(vars.player.currentHP).toBe(300);
	vars.player.currentHP = vars.player.maxHP;
});

test('Rest with full stats, rest again wounded', () => {
	vars.player = vars.playerTypes[1];
	functions.rest();
	vars.player.currentHP -= 200;
	expect(vars.player.canRest).toBe(true);
	functions.rest();
	expect(vars.player.currentHP).toBe(500);
	vars.player.currentHP = vars.player.maxHP;
});

test('Rest wounded spent mana, rest again wounded', () => {
	vars.player = vars.playerTypes[1];
	vars.player.currentHP -= 200;
	vars.player.currentMP -= 10;
	functions.rest();
	expect(vars.player.currentHP).toBe(500);
	expect(vars.player.canRest).toBe(false);
	vars.player.currentHP -= 200;
	functions.rest();
	expect(vars.player.currentHP).toBe(300);
	vars.player.currentHP = vars.player.maxHP;
});

test('Rest wounded, rest again wounded', () => {
	vars.player = vars.playerTypes[1];
	vars.player.currentHP -= 200;
	functions.rest();
	expect(vars.player.currentHP).toBe(500);
	expect(vars.player.canRest).toBe(false);
	vars.player.currentHP -= 200;
	functions.rest();
	expect(vars.player.currentHP).toBe(300);
	vars.player.currentHP = vars.player.maxHP;
});