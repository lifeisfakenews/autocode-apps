const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const comma = require('comma-number')
const yts = require('yt-search');
let search = context.params.event.content.split(' ').slice(1).join(' ')
let results = await yts(search)
results = results.all.filter((r) => {return r.type == `video`})

await lib.discord.channels['@0.3.1'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `Search Results For **${search}**`,
  embeds: [{
    type: "rich",
    description: `${results[0].description}`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: results[0].title, url: results[0].url, icon_url: results[0].thumbnail},
    fields: [
      {name: 'Uploaded', value: results[0].ago, inline: true},
      {name: 'View', value: comma(results[0].views), inline: true},
      {name: 'Duration', value: results[0].timestamp, inline: true},
    ],
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }],
  components: [
    {type: 1, components: [{
      custom_id: `videos`, placeholder: `Videos`,
      options: results.slice(0,25).map((r) => {
        return {label: r.title, value: r.url, description: r.description?.slice(0,100) || `No Description.`}
      }),
      min_values: 1, max_values: 1, type: 3},
    ]},
    {type: 1, components: [
      {style: 1, label: `Add to Queue`, custom_id: `enqueue`, type: 2},
    ]},
  ]
});