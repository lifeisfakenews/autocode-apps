const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
try {
const event = context.params.event
const { guild_id, token, channel_id } = event;
await lib.discord.interactions['@release'].responses.create({token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': guild_id}]});
if (!base.rows[0]) base = await lib.airtable.query['@1.0.0'].insert({table: `Config`, fieldsets: [{'Guild': guild_id}]});
let isAdmin = false;
let guildInfo = await lib.discord.guilds['@release'].retrieve({guild_id});
if (guildInfo.owner_id == event.member.user.id) isAdmin = true
if (event.member.permission_names.includes('ADMINISTRATOR')) isAdmin = true
if (!isAdmin) {
  await lib.discord.interactions['@release'].followups.ephemeral.create({token, content: `**${event.member.user.username}**, you don't have permission to use this.`});
} else if (event.data?.options[0].name == `logging`) {
  await lib.discord.interactions['@release'].followups.create({token, content: `The logging channel has been set to <#${event.data.options[0].options[0].value}>`});
  await lib.airtable.query['@1.0.0'].update({
    table: `Config`,
    where: [{'Guild__is': guild_id}],
    fields: {'Logging': event.data.options[0].options[0].value},
  });
  await lib.discord.channels['@release'].messages.create({
    channel_id: event.data.options[0].options[0].value,
    content: '**Moderation | Setup**',
    embeds: [{
      type: 'rich',
      title: 'Set Logging Channel',
      description: ``,
      color: 0x41CF3C,
      fields: [
        {name: 'Channel', value: `<#${event.data.options[0].options[0].value}>`},
        {name: 'Moderator', value: `${event.member.user.username}#${event.member.user.discriminator}`},
        {name: 'Time', value: `<t:${Math.floor(new Date().getTime() / 1000)}>`},
      ],
    }],
  });
} else if (event.data?.options[0].name == `moderator`) {
  await lib.discord.interactions['@release'].followups.create({token, content: `The moderator role has been set to <@&${event.data.options[0].options[0].value}>`});
  await lib.airtable.query['@1.0.0'].update({
    table: `Config`,
    where: [{'Guild__is': guild_id}],
    fields: {'Moderator': event.data.options[0].options[0].value},
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
          {name: 'Role', value: `<@&${event.data.options[0].options[0].value}>`},
          {name: 'Moderator', value: `${event.member.user.username}#${event.member.user.discriminator}`},
          {name: 'Time', value: `<t:${Math.floor(new Date().getTime() / 1000)}>`},
        ],
      }],
    });
  }
} else if (event.data?.options[0].name == `appeals`) {
  await lib.discord.interactions['@release'].followups.create({token, content: `The appeals link has been set to ${event.data.options[0].options[0].value}`});
  await lib.airtable.query['@1.0.0'].update({
    table: `Config`,
    where: [{'Guild__is': guild_id}],
    fields: {'Appeals': event.data.options[0].options[0].value},
  });
  if (base.rows[0].fields.Logging) {
    await lib.discord.channels['@release'].messages.create({
      channel_id: base.rows[0].fields.Logging,
      content: '**Moderation | Setup**',
      embeds: [{
        type: 'rich',
        title: 'Set Appeals Link',
        description: ``,
        color: 0x41CF3C,
        fields: [
          {name: 'Link', value: `${event.data.options[0].options[0].value}`},
          {name: 'Moderator', value: `${event.member.user.username}#${event.member.user.discriminator}`},
          {name: 'Time', value: `<t:${Math.floor(new Date().getTime() / 1000)}>`},
        ],
      }],
    });
  }
} else if (event.data?.options[0].name == `reports`) {
  await lib.discord.interactions['@release'].followups.create({token, content: `The reports channel has been set to <#${event.data.options[0].options[0].value}>`});
  await lib.airtable.query['@1.0.0'].update({
    table: `Config`,
    where: [{'Guild__is': guild_id}],
    fields: {'Reports': event.data.options[0].options[0].value},
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
          {name: 'Channel', value: `<#${event.data.options[0].options[0].value}>`},
          {name: 'Moderator', value: `${event.member.user.username}#${event.member.user.discriminator}`},
          {name: 'Time', value: `<t:${Math.floor(new Date().getTime() / 1000)}>`},
        ],
      }],
    });
  }
} else if (event.data?.options[0].name == `verification`) {
  if (event.data.options[0].options[0].value != `none`) {
    if (!event.data?.options[0]?.options[1]?.value || !event.data?.options[0]?.options[2]?.value) 
      return lib.discord.interactions['@release'].followups.create({token, content: `You must provide a channel & role!`})
    await lib.airtable.query['@1.0.0'].update({
      table: `Config`,
      where: [{'Guild__is': context.params.event.guild_id}],
      fields: {'Verify': event.data.options[0].options[1].value, 'Member': event.data.options[0].options[2].value, 'Type': event.data.options[0].options[0].value},
    });
    let me = await lib.discord.users['@release'].me.list();
    let msg = await lib.discord.channels['@release'].messages.create({channel_id: event.data.options[0].options[1].value,
      content: ``,
      embeds: [{
        type: "rich",
        title: ` `,
        description: `Beep Boop, We need to check your not a robot!
Please press the button below to ${event.data.options[0].options[0].value == `button` ? `get verified` : `recieve a captcha. To answer it please type \`>captcha [code]\`.
You have as many attempts as you need, however this code will expire after 5 minutes`}`,
        color: 0x00FFFF,
        thumbnail: {url: `https://cdn.discordapp.com/emojis/915412257352060969.gif?size=96&quality=lossless`},
        author: {name: `Verify Here`, icon_url: me.avatar_url},
      }],
      components: [{type: 1, components: [{style: 3, label: `Verify`, custom_id: `verify`, type: 2}]}],
    });
    await lib.discord.channels['@0.3.0'].pins.create({message_id: msg.id, channel_id: msg.channel_id});
    await lib.discord.interactions['@release'].followups.create({token, content:  `
Members now must go to <#${event.data.options[0].options[1].value}> to get verified, with verification type ${event.data.options[0].options[0].value}.
Members will get the <@&${event.data.options[0].options[2].value}> role once they verify.`
    });
  } else {
    await lib.discord.interactions['@release'].followups.create({token, content: `Verification has been disabled.`})
    await lib.airtable.query['@1.0.0'].update({
      table: `Config`,
      where: [{'Guild__is': context.params.event.guild_id}],
      fields: {'Verify': ``, 'Member': ``, 'Type': `none`},
    });
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
          {name: 'Channel', value: `<#${event.data.options[0].options[1].value}>`},
          {name: 'Role', value: `<@&${event.data.options[0].options[2].value}>`},
          {name: 'Type', value: event.data.options[0].options[0].value},
          {name: 'Moderator', value: `${event.member.user.username}#${event.member.user.discriminator}`},
          {name: 'Time', value: `<t:${Math.floor(new Date().getTime() / 1000)}>`},
        ]
      }],
    });
  }
} else if (event.data?.options[0].name == `auto-moderation`) {
  let fType = ''
  let type = event.data.options[0].options[0].name
  let option = event.data.options[0].options[0].options[0].value.toString().replace('true', 'enabled').replace('false', 'disabled')
  if (type == `profanity-filter`) {
    fType = `Profanity Filter`
    await lib.airtable.query['@1.0.0'].update({
      table: `Config`,
      where: [{'Guild__is': context.params.event.guild_id}],
      fields: {'Profanity': event.data.options[0].options[0].options[0].value.toString()},
    });
  } else if (type == `anti-links`) {
    fType = `Anti Links`
    await lib.airtable.query['@1.0.0'].update({
      table: `Config`,
      where: [{'Guild__is': context.params.event.guild_id}],
      fields: {'Links': event.data.options[0].options[0].options[0].value.toString()},
    });
  } else if (type == `anti-invites`) {
    fType = `Anti Invites`
    await lib.airtable.query['@1.0.0'].update({
      table: `Config`,
      where: [{'Guild__is': context.params.event.guild_id}],
      fields: {'Invites': event.data.options[0].options[0].options[0].value.toString()},
    });
  } else if (type == `anti-everyone-ping`) {
    fType = `Anti Everyone Ping`
    await lib.airtable.query['@1.0.0'].update({
      table: `Config`,
      where: [{'Guild__is': context.params.event.guild_id}],
      fields: {'Everyone': event.data.options[0].options[0].options[0].value.toString()},
    });
  } else if (type == `anti-token-grabbers`) {
    fType = `Anti Token Grabbers`
    await lib.airtable.query['@1.0.0'].update({
      table: `Config`,
      where: [{'Guild__is': context.params.event.guild_id}],
      fields: {'Scams': event.data.options[0].options[0].options[0].value.toString()},
    });
  } else if (type == `anti-caps`) {
    option = event.data.options[0].options[0].options[0].value.toString() != 0 ? `set to ${event.data.options[0].options[0].options[0].value.toString()}%` : `disabled`
    fType = `Anti Caps`
    await lib.airtable.query['@1.0.0'].update({
      table: `Config`,
      where: [{'Guild__is': context.params.event.guild_id}],
      fields: {'Caps': event.data.options[0].options[0].options[0].value.toString()},
    });
  } else if (type == `anti-mass-mention`) {
    option = event.data.options[0].options[0].options[0].value.toString() != 0 ? `set to ${event.data.options[0].options[0].options[0].value.toString()} mentions` : `disabled`
    fType = `Anti Mass Mention`
    await lib.airtable.query['@1.0.0'].update({
      table: `Config`,
      where: [{'Guild__is': context.params.event.guild_id}],
      fields: {'Mentions': event.data.options[0].options[0].options[0].value.toString()},
    });
  }
  await lib.discord.interactions['@release'].followups.create({token, content: `${fType} has been ${option}`})
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
          {name: 'Moderator', value: `${event.member.user.username}#${event.member.user.discriminator}`},
          {name: 'Time', value: `<t:${Math.floor(new Date().getTime() / 1000)}>`},
        ]
      }],
    });
  }
} } catch (e) {
  await lib.discord.interactions['@release'].followups.ephemeral.create({token, content: `An error occurred, please try again\n\`\`\`${e.toString()}\`\`\``});
}