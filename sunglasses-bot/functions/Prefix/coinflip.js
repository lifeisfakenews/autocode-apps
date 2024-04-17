const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let userSide = context.params.event.content.toLowerCase().split(' ')[1]
let actSide = Math.floor(Math.random() * 2).toString().replace('0', 'heads').replace('1', 'tails')

if (!userSide) {
  await lib.discord.channels['@release'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `The coin landed on ${actSide}`
  });
} else if (userSide == `heads` || userSide == `tails`) {
  await lib.discord.channels['@release'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `The coin landed on ${actSide}. You ${actSide == userSide ? `won!` : `lost :(`}`
  });
} else {
  await lib.discord.channels['@release'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `You must say either heads or tails!\nE.G. \`?coin-flip heads\``
  });
}