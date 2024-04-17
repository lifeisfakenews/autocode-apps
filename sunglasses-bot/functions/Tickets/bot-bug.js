const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let tickets = await lib.googlesheets.query['@0.3.0'].count({
  range: `Tickets!A:F`,
  bounds: 'FIRST_EMPTY_ROW',
});
let user = await lib.discord.users['@0.0.6'].retrieve({user_id: context.params.event.member.user.id});
let channel = await lib.discord.guilds['@0.1.0'].channels.create({
  guild_id: context.params.event.guild_id,
  name: `📩｜${tickets?.count + 1 || 0}｜${context.params.event.member.user.username}`,
  topic: `Opened by: ${context.params.event.member.user.username}. Reason: Bot Problem.`,
  permission_overwrites: [
    {id: context.params.event.guild_id, type: 0, deny: `${1 << 10}`},
    {id: process.env.TICKET_ROLE, type: 0, allow: `${1 << 10}`},
    {id: context.params.event.member.user.id, type: 1, allow: `${1 << 10}`},
  ],
});
let message = await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: channel.id,
  content: `Ticket has been created for reason: Bot Problem`,
  components: [{type: 1, components: [{style: 4, label: `🔒  Close`, custom_id: `ticket-close`, type: 2}]}]
});
await lib.googlesheets.query['@0.3.0'].insert({
  range: `Tickets!A:F`,
  fieldsets: [{
    'Ticket': tickets?.count + 1 || 0,
    'OpenedBy': context.params.event.member.user.id,
    'Reason': `Bot Problem`,
    'OpenedAt': `<t:${Math.floor(new Date().getTime() / 1000)}>`
  }]
});