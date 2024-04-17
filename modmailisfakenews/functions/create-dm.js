const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

try {
  let threads = await lib.discord.channels['@0.3.0'].threads.list({channel_id: process.env.CHANNEL, active: true});
  threads = threads.threads.filter((t) => t.name.split('| ')[1] == context.params.event.author.id)
  if (threads?.length) {//User already has thread
    await lib.discord.channels['@0.3.2'].messages.create({
      channel_id: threads[0].id,
      content: ``,
      embeds: [{
        type: "rich",
        color: 0x2f3136,
        author: {name: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'},
        description: `>>> ` + context.params.event.content,
      }],
    });
  } else {//User doesnt have thread
    await lib.discord.channels['@0.3.2'].messages.create({//Notify staff
      channel_id: process.env.CHANNEL,
      content: process.env.ROLE != false ? `<@&${process.env.ROLE}>` : ``,
      embeds: [{
        type: "rich",
        color: 0x2f3136,
        author: {name: `New Message`},
        timestamp: new Date().toISOString(),
        description: `>>> ` + context.params.event.content,
        footer: {text: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'},
      }],
    });
    let result = await lib.discord.channels['@0.3.2'].threads.create({//Create a thread
      channel_id: process.env.CHANNEL,
      name: `${context.params.event.author.username.replace('|', ' ')} | ${context.params.event.author.id}`,
      type: 'GUILD_PUBLIC_THREAD',
    });
    await lib.discord.channels['@0.3.2'].messages.create({//Send a message in the thread
      channel_id: result.id,
      content: ``,
      embeds: [{
        type: "rich",
        color: 0x2f3136,
        author: {name: `${context.params.event.author.username}#${context.params.event.author.discriminator}`, icon_url: context.params.event.author.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.${context.params.event.author.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'},
        description: `>>> ` + context.params.event.content,
      }],
      components: [{
        type: 1,
        components: [{
          type: 2,
          style: 2,
          label: `Close Thread`,
          custom_id: `mm-close`
        }]
      }]
    });
    let guild = await lib.discord.guilds['@0.2.4'].retrieve({
      guild_id: result.guild_id
    });
    await lib.discord.users['@0.2.0'].dms.create({//Send response to user
      recipient_id: context.params.event.author.id,
      content: ``,
      embeds: [{
        type: "rich",
        color: 0x2f3136,
        author: {name: `Thread Created`},
        description: `A thread has been created. A member of the ${guild.name} support team will contact you shortly.\nPlease ensure that you do not leave the server or disable DMs`,
      }],
    });
  }
  await lib.discord.channels['@0.3.2'].messages.reactions.create({
    emoji: `✅`,
    message_id: context.params.event.id,
    channel_id: context.params.event.channel_id
  });
} catch (e) {
  console.log(e.message);
  await lib.discord.channels['@0.3.2'].messages.reactions.create({
    emoji: `❌`,
    message_id: context.params.event.id,
    channel_id: context.params.event.channel_id
  });
}