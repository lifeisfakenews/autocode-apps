const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

try {
  let threads = await lib.discord.channels['@0.3.0'].threads.list({channel_id: process.env.CHANNEL, active: true});
  threads = threads.threads.filter((t) => t.id == context.params.event.channel_id)
  if (threads?.length) {
    await lib.discord.users['@0.2.0'].dms.create({//Send DM to user
      recipient_id: threads[0].name.split('| ')[1],
      content: ``,
      embeds: [{
        type: "rich",
        color: 0x2f3136,
        author: {name: `Staff Response`},
        description: `>>> ` + context.params.event.content.split(' ').slice(1).join(' '),
      }],
    });
    await lib.discord.channels['@0.3.2'].messages.reactions.create({
      emoji: `✅`,
      message_id: context.params.event.id, 
      channel_id: context.params.event.channel_id
    });
  }
} catch (e) {
  await lib.discord.channels['@0.3.2'].messages.reactions.create({
    emoji: `❌`,
    message_id: context.params.event.id, 
    channel_id: context.params.event.channel_id
  });
  if (e.message.includes('Cannot send messages to this user: code 50007:')) {
    await lib.discord.channels['@0.3.2'].messages.create({
      channel_id: context.params.event.channel_id,
      content: `I couldn't DM this user as they are not in this server or have DMs disabled.`
    });
  } else {
    await lib.discord.channels['@0.3.2'].messages.create({
      channel_id: context.params.event.channel_id,
      content: `An error occurred:\n${e.message}`
    });
  }
}