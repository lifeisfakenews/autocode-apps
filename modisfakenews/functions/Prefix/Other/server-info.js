const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let trigger = await lib.discord.users['@release'].retrieve({user_id: context.params.event.author.id});
let guild_id = context.params.event.guild_id
let guildInfo = await lib.discord.guilds['@0.2.2'].retrieve({guild_id, with_counts: true,});
let channels = await lib.discord.guilds['@0.2.2'].channels.list({guild_id});
let owner = await lib.discord.users['@0.2.0'].retrieve({user_id: guildInfo.owner_id});
let textCh = channels.filter((channels) => channels.type === 0);
let voiceCh = channels.filter((channels) => channels.type === 2);
await lib.discord.channels['@0.3.0'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: '',
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
• **Level:** ${guildInfo.premium_tier}
• **Roles:** ${guildInfo.roles.length}
• **Text Channels:** ${textCh.length}
• **Voice Channels:** ${voiceCh.length}
• **Categories:** ${channels.filter((channels) => channels.type === 4).length}`,
    color: 0x00FFFF,
    fields: [
      {name: `Roles - ${guildInfo.roles.length}`, value: guildInfo.roles.length ? guildInfo.slice(0, 86).roles.map((x) => `<@&${x.id}>\n`).join(' ') : 'No Roles', inline: true},
      {name: `Text Channels - ${textCh.length}`, value: textCh.length ? textCh.slice(0, 86).map((x) => `<#${x.id}>\n`).join(' ') : 'No Text Channels', inline: true},
      {name: `Voice Channels - ${voiceCh.length}`, value: voiceCh.length ? voiceCh.slice(0, 86).map((x) => `<#${x.id}>\n`).join(' ') : 'No Voice Channels', inline: true},
     ],
    footer: {text: `Requested by ${trigger.username}#${trigger.discriminator}`, icon_url: trigger.avatar_url},
    author: {name: `Server Info`, icon_url: guildInfo.icon_url},
    thumbnail: {url: guildInfo.icon_url},
  }]
});