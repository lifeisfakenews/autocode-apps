const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let items = [
  `It is certain.`,
  `It is decidedly so.`,
  `Without a doubt.`,
  `Yes definitely.`,
  `You may relyon it.`,
  `As I see it, yes.`,
  `Most likely.`,
  `Outlook good.`,
  `Yes.`,
  `Signs point to yes.`,
  `Reply hazy, try again.`,
  `Ask again later.`,
  `Better not tell you now.`,
  `Cannot predict now.`,
  `Concentrate and try again.`,
  `Don't count on it.`,
  `My reply is no.`,
  `My sources say no.`,
  `Outlook not so good.`,
  `Very doubtful.`
];
await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
  content: items[Math.floor(Math.random() * items.length)]
});