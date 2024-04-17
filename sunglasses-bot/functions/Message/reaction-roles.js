const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let channel_id = `895904248594837514`
var message = await lib.discord.channels['@release'].messages.create({channel_id,
  content: ``,
  embeds: [{
    type: "rich",
    description: `
<:one:971452334179778570> - <@&895910620749258772>
<:two:971452417684148254> - <@&895910621411942460>
<:three:971452394422554664> - <@&895911824342519858>
<:four:971452298352001076> - <@&895911824904560652>
<:five:971452298406547456> - <@&895911826267713566>
<:six:971452362302566411> - <@&895911841279139860>`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: `Reaction Roles`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/918549523561857134/SunglassesBot_main.png`},
  }]
});
var emojis = [':one:971452334179778570', ':two:971452417684148254', ':three:971452394422554664', ':four:971452298352001076', ':five:971452298406547456', ':six:971452362302566411']
for (let i = 0; i < emojis.length; i++) {
  await lib.discord.channels['@0.3.1'].messages.reactions.create({
    emoji: emojis[i],
    message_id: message.id,
    channel_id: message.channel_id
  });
}
var message = await lib.discord.channels['@release'].messages.create({channel_id,
  content: ``,
  embeds: [{
    type: "rich",
    description: `
🗳️ - <@&900425318513381388>
📢 - <@&895910603032510474>
🎉 - <@&895910603833634816>
<:robot_sg:994231800446595102> - <@&902827371462271038>
📣 - <@&895910604534075412>`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: `Reaction Roles`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/918549523561857134/SunglassesBot_main.png`},
  }]
});
var emojis = ['🗳️', '📢', '🎉', ':robot_sg:994231800446595102', '📣']
for (let i = 0; i < emojis.length; i++) {
  await lib.discord.channels['@0.3.1'].messages.reactions.create({
    emoji: emojis[i],
    message_id: message.id,
    channel_id: message.channel_id
  });
}