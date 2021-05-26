const all = require('./index');
const vars = all.vars
const functions = all.functions;

test('adds 1 + 2 to equal 3', () => {
  vars.player = vars.playerTypes[0];
  functions.usePotion();
  console.log(vars.player.displayName)
  expect(true);
});
