const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let channel = await lib.discord.channels['@0.3.1'].retrieve({channel_id: context.params.event.message.channel_id});
let messageList = await lib.discord.channels['@0.2.2'].messages.list({channel_id: context.params.event.message.channel_id});

let messageArchive = messageList.reverse()
 .map((message) => {
  let displayText = [
    `${message.author.username}#${message.author.discriminator} | ${new Date(message.timestamp).getDate()}/${new Date(message.timestamp).getMonth() + 1}/${new Date(message.timestamp).getFullYear()}`,
    `${message.content}`,
  ];
  if (message.embeds?.length) {
    displayText.push(JSON.stringify(message.embeds, null, 2));
  }
  return displayText.join('\n');
 })
 .join('\n\n');

let ticket = await lib.googlesheets.query['@0.3.0'].update({
  range: `Tickets!A:F`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'Ticket__is': channel.name.split('｜')[1]}],
  fields: {
    'ClosedBy': context.params.event.member.user.id,
    'ClosedAt': `<t:${Math.floor(new Date().getTime() / 1000)}>`
  }
});

let user = await lib.discord.users['@0.2.0'].retrieve({user_id: ticket.rows[0].fields.OpenedBy});
await lib.discord.channels['@release'].messages.create({
  channel_id: `902093438063894598`,
  content: ``,
  embeds: [{
    type: "rich",
    description: `**Ticket:** ${ticket.rows[0].fields.Ticket}
**Opened By:** <@${ticket.rows[0].fields.OpenedBy}> | ${user.username}#${user.discriminator}
**Opened At:** ${ticket.rows[0].fields.OpenedAt}
**Reason:** ${ticket.rows[0].fields.Reason}
**Closed By:** <@${context.params.event.member.user.id}> | ${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}
**Closed At:** ${ticket.rows[0].fields.ClosedAt}`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: `Tickets Archive`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/918549523561857134/SunglassesBot_main.png`},
    footer: {text: `SunglassesBot Tickets`, icon_url: `https://media.discordapp.net/attachments/901430270849347604/902091602816811028/tickets.png`}
  }],
  attachments: [{
    filename: `messages.txt`,
    file: Buffer.from(messageArchive),
  }]
});
await lib.discord.channels['@0.3.0'].destroy({channel_id: context.params.event.channel_id});