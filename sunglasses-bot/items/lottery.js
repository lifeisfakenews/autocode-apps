const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async(event) => {
  let bal = await lib.googlesheets.query['@0.3.0'].select({
    range: `UserData!A:Z`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': event.author.id}],
  });
  if (bal.rows[0].fields.Lottery == `TRUE`) {
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: event.channel_id,
      content: `You already have already used a lottery ticket this week!\nYou can use another one after the draw on Sunday!`,
    });
  } else {
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: event.channel_id,
      content: ``,
      embeds: [{
        type: 'rich',
        author: {name: `Item Used`},
        description: `You used your lottery ticket. You will be DMed on Sunday if you have won.\nPlease ensure you have DMs enabled otherwise another winner will be picked!\nUse \`?inv\` to view your inventory`,
        color: parseInt(process.env.COLOR),
        timestamp: new Date().toISOString(),
        footer: {text: `${event.author.username}#${event.author.discriminator}`, icon_url: event.author.avatar ? `https://cdn.discordapp.com/avatars/${event.author.id}/${event.author.avatar}.${event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
      }]
    });
    let inv = bal.rows[0].fields.Inv.replace(`lottery,`, ``)
    await lib.googlesheets.query['@0.3.0'].update({
      range: `UserData!A:Z`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [{'User__is': event.author.id}],
      fields: {
        'Inv': inv,
        'Lottery': true,
      }
    });
  }
}