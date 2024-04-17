const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let emojis = await lib.utils.kv['@0.1.16'].get({key: `emojis`, defaultValue: {moderator: null, user: null, reason: null, channel: null, error: null, timeout: null, clock: null}});
let newEmojis = [
  {url: 'https://cdn.discordapp.com/attachments/911294620439293993/970581790945325066/moderator.png', name: 'moderator'},
  {url: 'https://cdn.discordapp.com/attachments/911294620439293993/970581791863885824/user.png', name: 'user'},
  {url: 'https://cdn.discordapp.com/attachments/911294620439293993/970581791238946816/reason.png', name: 'reason'},
  {url: 'https://cdn.discordapp.com/attachments/911294620439293993/970581790232305684/channel.png', name: 'channel'},
  {url: 'https://cdn.discordapp.com/attachments/911294620439293993/970581972005056532/error.png', name: 'error'},
  {url: 'https://cdn.discordapp.com/attachments/911294620439293993/970581791566086144/timeout.png', name: 'timeout'},
  {url: 'https://cdn.discordapp.com/attachments/911294620439293993/970581790630739968/clock.png', name: 'clock'},
]
for (let i = 0; i < newEmojis.length; i++) {
  let image = await lib.http.request['@1.1.6']({
    method: 'GET', 
    url: newEmojis[i].url
  });
  let emoji = await lib.discord.guilds['@0.2.4'].emojis.create({
    guild_id: process.env.EMOJI_GUILD,
    name: newEmojis[i].name, 
    image: image.body,
  });
emojis[newEmojis[i].name] = emoji.id
}
await lib.utils.kv['@0.1.16'].set({
  key: `emojis`,
  value: emojis
});