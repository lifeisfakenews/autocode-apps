const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let name = context.params.event.content.split(' ')[1]
let cost = parseInt(context.params.event.content.split(' ')[2])
let desc = context.params.event.content.split(' ').slice(3).join(' ')
if (context.params.event.author.id == `760170825629958184` || context.params.event.author.id == `599291874200649729`) {
  if (!cost || !name || !desc || isNaN(cost))
    return lib.discord.channels['@0.2.0'].messages.create({
      channel_id: context.params.event.channel_id,
      content: `Please provide a valid name, cost & desc!\nE.G. \`j!addshop Padlock 100 Protect yourself from being robbed\``
    });
  let ID = name.toLowerCase().replace(/\p{Sc}|\p{P}/gu, '').replace(' ', '-')
  let check = await lib.googlesheets.query['@0.3.0'].select({
    range: `Shop!A:D`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{'ID__is': ID}],
  });
  if (check?.rows?.length)
    return lib.discord.channels['@0.2.0'].messages.create({
      channel_id: context.params.event.channel_id,
      content: `Item with ID \`${ID}\` already exists, please try somthing else\nE.G. \`${name}1\``
    });

  await lib.googlesheets.query['@0.3.0'].insert({
    range: `Shop!A:D`,
    fieldsets: [{
      'ID': ID,
      'Name': name,
      'Desc': desc,
      'Cost': cost,
    }]
  });
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `Created item ${name}\nTo view it, use \`j!shop\`\nTo buy it, use \`j!buy ${ID}\``
  });
}