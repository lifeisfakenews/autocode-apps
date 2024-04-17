const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const event = context.params.event
const { guild_id, token, channel_id } = event;
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': guild_id}]});
if (!base.rows[0]) await lib.airtable.query['@1.0.0'].insert({table: `Config`, fieldsets: [{'Guild': guild_id}]});
try {
let isAdmin = false
let subCmd = event.content.toLowerCase().split(' ').slice(1)
let guildInfo = await lib.discord.guilds['@release'].retrieve({guild_id});
let roles = await lib.discord.guilds['@release'].roles.list({guild_id});
roles = roles.filter(role => event.member.roles.includes(role.id));
if (guildInfo.owner_id == event.author.id) isAdmin = true
if (event.member.roles.includes(base.rows[0].fields.Moderator)) isAdmin = true
for (let i = 0; i < roles.length; i++) {if (roles[i].permission_names.includes('ADMINISTRATOR')) {isAdmin = true; break}}
if (!isAdmin) {
  await lib.discord.channels['@release'].messages.create({channel_id, content: `**${event.author.username}**, you don't have permission to use this.`});
} else if (subCmd[0] == `moderator`) {
  if (!event.mention_roles[0])
    return lib.discord.channels['@release'].messages.create({channel_id, content: `You must mention a role\nE.G. \`?setup moderator @moderator\`\nPlease use ?help for more info`})
  
  await lib.discord.channels['@release'].messages.create({channel_id, content: `The moderator role has been set to <@&${event.mention_roles[0]}>`});
  await lib.airtable.query['@1.0.0'].update({
    table: `Config`,
    where: [{'Guild__is': guild_id}],
    fields: {'Moderator': event.mention_roles[0]},
  });
  if (base.rows[0].fields.Logging) {
    await lib.discord.channels['@release'].messages.create({
      channel_id: base.rows[0].fields.Logging,
      content: '**Moderation | Setup**',
      embeds: [{
        type: 'rich',
        title: 'Set Moderator Role',
        description: ``,
        color: 0x41CF3C,
        fields: [
          {name: 'Role', value: `<@&${event.mention_roles[0]}>`},
          {name: 'Moderator', value: `${event.author.username}#${event.author.discriminator}`},
          {name: 'Time', value: `<t:${Math.floor(new Date().getTime() / 1000)}>`},
        ],
      }],
    });
  }
} else if (subCmd[0] == `appeals`) {
  const validator = require('validator');
  if (!subCmd[1] || !validator.isURL(subCmd[1]))
    return lib.discord.channels['@release'].messages.create({channel_id, content: `You must provide a valid link!\nE.G. \`?setup appeals https://forms.gle/some-form\`\nPlease use ?help for more info`})

  await lib.discord.channels['@release'].messages.create({channel_id, content: `The appeals link has been set to ${subCmd[1]}`});
  await lib.airtable.query['@1.0.0'].update({
    table: `Config`,
    where: [{'Guild__is': guild_id}],
    fields: {'Appeals': subCmd[1]},
  });
  await lib.discord.channels['@release'].messages.create({
    channel_id: subCmd[1],
    content: '**Moderation | Setup**',
    embeds: [{
      type: 'rich',
      title: 'Set Appeal Link',
      description: ``,
      color: 0x41CF3C,
      fields: [
        {name: 'Link', value: subCmd[1]},
        {name: 'Moderator', value: `${event.author.username}#${event.author.discriminator}`},
        {name: 'Time', value: `<t:${Math.floor(new Date().getTime() / 1000)}>`},
      ],
    }],
  });
}  else if (subCmd[0] == `logging`) {
  if (!subCmd[1] || !subCmd[1].startsWith('<#') || !subCmd[1].endsWith('>'))
    return lib.discord.channels['@release'].messages.create({channel_id, content: `You must mention a channel\nE.G. \`?setup logging #logging\`\nPlease use ?help for more info`})

  await lib.discord.channels['@release'].messages.create({channel_id, content: `The logging channel has been set to ${subCmd[1]}`});
  await lib.airtable.query['@1.0.0'].update({
    table: `Config`,
    where: [{'Guild__is': guild_id}],
    fields: {'Logging': subCmd[1]},
  });
  await lib.discord.channels['@release'].messages.create({
    channel_id: subCmd[1],
    content: '**Moderation | Setup**',
    embeds: [{
      type: 'rich',
      title: 'Set Logging Channel',
      description: ``,
      color: 0x41CF3C,
      fields: [
        {name: 'Channel', value: subCmd[1]},
        {name: 'Moderator', value: `${event.author.username}#${event.author.discriminator}`},
        {name: 'Time', value: `<t:${Math.floor(new Date().getTime() / 1000)}>`},
      ],
    }],
  });
} else if (subCmd[0] == `reports`) {
  if (!subCmd[1] || !subCmd[1].startsWith('<#') || !subCmd[1].endsWith('>'))
    return lib.discord.channels['@release'].messages.create({channel_id, content: `You must mention a channel\nE.G. \`?setup reports #reports\`\nPlease use ?help for more info`})

  await lib.discord.channels['@release'].messages.create({channel_id, content: `The reports channel has been set to ${subCmd[1]}`});
  await lib.airtable.query['@1.0.0'].update({
    table: `Config`,
    where: [{'Guild__is': guild_id}],
    fields: {'Reports': subCmd[1]},
  });
  if (base.rows[0].fields.Logging) {
    await lib.discord.channels['@release'].messages.create({
      channel_id: base.rows[0].fields.Logging,
      content: '**Moderation | Setup**',
      embeds: [{
        type: 'rich',
        title: 'Set Reports Channel',
        description: ``,
        color: 0x41CF3C,
        fields: [
          {name: 'Channel', value: subCmd[1]},
          {name: 'Moderator', value: `${event.author.username}#${event.author.discriminator}`},
          {name: 'Time', value: `<t:${Math.floor(new Date().getTime() / 1000)}>`},
        ],
      }],
    });
  }
} else if (subCmd[0] == `verification`) {
  if (subCmd[1] == `button` || subCmd[1] == `captcha`) {
    if (!subCmd[2] || !event.mention_roles[0]) 
      return lib.discord.channels['@release'].messages.create({channel_id, content: `You must provide a channel & role!\nE.G. \`?setup verification button #verify @member\`\nPlease use ?help for more info`})
    await lib.airtable.query['@1.0.0'].update({
      table: `Config`,
      where: [{'Guild__is': context.params.event.guild_id}],
      fields: {'Verify': subCmd[2], 'Member': event.mention_roles[0], 'Type': subCmd[1]},
    });
    let me = await lib.discord.users['@release'].me.list();
    let msg = await lib.discord.channels['@release'].messages.create({channel_id: subCmd[2],
      content: ``,
      embeds: [{
        type: "rich",
        title: ` `,
        description: `Beep Boop, We need to check your not a robot!
Please press the button below to ${subCmd[1] == `button` ? `get verified` : `recieve a captcha. To answer it please type \`>captcha [code]\`.
You have as many attempts as you need, however this code will expire after 5 minutes`}`,
        color: 0x00FFFF,
        thumbnail: {url: `https://cdn.discordapp.com/emojis/915412257352060969.gif?size=96&quality=lossless`},
        author: {name: `Verify Here`, icon_url: me.avatar_url},
      }],
      components: [{type: 1, components: [{style: 3, label: `Verify`, custom_id: `verify`, type: 2}]}],
    });
    await lib.discord.channels['@0.3.0'].pins.create({message_id: msg.id, channel_id: msg.channel_id});
    await lib.discord.channels['@release'].messages.create({channel_id, content:  `
Members now must go to ${subCmd[2]} to get verified, with verification type ${subCmd[1]}.
Members will get the <@&${event.mention_roles[0]}> role once they verify.`
    });
  } else if (subCmd[1] == `none`) {
    await lib.discord.channels['@release'].messages.create({channel_id, content: `Verification has been disabled.`})
    await lib.airtable.query['@1.0.0'].update({
      table: `Config`,
      where: [{'Guild__is': context.params.event.guild_id}],
      fields: {'Verify': ``, 'Member': ``, 'Type': `none`},
    });
  } else {
    return lib.discord.channels['@release'].messages.create({channel_id, content: `You must provide a verification type:\n\`button\`, \`captcha\` or \`none\`\nPlease use ?help for more info`})
  }
  if (base.rows[0].fields.Logging) {
    await lib.discord.channels['@release'].messages.create({
      channel_id: base.rows[0].fields.Logging,
      content: '**Moderation | Setup**',
      embeds: [{
        type: 'rich',
        title: 'Setup verification',
        description: ``,
        color: 0x41CF3C,
        fields: [
          {name: 'Channel', value: subCmd[2]},
          {name: 'Role', value: `<@&${event.mention_roles[0]}>`},
          {name: 'Type', value: subCmd[1]},
          {name: 'Moderator', value: `${event.author.username}#${event.author.discriminator}`},
          {name: 'Time', value: `<t:${Math.floor(new Date().getTime() / 1000)}>`},
        ]
      }],
    });
  }
} else if (subCmd[0] == `auto-moderation`) {
  let fType = ''
  let type = subCmd[1]
  let option = ``
  if (!subCmd[1])
  return lib.discord.channels['@release'].messages.create({channel_id,
    content: `You must provide the type of auto mod!\n\`profanity-filter\`, \`anti-links\`, \`anti-mass-mention\`, \`anti-caps\`, \`anti-token-grabbers\`, \`anti-everyone-ping\` or \`anti-invites\`\nPlease use \`?help\` for more info`
  })
  if (subCmd[2] == `true` || subCmd[2] == `false`) {
    option = subCmd[2].replace('true', 'enabled').replace('false', 'disabled')
    if (type == `profanity-filter`) {
      fType = `Profanity Filter`
      await lib.airtable.query['@1.0.0'].update({
        table: `Config`,
        where: [{'Guild__is': context.params.event.guild_id}],
        fields: {'Profanity': subCmd[2]},
      });
    } else if (type == `anti-links`) {
      fType = `Anti Links`
      await lib.airtable.query['@1.0.0'].update({
        table: `Config`,
        where: [{'Guild__is': context.params.event.guild_id}],
        fields: {'Links': subCmd[2]},
      });
    } else if (type == `anti-invites`) {
      fType = `Anti Invites`
      await lib.airtable.query['@1.0.0'].update({
        table: `Config`,
        where: [{'Guild__is': context.params.event.guild_id}],
        fields: {'Invites': subCmd[2]},
      });
    } else if (type == `anti-everyone-ping`) {
      fType = `Anti Everyone Ping`
      await lib.airtable.query['@1.0.0'].update({
        table: `Config`,
        where: [{'Guild__is': context.params.event.guild_id}],
        fields: {'Everyone': subCmd[2]},
      });
    } else if (type == `anti-token-grabbers`) {
      fType = `Anti Token Grabbers`
      await lib.airtable.query['@1.0.0'].update({
        table: `Config`,
        where: [{'Guild__is': context.params.event.guild_id}],
        fields: {'Scams': subCmd[2]},
      });
    } else if (type == `anti-caps`) {
      option = subCmd[2] != 0 ? `set to ${subCmd[2]}%` : `disabled`
      fType = `Anti Caps`
      await lib.airtable.query['@1.0.0'].update({
        table: `Config`,
        where: [{'Guild__is': context.params.event.guild_id}],
        fields: {'Caps': subCmd[2]},
      });
    } else if (type == `anti-mass-mention`) {
      option = subCmd[2] != 0 ? `set to ${subCmd[2]} mentions` : `disabled`
      fType = `Anti Mass Mention`
      await lib.airtable.query['@1.0.0'].update({
        table: `Config`,
        where: [{'Guild__is': context.params.event.guild_id}],
        fields: {'Mentions': subCmd[2]},
      });
    } else {
      return lib.discord.channels['@release'].messages.create({channel_id,
        content: `You must provide the type of auto mod!\n\`profanity-filter\`, \`anti-links\`, \`anti-mass-mention\`, \`anti-caps\`, \`anti-token-grabbers\`, \`anti-everyone-ping\` or \`anti-invites\`\nPlease use \`?help\` for more info`
      })
    }
  } else {
    return lib.discord.channels['@release'].messages.create({channel_id, content: `You must use either \`true\` or \`false\`\nE.G. \`?setup auto-moderation anti-invites true\`\nPlease use \`?help\` for more info`})
  }
  await lib.discord.channels['@release'].messages.create({channel_id, content: `${fType} has been ${option}`})
  if (base.rows[0].fields.Logging) {
    await lib.discord.channels['@release'].messages.create({
      channel_id: base.rows[0].fields.Logging,
      content: '**Moderation | Setup**',
      embeds: [{
        type: 'rich',
        title: 'Setup Auto Moderation',
        description: ``,
        color: 0x41CF3C,
        fields: [
          {name: fType, value: option},
          {name: 'Moderator', value: `${event.author.username}#${event.author.discriminator}`},
          {name: 'Time', value: `<t:${Math.floor(new Date().getTime() / 1000)}>`},
        ]
      }],
    });
  }
} else {
  await lib.discord.channels['@release'].messages.create({channel_id, 
    content: `**${event.author.username}**, you need to say what you want to setup:\n\`logging\`, \`reports\`, \`moderator\`, \`verification\` or \`auto-moderation\`.\nPlease use \`?help\` for more info`
  })
} } catch (e) {
  await lib.discord.channels['@release'].messages.create({channel_id, content: `An error occurred, please try again\n\`\`\`${e.toString()}\`\`\``});
}