const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async(event) => {
  let bal = await lib.googlesheets.query['@0.3.0'].select({
    range: `Users!A:K`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': event.author.id}],
  });
  if (bal.rows[0].fields.Padlock == `TRUE`) {
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: event.channel_id,
      content: `You already have a padlock active!`,
    });
  } else {
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: event.channel_id,
      content: ``,
      embeds: [{
        type: 'rich',
        author: {name: `Item Used`},
        description: `You put a Padlock on your wallet\nYou are now protected next time someone tries to rob you.\nUse \`j!inv\` to view your inventory`,
        color: parseInt(process.env.COLOR),
        timestamp: new Date().toISOString(),
        footer: {text: `${event.author.username}#${event.author.discriminator}`, icon_url: event.author.avatar ? `https://cdn.discordapp.com/avatars/${event.author.id}/${event.author.avatar}.${event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
      }]
    });
    let inv = bal.rows[0].fields.Inv.replace(`padlock,`, ``)
    await lib.googlesheets.query['@0.3.0'].update({
      range: `Users!A:K`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [{'User__is': event.author.id}],
      fields: {
        'Padlock': true,
        'Inv': inv,
      }
    });
  }
}