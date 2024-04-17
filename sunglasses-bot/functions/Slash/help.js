const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.interactions['@release'].responses.create({
  token: context.params.event.token,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  content: ``,
  components: [
    {type: 1, components: [
      {custom_id: `help`, placeholder: `Commands`, options: [
        {label: `Fun`, emoji: {name: `clown_sg`, id: `895484510051921940`}, value: `fun`, description: `Have some fun`},
        {label: `Economy`, emoji: {name: `money_sg`, id: `901183253237620788`}, value: `economy`, description: `Play a custom economy game in discord`},
        {label: `Other`, emoji: {name: `sb`, id: `935129411160797254`}, value: `other`, description: `Commands that might be useful`},
        //{label: `Music`, emoji: {name: `sbmusic`, id: `921731960412446740`}, value: `music`, description: `Listen to some music in a VC`},
        {label: `Moderation`, emoji: {name: `symbols_sg`, id: `896108705744035860`}, value: `mod`, description: `Moderators only!`},
      ], min_values: 1, max_values: 1, type: 3}
    ]}
  ],
  embeds: [{
    type: "rich",
    title: `Help Menu`,
    description: `Here is a list of my commands\n**Prefix:** \`?\`\n**Optional:** \`[]\`\n**Required:** \`<>\``,
    thumbnail: {url: `https://cdn.discordapp.com/attachments/911294620439293993/918549523561857134/SunglassesBot_main.png`},
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: `Help Menu`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/918549523561857134/SunglassesBot_main.png`},
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});