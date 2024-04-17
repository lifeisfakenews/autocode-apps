const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let bal = await lib.googlesheets.query['@0.3.0'].select({
  range: `UserData!A:Z`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': context.params.event.author.id}],
});
if (!bal?.rows?.length) {
  bal = await lib.googlesheets.query['@0.3.0'].insert({
    range: `UserData!A:Z`,
    fieldsets: [{
      'User': context.params.event.author.id,
      'Cash': 0,
      'Bank': 0
    }]
  });
}
await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  components: [
    {type: 1, components: [
      {custom_id: `jobs`, placeholder: `Select a Job`, options: [
        {label: `Discord Mod`, value: `Discord Mod`},
        {label: `Reddit Mod`,  value: `Reddit Mod`},
        {label: `Teacher`, value: `Teacher`},
        {label: `Lawyer`, value: `Lawyer`},
        {label: `Doctor`, value: `Doctor`},
        {label: `Actor/Actress`, value: `Actor`},
        {label: `Tech Support`, value: `Tech Support`},
        {label: `YouTuber`, value: `YouTuber`},
        {label: `Vet`, value: `Vet`},
        {label: `Taxi Driver`, value: `Taxi Driver`},
        {label: `Bus Driver`, value: `Bus Driver`},
        {label: `Train Driver`, value: `Train Driver`},
        {label: `Civil Service Worker`, value: `Civil Service`},
        {label: `Engineer`, value: `Engineer`},
        {label: `Shop Keeper`, value: `Shop Keeper`},
        {label: `Designer`, value: `Designer`},
        {label: `Developer`, value: `Developer`},
        {label: `Janitor`, value: `Janitor`},
        {label: `Librarian`, value: `Librarian`},
        {label: `Carpenter`, value: `Carpenter`},
      ], min_values: 1, max_values: 1, type: 3}
    ]}
  ],
  embeds: [{
    type: "rich",
    author: {name: `Select a Job`},
    description: bal.rows[0].fields.Job ? `You are currently working as a ${bal.rows[0].fields.Job}\nYou can change your job below` : `To be able to \`j!work\`, you need to get a job!\nSelect a job below`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});