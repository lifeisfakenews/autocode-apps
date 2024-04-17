const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let channel = await lib.utils.kv['@0.1.16'].get({key: `${context.params.event.guild_id}_channels`});//Get log channels

if (channel?.invite || channel?.default) {
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: channel?.invite || channel?.default,
    content: ``,
    embeds: [{
      type: 'rich',
      description: `
**Code:** https://discord.gg/${context.params.event.code} | ${context.params.event.code}
**Max Uses:** ${context.params.event.max_uses}
**Expires in:** \`${context.params.event.max_age / 60}m\`
**Channel:** <#${context.params.event.channel_id}>`,
      color: 0x41CF3C,
      author: {name: `Invite Created`, icon_url: context.params.event.inviter.avatar_url},
      timestamp: new Date().toISOString(),
      footer: {text: `${context.params.event.inviter.username}#${context.params.event.inviter.discriminator}`, icon_url: context.params.event.inviter.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.inviter.id}/${context.params.event.inviter.avatar}.${context.params.event.inviter.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }],
  });
}