const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let event = context.params.event;
let validMessage = '936574157624311858';
let validRoles = {
'1️⃣': '936542887783596032',//easy snipe
'2️⃣': '936542954682744843',//hard snipe
'3️⃣': '936543041890689046',//pre snipe
'📣': '911626594697773076',//mini announcement
'🎉': '911625555835748373',//giveaway
'📢': '911625760001896489',//announcement
'🤝': '911625691613765652'//partner ping
};
let validRole = validRoles[event.emoji.name];

if (event.message_id === validMessage && validRole) {
  await lib.discord.guilds['@0.1.0'].members.roles.update({
    role_id: validRole,
    user_id: context.params.event.user_id,
    guild_id: context.params.event.guild_id
  });
}