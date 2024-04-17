const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.commands['@0.0.0'].create({
  name: "set-logging",
  description: "Set the logging channel for your server",
  options: [
    {type: 3, name: "actions", description: "The action type", required: true, choices: [
      {name: "Default", value: "default"},
      {name: "Role", value: "role"},
      {name: "Channel", value: "channel"},
      {name: "Thread", value: "thread"},
      {name: "Invite", value: "invites"},
      {name: "Emoji", value: "emoji"},
      {name: "Member", value: "member"},
      {name: "Voice", value: "voice"},
      {name: "Message", value: "message"}
    ]},
    {type: 7, name: "channel", description: "The channel to log actions to", required: true, channel_types: ['0']}
  ]
});