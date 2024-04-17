const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@release'].messages.create({
  channel_id: `896652560595845130`,
  content: ``,
  components: [
    {type: 1, components: [
      {style: 2, label: `Report a Problem`, custom_id: `ticket-problem`, type: 2},
      {style: 2, label: `Suggestion`, custom_id: `ticket-suggestion`, type: 2},
      {style: 2, label: `Other`, custom_id: `ticket-other`, type: 2}
    ]},
    {type: 1, components: [
      {style: 2, label: `Bot Problem`, custom_id: `ticket-bot-problem`, type: 2},
      {style: 2, label: `Bot Suggestion`, custom_id: `ticket-bot-suggestion`, type: 2}
    ]},
  ],
  embeds: [{
    type: "rich",
    description: `**Report a Problem** - Report a problem with the server
**Suggestion** - Suggest a feature for the server
**Bot Problem** - Report a bug with <@957258199151562885>
**Bot Suggestion** - Suggest a feature <@957258199151562885>
**Other** - Any other reasons to open a ticket`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: `Tickets`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/918549523561857134/SunglassesBot_main.png`},
    thumbnail: {url: `https://media.discordapp.net/attachments/901430270849347604/902091602816811028/tickets.png`},
    footer: {text: `SunglassesBot Tickets`, icon_url: `https://media.discordapp.net/attachments/901430270849347604/902091602816811028/tickets.png`}
  }],
});