const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = async (num, event) => {
  let snipeCH = {
    '905861315573186640': '936542887783596032',//Easy Ping
    '905862272893739008': '936542954682744843',//Hard Ping
    '906381975223414885': '936543041890689046'//Pre Ping
  }
  if ((num + 5) % 100 == 0) {
    await lib.discord.channels['@0.3.2'].messages.create({
      channel_id: `972256867432685638`,
      content: `<@&${snipeCH[event.channel_id]}> only 5 away from ${num + 5} in <#${event.channel_id}>`
    });
  }
  
  if (num % 100 == 0) {
    await lib.discord.guilds['@0.2.2'].members.roles.update({
      role_id: `905924479455223899`,//
      user_id: event.author.id,
      guild_id: event.guild_id
    });
  }
  if (num % 1000 == 0) {
    await lib.discord.guilds['@0.2.2'].members.roles.update({
      role_id: `905924923422277752`,//Super
      user_id: event.author.id,
      guild_id: event.guild_id
    });
  }
  if (num % 10000 == 0) {
    await lib.discord.guilds['@0.2.2'].members.roles.update({
      role_id: `905924926173773854`,//Mega
      user_id: event.author.id,
      guild_id: event.guild_id
    });
  }
}