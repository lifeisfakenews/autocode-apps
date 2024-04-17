const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
  content: ``,
  embeds: [{
    type: "rich",
    description: `
**j!bal [@user]** - Show your current balance
**j!inv [@user]** - Show your inventory
**j!buy {item}** - Buy an item from the shop
**j!use {item}** - Use an item from your inventory
**j!beg** - Beg for some cash
**j!job** - Get or change your job
**j!rob {@user}** - Steal some cash from a user
**j!slots {amount}** - Play slots
**j!roll {amount} {1-6}** - Roll a dice
**j!shop** - Check out things you can buy in the shop
**j!give {@user} {amount}** - Give some money to another user
**j!work** - Earn some money
**j!daily** - Claim some daily cash
**j!search** - Search for some money
**j!deposit {amount}** - Put some money in the bank
**j!withdraw {amount}** - Take some money out the bank
**j!leaderboard** - View the leaderboard`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: `Help Menu - Economy`},
    footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }]
});