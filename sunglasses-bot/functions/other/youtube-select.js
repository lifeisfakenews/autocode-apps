const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
await lib.discord.interactions['@1.0.1'].responses.create({token: context.params.event.token, response_type: 'DEFERRED_UPDATE_MESSAGE'});
const comma = require('comma-number')
const ytsr = require('ytsr');
const usetube = require('usetube')
let results = await ytsr(context.params.event.data.values[0])
let description = await usetube.getVideoDesc(results.items[0].id)

await lib.discord.channels['@0.3.1'].messages.update({
  message_id: context.params.event.message.id,
  channel_id: context.params.event.channel_id,
  embeds: [{
    type: "rich",
    description: `${description.map((d) => d.text).join(' ').slice(0, 4096).replace('\n\n', '\n')}`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: results.items[0].title, url: results.items[0].url, icon_url: results.items[0].bestThumbnail.url},
    fields: [
      {name: 'Uploaded', value: results.items[0].uploadedAt, inline: true},
      {name: 'View', value: comma(results.items[0].views), inline: true},
      {name: 'Duration', value: results.items[0].duration, inline: true},
    ],
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }],
  components: context.params.event.message.components
});