const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let user = context.params.event.mentions[0]
let amount = parseInt(context.params.event.content.split(' ')[2])
if (context.params.event.author.id == `760170825629958184` || context.params.event.author.id == `864956564342046740`) {
  if (!user || isNaN(amount))
    return lib.discord.channels['@0.2.0'].messages.create({
      channel_id: context.params.event.channel_id,
      content: `Please provide a valid user & amount \nE.G. \`?addbal @lifeisfakenews 500\``
    });
  
  let bal = await lib.googlesheets.query['@0.3.0'].select({
    range: `UserData!A:Z`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': user.id}],
  });
  if (!bal?.rows?.length) {
    bal = await lib.googlesheets.query['@0.3.0'].insert({
      range: `UserData!A:Z`,
      fieldsets: [{
        'User': user.id,
        'Cash': 0,
        'Bank': 0
      }]
    });
  }
  await lib.googlesheets.query['@0.3.0'].update({
    range: `UserData!A:Z`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{'User__is': user.id}],
    fields: {
      'Cash': parseInt(bal.rows[0].fields.Cash) + amount
    }
  });
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `${amount > 0 ? `Added` : `Removed`} ${amount.toString().replace('-', '')} ${amount > 0 ? `to` : `from`} ${user.username}#${user.discriminator}'s wallet`
  });
}