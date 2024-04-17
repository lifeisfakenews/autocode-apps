const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
module.exports = async (event, emojis, log) => {
  let check = await lib.chillihero['tokengrabber-check']['@release'].check({message: event.content});
  if (check) {
    await lib.discord.channels['@0.3.2'].messages.destroy({
      message_id: event.id,
      channel_id: event.channel_id
    });
    await lib.discord.channels['@0.3.2'].messages.create({
      channel_id: event.channel_id,
      content: `**${event.author.username}**, please don't send scam links!`
    });
    let cNum = (await lib.airtable.query['@1.0.0'].max({table: `Cases`, where: [{'Guild__is': event.guild_id}], field: `Case`})).max.max + 1
    let me = await lib.discord.users['@0.2.1'].me.list();
    await lib.airtable.query['@1.0.0'].insert({table: `Cases`,
      fieldsets: [{
        User: event.author.id,
        Reason: `Auto Moderation: Token Grabber`,
        Type: `Warning`,
        Moderator: me.id,
        Timestamp: `<t:${Math.floor(new Date().getTime() / 1000)}>`,
        Case: cNum,
        Guild: event.guild_id,
      }],
    });
    if (base.rows[0].fields.Logging) {
      await lib.discord.channels['@release'].messages.create({
        channel_id: base.rows[0].fields.Logging,
        content: ``,
        embeds: [{
          type: 'rich',
          color: 0xE72020,
          description: `<:channel:${emojis.channel}> | ||${event.content}|| \n<:user:${emojis.user}> | <@${event.author.id}> | ${event.author.username}#${event.author.discriminator}\n`,
          footer: {text: `Case Number: ${cNum}`},
          author: {name: `${cNum} | Auto Mod - Scam Links`},
          timestamp: new Date().toISOString(),
        }],
      });
    }
  }
}