const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
await lib.discord.interactions['@release'].responses.create({token: context.params.event.token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
let trigger = await lib.discord.users['@release'].retrieve({user_id: context.params.event.member.user.id});
let guild_id = context.params.event.guild_id
let guildInfo = await lib.discord.guilds['@0.2.2'].retrieve({guild_id, with_counts: true,});
let channels = await lib.discord.guilds['@0.2.2'].channels.list({guild_id});
let owner = await lib.discord.users['@0.2.0'].retrieve({user_id: guildInfo.owner_id});
let textCh = channels.filter((channels) => channels.type === 0);
let voiceCh = channels.filter((channels) => channels.type === 2);
await lib.discord.interactions['@release'].followups.create({
  token: context.params.event.token,
  content: ``,
  embeds: [{
    type: 'rich',
    title: ` `,
    description: `
• **Owner:** <@${guildInfo.owner_id}> || ${owner.username}#${owner.discriminator}
• **ID:** ${guildInfo.id}
• **Member Count:** ${guildInfo.approximate_member_count}
• **Rules Channel:** ${guildInfo.rules_channel_id ? `<#${guildInfo.rules_channel_id}>` : `Not Set`}
• **Region:** ${guildInfo.region}
• **Boost:** ${guildInfo.premium_subscription_count}
• **Level:** ${guildInfo.premium_tier}`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    fields: [
      {name: `Roles - ${guildInfo.roles.length}`, value: guildInfo.roles.length ? guildInfo.roles.map((x) => `<@&${x.id}>\n`).join(' ') : 'No Roles', inline: true},
      {name: `Text Channels - ${textCh.length}`, value: textCh.length ? textCh.map((x) => `<#${x.id}>\n`).join(' ') : 'No Text Channels', inline: true},
      {name: `Voice Channels - ${voiceCh.length}`, value: voiceCh.length ? voiceCh.map((x) => `<#${x.id}>\n`).join(' ') : 'No Voice Channels', inline: true},
     ],
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'},
    author: {name: `Server Info`, icon_url: guildInfo.icon_url},
    thumbnail: {url: guildInfo.icon_url},
  }]
});