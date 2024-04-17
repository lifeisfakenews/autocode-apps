const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let userSide = context.params.event.data.options[0]?.value
let actSide = Math.floor(Math.random() * 2).toString().replace('0', 'heads').replace('1', 'tails')

if (!userSide) {
  await lib.discord.interactions['@release'].responses.create({
    token: context.params.event.token,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: `The coin landed on ${actSide}`
  });
} else {
  await lib.discord.interactions['@release'].responses.create({
    token: context.params.event.token,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: `The coin landed on ${actSide}. You ${actSide == userSide ? `won!` : `lost :(`}`
  });
}