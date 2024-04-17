const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
try {
  let scores = await lib.googlesheets.query['@0.3.0'].select({
    range: `Users!A:E`,
    bounds: 'FIRST_EMPTY_ROW',
  });
  scores.rows.sort((a, b) => b.fields.Easy - a.fields.Easy);
  scores = scores.rows.filter((r) => r.fields.Easy > 0);

  await lib.discord.channels['@0.3.0'].messages.update({
    message_id: context.params.event.message.id,
    channel_id: context.params.event.message.channel_id,
    content: ``,
    embeds: [{
      type: "rich",
      description: scores.map((r, i) =>  `\`${i+1<10 ? `0`:``}${i+1<100 ? `0`:``}${i+1}\` <@${r.fields.User}> ${r.fields.Easy || 0}`).slice(0, 120).join('\n'),
      color: parseInt(process.env.COLOR),
      timestamp: new Date().toISOString(),
      author: {name: `Easy Mode Leaderboard`},
      footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
    }],
    components: [{
      type: 1,
      components: [
        {style: 1, label: `Easy`, custom_id: `easy`, type: 2},
        {style: 2, label: `Hard`, custom_id: `hard`, type: 2},
        {style: 2, label: `Premium`, custom_id: `pre`, type: 2},
        {style: 2, label: `Invites`, custom_id: `invites`, type: 2},
      ]
    }],
  });
} catch (e) {
  if (e.message.includes('Maxium number of edits')) {
    await lib.discord.channels['@0.3.2'].messages.destroy({
      message_id: context.params.event.message.id,
      channel_id: context.params.event.message.channel_id
    });
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: context.params.event.message.channel_id,
      content: ``,
      embeds: [{
        type: "rich",
        description: scores.map((r, i) =>  `\`${i+1<10 ? `0`:``}${i+1<100 ? `0`:``}${i+1}\` <@${r.fields.User}> ${r.fields.Easy || 0}`).slice(0, 120).join('\n'),
        color: parseInt(process.env.COLOR),
        timestamp: new Date().toISOString(),
        author: {name: `Easy Mode Leaderboard`},
        footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
      }],
      components: [{
        type: 1,
        components: [
          {style: 1, label: `Easy`, custom_id: `easy`, type: 2},
          {style: 2, label: `Hard`, custom_id: `hard`, type: 2},
          {style: 2, label: `Premium`, custom_id: `pre`, type: 2},
          {style: 2, label: `Invites`, custom_id: `invites`, type: 2},
        ]
      }],
    });
  } else {
    await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
      token: context.params.event.token,
      response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
      content: `\`\`\`ansi\n\u001b[1;31m${e.message}\u001b[0m\`\`\`Please contact lifeisfakenews#0404`
    });
  }
}