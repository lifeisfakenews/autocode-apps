const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let me = await lib.discord.users['@0.2.0'].me.list();
let token = context.params.event.token
let message_id = context.params.event.message.id
let values = context.params.event.data.values[0].split('_')
if (values[0] == `message`) {
  let message = await lib.discord.channels['@0.3.0'].messages.retrieve({message_id: values[1], channel_id: values[2]});
  await lib.discord.interactions['@0.1.0'].followups.update({token, message_id,
    content: `Results for \`${values[3]}\``,
    embeds: [{
        type: "rich",
        title: ``,
        description: `**In:** <#${message.channel_id}>
        **Author:** ${message.author.username}#${message.author.discriminator}
        **Content:**
        \`\`\`${message.content}\`\`\``,
        color: 0x00FFFF,
        author: {name: `AutocodeBot Help`, icon_url: me.avatar_url},
    }],
    components: context.params.event.message.components
  });
} else if (values[0] == `sheet`) {
  let sheet = await lib.googlesheets.query['@0.3.0'].select({
    range: `A:E`,
    bounds: 'FIRST_EMPTY_ROW',
    where: [{}],
  });
  for (let i = 0; i < sheet.rows.length; i++) {
  if (sheet.rows[i].index == values[1]) {
  await lib.discord.interactions['@0.1.0'].followups.update({token, message_id,
    content: `Results for \`${values[3]}\``,
      embeds: [{
          type: "rich",
          title: ``,
          description: `**Question:** ${sheet.rows[i].fields.question}
          **Answer:** ${sheet.rows[i].fields.answer}
          **API:** ${sheet.rows[i].fields.link || 'N\A'}`,
          color: 0x00FFFF,
          author: {name: `AutocodeBot Help`, icon_url: me.avatar_url},
      }],
      components: context.params.event.message.components
    });
  break;
  }
  }
}