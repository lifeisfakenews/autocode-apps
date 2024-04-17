const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const {Chess} = require('chess.js');
const chess = new Chess()
let check = await lib.utils.kv['@0.1.16'].get({key: `${context.params.event.channel_id}_chess`});
if (check)
  return lib.discord.interactions['@0.0.0'].responses.create({
    token: context.params.event.token,
    content: `**${context.params.event.member.user.username}** there is already a game in this server!`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });
if (context.params.event.member.user.id != context.params.event.message.mentions[0].id && !context.params.event.message.embeds[0].description.includes(context.params.event.member.user.id))
  return lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: context.params.event.token,
    content: `Its not your game!`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });
if (context.params.event.member.user.id != context.params.event.message.mentions[0].id)
  return lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
    token: context.params.event.token,
    content: `You can't start the game!`,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
  });

await lib.discord.interactions['@1.0.1'].responses.create({
  token: context.params.event.token,
  content: `Chess game started!`,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE'
});

let white = await lib.discord.users['@0.2.1'].retrieve({user_id: context.params.event.message.mentions[0].id});
let black = await lib.discord.users['@0.2.1'].retrieve({user_id: context.params.event.message.embeds[0].description.split(' ')[1]});
if (context.params.event.message.embeds[0].description.includes('with the following board')) {
  chess.load(context.params.event.message.embeds[0].description.split('FEN: ')[1].split('`')[0])
}
let thread = await lib.discord.channels['@0.3.0'].threads.create({
  channel_id: context.params.event.channel_id,
  name: `Chess ${white.username} VS ${black.username}`,
  auto_archive_duration: 1440,
  message_id: context.params.event.message.id
});
await lib.discord.channels['@0.3.0'].threads.members.create({thread_id: thread.id, user_id: white.id});
await lib.discord.channels['@0.3.0'].threads.members.create({thread_id: thread.id, user_id: black.id});

await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: thread.id,
  content: `<@${white.id}>`,
  embeds: [{
    type: "rich",
    author: {name: `${white.username} VS ${black.username}`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/995617018499846194/chess.png`},
    description: `♟︎  - ${white.username}#${white.discriminator}\n♙ - ${black.username}#${black.discriminator}\n\nIt is **${white.username}#${white.discriminator}**'s go
\`\`\`${chess.ascii()
.replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙').replace('p', '♙')
.replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎').replace('P', '♟︎')
.replace('R', '♜').replace('R', '♜').replace('r', '♖').replace('r', '♖')
.replace('N', '♞').replace('N', '♞').replace('n', '♘').replace('n', '♘')
.replace('B', '♝').replace('B', '♝').replace('b', '♗').replace('b', '♗')
.replace('K', '♛').replace('k', '♕')
.replace('Q', '♚').replace('q', '♔')
}\`\`\``,
    color: 0xffffff,
    timestamp: new Date().toISOString(),
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});
await lib.utils.kv['@0.1.16'].set({
  key: `${thread.id}_chess`,
  value: {
    white: white,
    black: black,
    board: chess.fen()
  }
});