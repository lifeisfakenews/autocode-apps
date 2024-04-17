const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let channel = await lib.utils.kv['@0.1.16'].get({key: `${context.params.event.guild_id}_channels`});//Get log channels
let messages = await lib.keyvalue.store['@0.1.16'].get({key: `${context.params.event.guild_id}_messages`, defaultValue: []});
message = messages.filter((m) => m.id == context.params.event.id)

let user = await lib.discord.users['@0.2.1'].retrieve({user_id: messages[0].author.id});

if (channel?.message || channel?.default) {
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: channel?.message || channel?.default,
    content: ``,
    embeds: [{
      type: 'rich',
      description: `
**ID:** ${context.params.event.id}
**Channel:** <#${context.params.event.channel_id}>
**Author:** ${message[0].author.username}#${message[0].author.discriminator} | <@${message[0].author.id}>
**Old Content:** \`${message[0].content}\`
**New Content:** \`${context.params.event.content}\``,
      color: 0x0f94d7,
      author: {name: `Message Updated`, icon_url: user.avatar_url},
      timestamp: new Date().toISOString(),
      footer: {text: `${user.username}#${user.discriminator}`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt'}
    }],
  });
}
messages = messages.filter((m) => m.id != context.params.event.id)
messages.push(context.params.event)

await lib.keyvalue.store['@0.1.16'].set({key: `${context.params.event.guild_id}_messages`, value: messages});