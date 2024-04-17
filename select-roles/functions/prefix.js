// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
//Permission Checking
let isAdmin = false
let guildInfo = await lib.discord.guilds['@release'].retrieve({//Get server info
  guild_id: context.params.event.guild_id
});
let roleList = await lib.discord.guilds['@release'].roles.list({//Get all roles in server
  guild_id: context.params.event.guild_id
});
roles = roleList.filter(role => context.params.event.member.roles.includes(role.id));//Filter out roles the user does not have
if (guildInfo.owner_id == context.params.event.author.id) isAdmin = true//Checks if the user is server owner
for (let i = 0; i < roles.length; i++) {
  if (roles[i].permission_names.includes('ADMINISTRATOR')) {//Check if any roles have the Administrator permission
  isAdmin = true; break
  }
}
if (isAdmin) {
  //The main Command
  if (context.params.event.mention_roles?.length && context.params.event.mention_roles?.length <= 25) {//Check if user mentions roles and there isnt to many(max select menu options is 25)
    let menuRoles = []
    for (let i = 0; i < roleList.length; i++) {//Repeat for each role
      let roleNum = i
      for (let i = 0; i < context.params.event.mention_roles?.length; i++) {//Repeat for each mentioned role
        if (roleList[roleNum].id == context.params.event.mention_roles[i]) {//Check if the role was mentioned
          menuRoles.push({//Add the role to the select menu
            label: roleList[roleNum].name,//Sets the option name to the role name
            value: roleList[roleNum].id,//Set value to the role ID -> dont change this
            description: `Get the ${roleList[roleNum].name} role`//Set the description -> you can change this
          });
          break
        }
      }
    }
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: context.params.event.channel_id,
      content: `**__Get your roles here:__**\nPlease use the select menu below to pick the roles you want.`,
      components: [{
        type: 1, components: [{
          custom_id: `roles`,//Dont change this
          placeholder: `Select Some Roles`,//You can change this
          options: menuRoles,//Set options in the select menu
          min_values: 1,
          max_values: menuRoles.length,//Sets the max amount of role to the number of roles available
          type: 3
        }],
      }],
    });
  } else {
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: context.params.event.channel_id,
      content: `**${context.params.event.author.username}**, you need to mention between 1 and 25 roles!`
    });
  }
}