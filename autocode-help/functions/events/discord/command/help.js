const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const removeWords =  require('remove-words');
let event = context.params.event;
let me = await lib.discord.users['@0.2.0'].me.list();
let user = await lib.discord.users['@0.2.0'].retrieve({user_id: event.member.user.id});
let question = event.data.options[0].value.toLowerCase().replace('?', '')
let options = [];
//--------------------------------------------GETTING MESSAGE CONTENT-----------------------------------------------
let combined = [];
let channels = ['936967055587029003', '936967093696483361', '936967272403197992'];
for (let i = 0; i < channels.length; i++) {
  let messages = await lib.discord.channels['@0.3.0'].messages.list({channel_id: channels[i]})
  for (let i = 0; i < messages.length; i++) {
    combined.push({id: messages[i].id, channel: messages[i].channel_id, words: removeWords(messages[i].content, true)});
  }
}
for (let i = 0; i < combined.length; i++) {
  let msgnum = i
  for (let i = 0; i < combined[i].words.length; i++) {
    let wordnum = i
    let qwords = removeWords(question, true)
    for (let i = 0; i < qwords.length; i++) {
      if (combined[msgnum].words[wordnum] && combined[msgnum].words[wordnum].match(qwords[i])) {
        let message = await lib.discord.channels['@0.3.0'].messages.retrieve({
          message_id: combined[msgnum].id,
          channel_id: combined[msgnum].channel
        });
        let channel = await lib.discord.channels['@0.3.0'].retrieve({channel_id: message.channel_id});
         options.push({
          label: `Message in #${channel.name}`,
          value:  `message_${message.id}_${message.channel_id}_${question}`,
          description: `${message.content.slice(0, 100)}`,
         })
        break;
      }
    }
  }
}
//--------------------------------------------GETTING GOOGLE SHEETS DATA----------------------------------------------------------
let sheet = await lib.googlesheets.query['@0.3.0'].select({
  range: `A:E`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{}],
});
let phrases = [];
for (let i = 0; i < sheet.rows.length; i++)
  phrases.push(sheet.rows[i].fields.phrases.split(', '));

for (let i = 0; i < phrases.length; i++) {
  phrases[i] = phrases[i].filter(item => question.includes(item))
  if(phrases[i].length) options.push({
    label: sheet.rows[i].fields.question,
    value:  `sheet_${sheet.rows[i].index}_${question}`,
    description: `${sheet.rows[i].fields.answer.slice(0, 100)}`,
  })
}
//--------------------------------------------------MAP & SEND RESULTS-------------------------------------------------------------------
if (options.length) {
await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
  token: event.token,
  content: ``,
  embeds: [{
    type: "rich",
    title: "",
    description: `
     I found ${options.length} results for ${question}`,
    color: 0x00FFFF,
    author: {name: `Autocode Help`, icon_url: me.avatar_url},
  }],
  components: [{type: 1, components: [{custom_id: `ac-help`, options, min_values: 1, max_values: 1, type: 3}]}],
});
} else {
await lib.discord.interactions['@0.1.0'].followups.ephemeral.create({
  token: event.token,
  content: "",
  components: [{type: 1, components: [
        {style: 5, label: `Guide`, url: `https://autocode.com/guides/how-to-build-a-discord-bot/`, emoji: {id: null, name: `💬`}, type: 2},
        {style: 5, label: `Docs`, url: `https://autocode.com/lib`, emoji: {id: null, name: `🔍`}, type: 2},
        {style: 5, label: `Apps`, url: `https://autocode.com/app`, emoji: {id: null, name: `📲`}, type: 2},
        {style: 5, label: `Snippets`, url: `https://autocode.com/snippet`, emoji: {id: null, name: `✍️`}, type: 2},
      ]}
  ], 
  embeds: [{
      type: "rich",
      title: "",
      description: `😥 I couldn't find anything for \`${event.data.options[0].value}\`
        Here are some other things you could try:
        <:verified:937039739394072576> **Read the guide, get verifed!** - Read the [guide](https://autocode.com/guides/how-to-build-a-discord-bot/) and get verifed so you can ask in <#831206093824196648>\n
         📃 **Check the logs** - if your encountering an error check if the logs can tell you (bottom right)\n
        📚 **Look else where** - check out <#867091261373415505>, <#869337660026667008> and <#836592466693849109>\n
        🔍 **Check the API docs** - Dig through the API documentation which can be found [here](https://autocode.com/lib)\n
        📌 **Look at pins** - take a look through the pinned messages in <#831206093824196648>\n
        <:dev:937035839375015966> **Don't repeat** - have a look through the extensive app and snippet library
        `,
      color: 0x00FFFF,
      author: {name: `Autocode Help`, icon_url: me.avatar_url},
      footer: {text: `Requested By: ${user.username}#${user.discriminator}`, icon_url: user.avatar_url}
    }]
});
}