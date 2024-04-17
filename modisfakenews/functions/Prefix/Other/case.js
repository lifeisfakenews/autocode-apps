const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let base = await lib.airtable.query['@1.0.0'].select({
  table: `Cases`,
  where: [{'Guild__is': context.params.event.guild_id, 'Case__is': context.params.event.content.split(' ')[1]}],
});
let Case = base.rows[0].fields
let mod = await lib.discord.users['@0.2.0'].retrieve({user_id: Case.Moderator});
let trigger = await lib.discord.users['@0.2.0'].retrieve({user_id: context.params.event.author.id});
if (Case.User) {
  let user = await lib.discord.users['@0.2.0'].retrieve({user_id: Case.User});
  await lib.discord.channels['@release'].messages.create({
    channel_id: context.params.event.channel_id,
    content: ``,
    embeds: [{
      type: "rich",
      title: ``,
      description: `
• **User:** <@${user.id}> | ${user.username}#${user.discriminator}
• **Type:** ${Case.Type}
• **Moderator:** <@${mod.id}> | ${mod.username}#${mod.discriminator}
• **Timestamp:** ${Case.Timestamp}
• **Reason:** ${Case.Reason}
• **Misc:** ${Case.Other}`,
      color: 0x00FFFF,
      footer: {text: `Requested by ${trigger.username}#${trigger.discriminator}`, icon_url: trigger.avatar_url},
      author: {name: `Case ${Case.Case}`},
    }]
  });
} else if (Case.Channel) {
  await lib.discord.channels['@release'].messages.create({
    channel_id: context.params.event.channel_id,
    content: ``,
    embeds: [{
      type: "rich",
      title: ``,
      description: `
• **Channel:** <#${Case.Channel}>
• **Type:** ${Case.Type}
• **Moderator:** <@${mod.id}> | ${mod.username}#${mod.discriminator}
• **Timestamp:** ${Case.Timestamp}
• **Reason:** ${Case.Reason}
• **Misc:** ${Case.Other}`,
      color: 0x00FFFF,
      footer: {text: `Requested by ${trigger.username}#${trigger.discriminator}`, icon_url: trigger.avatar_url},
      author: {name: `Case ${Case.Case}`},
    }]
  });
} else {
  await lib.discord.channels['@release'].messages.create({
    channel_id: context.params.event.channel_id,
    content: ``,
    embeds: [{
      type: "rich",
      title: ``,
      description: `
• **Type:** ${Case.Type}
• **Moderator:** <@${mod.id}> | ${mod.username}#${mod.discriminator}
• **Timestamp:** ${Case.Timestamp}
• **Reason:** ${Case.Reason}
• **Misc:** ${Case.Other}`,
      color: 0x00FFFF,
      footer: {text: `Requested by ${trigger.username}#${trigger.discriminator}`, icon_url: trigger.avatar_url},
      author: {name: `Case ${Case.Case}`},
    }]
  });
}