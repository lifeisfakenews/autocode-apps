const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let info = await lib.http.request['@1.1.5'].get({
  url: `https://api.dictionaryapi.dev/api/v2/entries/en/${context.params.event.data.options[0].value}`,
});

await lib.discord.interactions['@release'].responses.create({
  token: context.params.event.token,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  content: ``,
  embeds: [{
    type: 'rich',
    description: `${info.data[0].meanings.map((m, i) => `**Meaning ${(i + 1)}**\n **__Type:__** ${m.partOfSpeech}
**__Definitions:__**\n${m.definitions.slice(0, 10).map((d, i) => `**${(i + 1)}:** ${d.definition}${d.example ? `\n**Ex:** \`${d.example}\``: ``}`).join('\n')}
${m.synonyms.length ? `**__Synonyms:__**\n${m.synonyms.slice(0, 10).map((s) => `\`${s}\``).join(', ')}\n` : ``}${m.antonyms.length ? `**__Antonyms:__**\n${m.antonyms.slice(0, 10).map((a) => `\`${a}\``).join(', ')}\n` : ``}`).join('\n')}`,
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: `Definition of ${info.data[0].word}`, icon_url: `https://toppng.com/uploads/preview/dictionary-icon-android-lollipop-115309574023rtnppod6j.png`},
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }],
});