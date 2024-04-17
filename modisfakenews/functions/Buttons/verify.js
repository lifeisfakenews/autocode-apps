const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const randomstring = require('randomstring');
const jimp = require('jimp');
let event = context.params.event;
const { guild_id, channel_id, token } = event;
await lib.discord.interactions['@release'].responses.ephemeral.create({token, response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'});
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': guild_id}]});
if (!base.rows[0]) {await lib.airtable.query['@1.0.0'].insert({table: `Config`, fieldsets: [{'Guild_ID': guild_id}]});}
if (context.params.event.member.roles.includes(base.rows[0].fields.Member))
  return lib.discord.interactions['@release'].followups.ephemeral.create({token,
    content: `**${event.member.user.username}**, you are already verified.`
  });
if (base.rows[0].fields.Type == `button`) {
  await lib.discord.guilds['@release'].members.roles.update({guild_id,
    role_id: base.rows[0].fields.Member,
    user_id: event.member.user.id
  });
  await lib.discord.interactions['@release'].followups.ephemeral.create({token,
    content: `**${event.member.user.username}**, you have been verified.`
  });
} else if (base.rows[0].fields.Type == `captcha`) {
  let capCheck = await lib.airtable.query['@1.0.0'].select({
    table: `Captcha`,
    where: [{'User__is': event.member.user.id, 'Guild__is': guild_id}]
  });
  if (capCheck.rows.length) 
    return lib.discord.interactions['@release'].followups.ephemeral.create({token,
      content: `**${event.member.user.username}**, you already have a captcha.`
    });

  let captchaCode = randomstring.generate(5);
  let img = await jimp.read('https://cdn.discordapp.com/attachments/803970994410487859/879315910836486154/imageedit_5_3085185621.png');
  await jimp.loadFont(jimp.FONT_SANS_32_BLACK).then((font) => {
    img.print(
      font, 5, 5, {
        text: captchaCode,
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_CENTER,
      }, 105, 50
    );
  });
  let buffer = await img.getBufferAsync(jimp.MIME_GIF);
  await lib.discord.interactions['@release'].followups.ephemeral.create({token, 
    content: `Captcha for **${event.member.user.username}**\nPlease use \`>captcha [code]\` to complete it.`,
    attachments: [{filename: 'captcha.png', file: buffer}]
  });
  let d = new Date()
  await lib.airtable.query['@1.0.0'].insert({table: `Captcha`,
    fieldsets: [{
      'User': event.member.user.id,
      'Guild': guild_id,
      'Key': captchaCode,
      'Time': `${d.setMinutes(d.getMinutes() + 5)}`
    }],
  });
}