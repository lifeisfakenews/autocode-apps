const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async (event, channel) => {
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
**Video:** ${event.self_video ? `On` : `Off`}`,
      color: 0x41CF3C,
      author: {name: `User Joined VC`, icon_url: event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${event.member.user.id}/${event.member.user.avatar}.${event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'},
      timestamp: new Date().toISOString(),
      footer: {text: `${event.member.user.username}#${event.member.user.discriminator}`, icon_url: event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${event.member.user.id}/${event.member.user.avatar}.${event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }],
  });
}