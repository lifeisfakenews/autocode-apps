const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let threads = await lib.discord.channels['@0.3.0'].threads.list({channel_id: process.env.CHANNEL, active: true});
threads = threads.threads.filter((t) => t.id == context.params.event.channel_id)
if (threads?.length) {
  let messages = await lib.discord.channels['@0.2.2'].messages.list({//list messages
    channel_id: context.params.event.channel_id
  });
  let messageList = []
  messages.forEach((m) => messageList.push({
    content: m.content,
    author: m.author,
    timestamp: m.timestamp,
    attachments: m.attachments,
    embeds: m.embeds
  }))
  while (messages[99]) {//if there is 100+ messages
    messages = await lib.discord.channels['@0.2.2'].messages.list({
      channel_id: context.params.event.channel_id,
      before: messages[99].id
    });
    messages.forEach((m) => messageList.push({
      content: m.content,
      author: m.author,
      timestamp: m.timestamp,
      attachments: m.attachments,
      embeds: m.embeds
    }))
  }
  let user = await lib.discord.users['@0.2.1'].retrieve({user_id: threads[0].name.split('| ')[1]});
  let previous
  let archive = `MODMAIL ARCHIVE\n
User ${user.username}#${user.discriminator} (${user.id})
Openend ${new Date(messageList[0].timestamp).getDate()}/${new Date(messageList[0].timestamp).getMonth() + 1}/${new Date(messageList[0].timestamp).getFullYear()}
Closed ${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}
Messages ${messageList.length}\n\n-------------------------------------------------------\n`
  archive = archive + messageList.reverse().map((m) => {
    let d = new Date(m.timestamp)
    if (m.embeds?.length) {
      return `${previous == user.id ? `` : `${user.username}#${user.discriminator} | ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}\n`}${m.embeds[0].description.replace('>>>', '')}`
      previous = user.id
    } else {
      return `${previous == m.author.id ? `` : `${m.author.username}#${m.author.discriminator} | ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}\n`}${m.content.replace('m?reply', '[RESPONSE]')}`
      previous = m.author.id
    }
  }).join('\n\n');
  
  await lib.discord.channels['@0.3.2'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `Thread Closed!`,
    attachments: [{
      filename: `messages.txt`,
      file: Buffer.from(archive),
    }]
  });
  await lib.discord.channels['@0.3.2'].threads.update({
    thread_id: context.params.event.channel_id,
    locked: true,
    archived: true
  });
  await lib.discord.users['@0.2.0'].dms.create({//Send response to user
    recipient_id: user.id,
    content: ``,
    embeds: [{
      type: "rich",
      color: 0x2f3136,
      author: {name: `Thread Closed`},
      description: `Your thread has been closed. If you feel like your issue has not been resolved, or have any other issues, please reply to this message to create a new thread`,
    }],
    attachments: [{
      filename: `messages.txt`,
      file: Buffer.from(archive),
    }]
  });
}