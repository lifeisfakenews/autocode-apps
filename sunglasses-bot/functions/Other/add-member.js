const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const requestImageSize = require('request-image-size');
const messages = require('../../welcome/messages.json');
const cards = require('../../welcome/images.json');
const card = cards[Math.floor(Math.random() * cards.length)];
const image = await requestImageSize(card);
const Canvas = require('canvas');
const canvas = Canvas.createCanvas(700, 250);
const ctx = canvas.getContext('2d');
const jimp = require('jimp');
const guild = await lib.discord.guilds['@0.1.0'].retrieve({guild_id: context.params.event.guild_id, with_counts: true});
Canvas.registerFont(require('@canvas-fonts/arial-bold'), {family: 'Arial Bold'});
if (context.params.event.guild_id != `891409977355419648`) return

let scale = Math.max(canvas.width / image.width, canvas.height / image.height);
let x = canvas.width / 2 - (image.width / 2) * scale
let y = canvas.height / 2 - (image.height / 2) * scale
let background = await jimp.read(card);
let layer = await Canvas.loadImage('https://cdn.discordapp.com/attachments/842609787391705118/901877097545490452/Untitled_4.png');
background = await background.getBufferAsync('image/png');
ctx.drawImage(
  await Canvas.loadImage(background),
  x,
  y,
  image.width * scale,
  image.height * scale
);
ctx.strokeRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(layer, 0, 0, canvas.width, canvas.height);
//ADD USERNAME
let name = context.params.event.user.username.length > 18 ? context.params.event.user.username.substring(0, 14).trim() + '...' : context.params.event.user.username;
ctx.font = `bold 36px Arial Bold`;
ctx.fillStyle = '#FFFFFF';
ctx.textAlign = 'start';
ctx.strokeStyle = '#f5f5f5';
ctx.fillText(name, 278, 113);
ctx.strokeText(name, 278, 113);
//ADD TAG & MEMBER COUNT
ctx.font = `bold 25px Arial Bold`;
ctx.fillStyle = '#FFFFFF';
ctx.fillText(`#${context.params.event.user.discriminator} Member: ${guild.approximate_member_count}`, 278, 150);
//ADD AVATAR
let avatar = await jimp.read(`https://cdn.discordapp.com/avatars/${context.params.event.user.id}/${context.params.event.user.avatar}.jpg`);
avatar.resize(1024, 1024);
avatar.circle();
avatar = await avatar.getBufferAsync('image/png');
avatar = await Canvas.loadImage(avatar);
ctx.drawImage(avatar, 67, 48, 155, 155);
//SEND MESSAGE
await lib.discord.channels['@0.3.0'].messages.create({
  channel_id: `895542697421602856`,
  content: messages[Math.floor(Math.random() * messages.length)].replace('{{member_username}}', `${context.params.event.user.username}`),
  attachments: [{
    file: canvas.toBuffer(),
    filename: 'welcome.png',
  }]
});
//INVITES
let invites = await lib.discord.invites['@0.1.0'].list({guild_id: context.params.event.guild_id});
let invite
for (let i = 0; i < invites.length; i++) {
  let uses = await lib.utils.kv['@0.1.16'].get({key: `${invites[i].code}_invite`});
  if (uses + 1 == invites[i].uses) {
    invite = invites[i]
    await lib.utils.kv['@0.1.16'].set({key: `${invites[i].code}_invite`, value: invites[i].uses});
    break;
  }
}
let score = await lib.googlesheets.query['@0.3.0'].select({
  range: `Invites!A:E`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': invite.inviter.id}],
});
if (!score?.rows?.length) {
  score = await lib.googlesheets.query['@0.3.0'].insert({
    range: `Invites!A:E`,
    fieldsets: [{
      'User': invite.inviter.id,
      'Total': 0,
      'Real': 0,
      'Left': 0,
      'Bonus': 0
    }]
  });
}
await lib.discord.channels['@release'].messages.create({
  channel_id: `1008021482330394624`, 
  content: `
╭ Everyone welcome **${context.params.event.user.username}#${context.params.event.user.discriminator}** 
●▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬●
・Invited by **${invite.inviter.username}#${invite.inviter.discriminator}**
・${invite.inviter.username} now has ${parseInt(score.rows[0].fields.Total) + 1} invites!
●▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬●
╰ We now have ${guild.approximate_member_count} members`,
});
await lib.googlesheets.query['@0.3.0'].insert({
  range: `Inviters!A:C`,
  fieldsets: [{
    'User': context.params.event.user.id,
    'Inviter': invite.inviter.id,
    'Left': false
  }]
});
await lib.googlesheets.query['@0.3.0'].update({
  range: `Invites!A:E`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{'User__is': invite.inviter.id}],
  fields: {
    'Total': parseInt(score.rows[0].fields.Total) + 1,
    'Real': parseInt(score.rows[0].fields.Real) + 1
  }
});

await lib.discord.guilds['@0.2.4'].members.roles.update({
  role_id: `896446307730853889`,//Normie Sunglasses
  user_id: context.params.event.user.id,
  guild_id: context.params.event.guild_id
});
await lib.discord.guilds['@0.2.4'].members.roles.update({
  role_id: `923593826680057907`,//Pronouns
  user_id: context.params.event.user.id,
  guild_id: context.params.event.guild_id
});
await lib.discord.guilds['@0.2.4'].members.roles.update({
  role_id: `902827592061689887`,//Pings
  user_id: context.params.event.user.id,
  guild_id: context.params.event.guild_id
});
await lib.discord.guilds['@0.2.4'].members.roles.update({
  role_id: `896384154638368779`,//Server Stuff
  user_id: context.params.event.user.id,
  guild_id: context.params.event.guild_id
});

await lib.discord.users['@release'].me.status.update({
  activity_name: `?help | ${guild.approximate_member_count} members!`,
  activity_type: `GAME`,
  status: `ONLINE`
});