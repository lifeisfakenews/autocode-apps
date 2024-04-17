const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let items = await lib.discord.contextmenu['@0.0.0'].items.list();//Keeps Other Context Menu Items
//let items = [];//Clears Other Context Menu Items
items.push({
  name: `Report`,
  type: 2
});
items.push({
  name: `User Info`,
  type: 2
});
items.push({
  name: `Warns`,
  type: 2
});
items.push({
  name: `Actions`,
  type: 2
});
await lib.discord.contextmenu['@0.0.0'].items.bulkOverwrite({items});