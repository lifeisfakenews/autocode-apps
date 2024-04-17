const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let subreddits = ['dankmemes', 'memes', 'ComedyCemetery', 'PrequelMemes', 'funny', 'AdviceAnimals', 'MemeEconomy', 'meme'];
let request = await lib.http.request['@1.1.6'].get({
  url: `https://meme-api.herokuapp.com/gimme/${subreddits[Math.floor(Math.random() * subreddits.length)]}`
});

await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  components: [{type: 1, components: [{type: 2, label: 'Next', style: 3, custom_id: 'meme-next'}]}],
  embeds: [{
    type: 'rich',
    description: `**Posted By:** ${request.data.author}\n **Upvotes:** ${request.data.ups}`,
    color: 0x00ffff,
    image: {url: request.data.url},
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {url: request.data.postLink, name: request.data.title, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/918549523561857134/SunglassesBot_main.png`},
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});