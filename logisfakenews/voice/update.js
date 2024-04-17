const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async (event, channel) => {
  let audit = await lib.discord.guilds['@0.2.3'].auditLogs.list({guild_id: event.guild_id, action_type: 24, limit: 1});//Get audit log data
  let user
  if (audit.audit_log_entries?.length)
    user = await lib.discord.users['@0.2.0'].retrieve({user_id: audit.audit_log_entries[0].user_id});//Get user data
  
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: channel,
    content: ``,
    embeds: [{
      type: 'rich',
      description: `
**Channel:** <#${event.channel_id}>
**Deafened:** ${event.deaf ? `Yes` : `No`}
**Muted:** ${event.mute ? `Yes` : `No`}
**Self Deafened:** ${event.self_deaf ? `Yes` : `No`}
**Self Muted:** ${event.self_mute ? `Yes` : `No`}
**Supressed:** ${event.supress ? `Yes` : `No`}
**Video:** ${event.self_video ? `On` : `Off`}
${user ? `**Moderator:** ${user.username}#${user.discriminator} | <@${user.id}>` : ``}`,
      color: 0x41CF3C,
      author: {name: `User VC State Updated`, icon_url: event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${event.member.user.id}/${event.member.user.avatar}.${event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'},
      timestamp: new Date().toISOString(),
      footer: {text: `${event.member.user.username}#${event.member.user.discriminator}`, icon_url: event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${event.member.user.id}/${event.member.user.avatar}.${event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }],
  });
}