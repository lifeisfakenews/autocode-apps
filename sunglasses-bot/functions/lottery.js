const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let users = await lib.googlesheets.query['@0.3.0'].select({
  range: `UserData!A:Z`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'Lottery__is': `TRUE`}],
});
for (let i = 0; i < 5; i++) {
  let chosen = users.rows[Math.floor(Math.random() * users.rows.length)]
  try {
    let user = await lib.discord.users['@0.2.1'].retrieve({user_id: chosen.fields.User});
    await lib.discord.users['@0.2.1'].dms.create({
      recipient_id: user.id,
      content: ``,
      embeds: [{
        type: 'rich',
        author: {name: `Lottery Winner`},
        description: `You won ⏣ 1,000,000 from the lottery!\nThe cash has been added to your bank account, use \`j!withdraw\` to use the money`,
        color: parseInt(process.env.COLOR),
        timestamp: new Date().toISOString(),
        footer: {text: `${user.username}#${user.discriminator}`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt'}
      }]
    });
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: `1006556617979998218`,
      content: ``,
      embeds: [{
        type: 'rich',
        author: {name: `Lottery`},
        description: `<@${user.id}> just won ⏣ 1,000,000 from the lottery!\nFor your chance to win ⏣ 1,000,000, make sure to buy a lottery ticket!`,
        color: parseInt(process.env.COLOR),
        timestamp: new Date().toISOString(),
        footer: {text: `${user.username}#${user.discriminator}`, icon_url: user.avatar_url || 'https://bit.ly/3KPnEKt'}
      }]
    });
    await lib.googlesheets.query['@0.3.0'].update({
      range: `UserData!A:Z`,
      bounds: 'FIRST_EMPTY_ROW',
      where: [{'User__is': user.id}],
      fields: {
        'Bank': parseInt(chosen.fields.Bank) + 1000000,
      }
    });
    break;
  } catch (e) {
    if (!e.message.includes('Cannot send messages to this user')) {
      console.log(e);
      break;
    }
  }
}
await lib.googlesheets.query['@0.3.0'].update({
  range: `UserData!A:Z`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'Lottery__is': `TRUE`}],
  fields: {
    'Lottery': false
  }
});