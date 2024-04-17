const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const {Chess} = require('chess.js');
const chess = new Chess()
let game = await lib.utils.kv['@0.1.16'].get({key: `${context.params.event.channel_id}_chess`});
if (game) 
  return lib.discord.channels['@0.3.2'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `**${context.params.event.author.username}** there is already a game in this channel!`
  });

if (!context.params.event.mentions.length)
  return lib.discord.channels['@0.3.2'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `**${context.params.event.author.username}**, you need to mention someone to play with!`
  });
if (context.params.event.mentions[0].id == context.params.event.author.id)
  return lib.discord.channels['@0.3.2'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `**${context.params.event.author.username}**, you can't play with yourself!`
  });
if (context.params.event.mentions[0].bot)
  return lib.discord.channels['@0.3.2'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `**${context.params.event.author.username}**, you can't play with a bot!`
  });

let code = context.params.event.content.split(' ').slice(2).join(' ')
if (code && chess.validate_fen(code).valid) {
  chess.load(code)
  await lib.discord.channels['@0.3.2'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `<@${context.params.event.mentions[0].id}>`,
    components: [{
      type: 1,
      components: [
        {type: 2, style: 3, label: `Yes`, custom_id: `chess-start`},
        {type: 2, style: 4, label: `No`, custom_id: `chess-nostart`}
      ]
    }],
    embeds: [{
      type: "rich",
      author: {name: `Chess`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/995617018499846194/chess.png`},
      description: `<@${context.params.event.mentions[0].id}>, <@${context.params.event.author.id}> has challenged you to a game of chess with the following board! Do you want to play?
\`\`\`${chess.ascii()
.replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙')
.replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎')
.replace('R', '♜').replace('R', '♜').replace('r', '♖').replace('r', '♖')
.replace('N', '♞').replace('N', '♞').replace('n', '♘').replace('n', '♘')
.replace('B', '♝').replace('B', '♝').replace('b', '♗').replace('b', '♗')
.replace('K', '♛').replace('k', '♕')
.replace('Q', '♚').replace('q', '♔')
}\`\`\`
\`\`\`FEN: ${chess.fen()}\`\`\``,
      color: 0x2f3136,
      timestamp: new Date().toISOString(),
      footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
} else {
  await lib.discord.channels['@0.3.2'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `<@${context.params.event.mentions[0].id}>`,
    components: [{
      type: 1,
      components: [
        {type: 2, style: 3, label: `Yes`, custom_id: `chess-start`},
        {type: 2, style: 4, label: `No`, custom_id: `chess-nostart`}
      ]
    }],
    embeds: [{
      type: "rich",
      author: {name: `Chess`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/995617018499846194/chess.png`},
      description: `<@${context.params.event.mentions[0].id}>, <@${context.params.event.author.id}> has challenged you to a game of chess! Do you want to play?`,
      color: 0x2f3136,
      timestamp: new Date().toISOString(),
      footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
}