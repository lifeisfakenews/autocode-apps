const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let event = context.params.event;
const { guild_id, channel_id, token } = event;
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': guild_id}]});
if (!base.rows[0]) {await lib.airtable.query['@1.0.0'].insert({table: `Config`, fieldsets: [{'Guild': guild_id}]});}
let capCheck = await lib.airtable.query['@1.0.0'].select({table: `Captcha`, where: [{'User__is': event.author.id, 'Guild__is': guild_id}]});
if (channel_id != base.rows[0].fields.Verify) return
let message
if (context.params.event.member.roles.includes(base.rows[0].fields.Member)) {
  message = await lib.discord.channels['@release'].messages.create({channel_id, content: `**${event.author.username}**, are already verified.`});
} else if (!capCheck.rows.length) {
  message = await lib.discord.channels['@release'].messages.create({channel_id, content: `**${event.author.username}**, you need to get a captcha. Please check pinned messages`});
} else if (new Date() > capCheck.rows[0].fields.Time) {
  message = await lib.discord.channels['@release'].messages.create({channel_id, content: `**${event.author.username}**, this captcha has expired. Please get another one.`});
  await lib.airtable.query['@1.0.0'].delete({table: `Captcha`, where: [{'User__is': event.author.id, 'Guild__is': guild_id}]});
}  else if (capCheck.rows[0].fields.Key == event.content.split(' ')[1]) {
  message = await lib.discord.channels['@release'].messages.create({channel_id, content: `**${event.author.username}**, you have been verifed.`});
  await lib.discord.guilds['@release'].members.roles.update({role_id: base.rows[0].fields.Member, user_id: event.author.id, guild_id});
  await lib.airtable.query['@1.0.0'].delete({table: `Captcha`, where: [{'User__is': event.author.id, 'Guild__is': guild_id}]});
} else {
  message = await lib.discord.channels['@release'].messages.create({channel_id, content: `Incorrect. Please try again please try again.`});
}
await sleep(10000);
await lib.discord.channels['@release'].messages.destroy({message_id: event.id, channel_id});
await lib.discord.channels['@release'].messages.destroy({message_id: message.id, channel_id});