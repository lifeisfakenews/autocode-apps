// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({//Defer interation -> gives the bot is thinking message
  token: context.params.event.token,
  response_type: 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE'
});
let user = await lib.discord.guilds['@0.2.3'].members.retrieve({//Gets the users roles
  user_id: context.params.event.member.user.id,
  guild_id: context.params.event.guild_id
});
let response = ``
let roles = user.roles
for (let i = 0; i < context.params.event.data.values.length; i++) {//Repeat for each selected role
  if (!roles.includes(context.params.event.data.values[i])) {//Check if user has the role
    roles.push(context.params.event.data.values[i])//Adds role to role list
    response = response + `+ <@&${context.params.event.data.values[i]}>\n`
  } else {
    let pos = roles.indexOf(context.params.event.data.values[i])//Gets position of role in role list
    if (pos != `-1`) {
      roles.splice(pos, 1)//Removes role from role list
      response = response + `-  <@&${context.params.event.data.values[i]}>\n`
    }
  }
}
await lib.discord.guilds['@0.2.3'].members.update({//Update the roles
  user_id: context.params.event.member.user.id,//Using member.update means you dont get ratelimited as quickly
  guild_id: context.params.event.guild_id,
  roles: roles
});
await lib.discord.interactions['@1.0.1'].followups.ephemeral.create({//Sends a folloups message to say which roles you where given/taken
  token: context.params.event.token,
  content: `**__Updated Roles:__**\n${response}`
});