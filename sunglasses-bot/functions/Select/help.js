const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

if (context.params.event.data.values[0] === `fun`) {
  await lib.discord.interactions['@release'].responses.ephemeral.create({
    token: context.params.event.token,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: ``,
    embeds: [{
      type: "rich",
      title: ``,
      description: `
\`?8-ball [question]\` - Ask the 8-ball a question
\`?coin-flip [heads/tails]\` - Flip a coin
\`?dank [@user]\` - Find out how dank you are
\`?dice\` - Roll a dice
\`?joke\` - Get a joke
\`?meme\` - Get a meme
\`?smart [@user]\` - Find out how smart you are
\`?sus [@user]\` - Find out how sus you are`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      author: {name: `Help Menu`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/918549523561857134/SunglassesBot_main.png`},
      footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
} else if (context.params.event.data.values[0] === `economy`) {
  await lib.discord.interactions['@release'].responses.ephemeral.create({
    token: context.params.event.token,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: ``,
    embeds: [{
      type: "rich",
      title: ``,
      description: `
\`?bal [@user]\` - Show your current balance
\`?inv [@user]\` - Show your inventory
\`?buy {item}\` - Buy an item from the shop
\`?use {item}\` - Use an item from your inventory
\`?beg\` - Beg for some cash
\`?job\` - Get or change your job
\`?rob {@user}\` - Steal some cash from a user
\`?slots {amount}\` - Play slots
\`?roll {amount} {1-6}\` - Roll a dice
\`?shop\` - Check out things you can buy in the shop
\`?give {@user} {amount}\` - Give some money to another user
\`?work\` - Earn some money
\`?daily\` - Claim some daily cash
\`?search\` - Search for some money
\`?deposit {amount}\` - Put some money in the bank
\`?withdraw {amount}\` - Take some money out the bank`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      author: {name: `Help Menu`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/918549523561857134/SunglassesBot_main.png`},
      footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
} else if (context.params.event.data.values[0] === `other`) {
  await lib.discord.interactions['@release'].responses.ephemeral.create({
    token: context.params.event.token,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: ``,
    embeds: [{
      type: "rich",
      title: ``,
      description: `
\`?actions [@user]\` - View moderation actions taken against a user
\`?case <case no>\` - View a previous case
\`?count\` - View the current count
\`?help\` - View a list of commands
\`?leaderboard\` - View the leaderboard
\`?member-count\` - View the member count
\`?mod-actions [@user]\` - View moderation actions taken by a user
\`?perms [@user]\` - View your permissions
\`?role-info <@role>\` - View info about a role
\`?server-info\` - View info about this server
\`?user-info [@user]\` - View info about a user
\`?warns [@user]\` - View a users warns
\`?weather <city>\` - View the weather
\`?define <word>\` - Get the definition of a word`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      author: {name: `Help Menu`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/918549523561857134/SunglassesBot_main.png`},
      footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
} else if (context.params.event.data.values[0] === `music`) {
  await lib.discord.interactions['@release'].responses.ephemeral.create({
    token: context.params.event.token,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: ``,
    embeds: [{
      type: "rich",
      title: ``,
      description: `
\`?disconnect\` - Make me leave VC
\`?force-play <song>\` - Play a song, ignoring the queue
\`?list [@user]\` - View your save list
\`?loop\` - Loop/unloop the current track
\`?nowplaying\` - View the current track
\`?pause\` - Pause the current track
\`?play <song>\` - Play a song
\`?previous\` - Play the previous song
\`?queue clear\` - Clear the current queue
\`?queue loop\` - Loop the current queue
\`?queue reverse\` - Reverse the current queue
\`?queue save\` - Add all tracks in the current queue to your saves
\`?queue shuffle\` - Shuffle the current queue
\`?queue view\` - View the current queue
\`?resume\` - Resume the current track
\`?save\` - Add the current track to your save list
\`?skip\` - Skip to the next track in the queue
\`?summon\` - Summon me to your VC
\`?unsave <song>\` - Remove a song from your save list`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      author: {name: `Help Menu`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/918549523561857134/SunglassesBot_main.png`},
      footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
} else if (context.params.event.data.values[0] === `mod`) {
  await lib.discord.interactions['@release'].responses.ephemeral.create({
    token: context.params.event.token,
    response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
    content: ``,
    embeds: [{
      type: "rich",
      title: ``,
      description: `
\`/ban <@user> [reason]\` - Ban a user from this server
\`/clear-warns <@user> [reason]\` - Clear a users warnings
\`/edit <case no> <new reason>\` - Edit a previous moderation case
\`/kick <@user> [reason]\` - Kick a user from this server
\`/lock [reason]\` - Lock/unlock a channel
\`/nuke [reason]\` - Clones channel, deleting all messages
\`/purge <1-100> [reason]\` - Delete up to 100 messages
\`/slowmode <duration> [reason]\` - Set the slowmode
\`/soft-ban <@user> [reason]\` - Ban and unban a user, deleteing thier messages
\`/time-in <@user> [reason]\` - Remove the time out on a user
\`/time-out <@user> <duration> [reason]\` - Time out a user so they can't speak
\`/unban <user id> [reason]\` - Unban a user from this server
\`/warn <@user> [reason]\` - Warn a user`,
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      author: {name: `Help Menu`, icon_url: `https://cdn.discordapp.com/attachments/911294620439293993/918549523561857134/SunglassesBot_main.png`},
      footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }]
  });
}