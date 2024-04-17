const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let commands = await lib.discord.commands['@release'].list(); //Keeps Other Commands
//let commands = [];//Clears Other Commands
//-------------------------------------------------------------Other Commands---------------------------------------------------------------
commands.push({
  name: `help`,
  description: `View a list of commands`,
});
commands.push({
  name: `support`,
  description: `View my links`,
});
commands.push({
  name: `user-info`,
  description: `Get info about a user`,
  options: [{type: 6, name: `user`, description: `The user to get info for`}],
});
commands.push({
  name: `role-info`,
  description: `Get info about a role`,
  options: [
    {
      type: 8,
      name: `role`,
      description: `The role to get info for`,
      required: true,
    },
  ],
});
commands.push({
  name: `server-info`,
  description: `Get info about this server`,
});
commands.push({
  name: `settings`,
  description: `View the current server settings`,
});
commands.push({
  name: `warns`,
  description: `View a users warns`,
  options: [{type: 6, name: `user`, description: `The user to view warns for`}],
});
commands.push({
  name: `actions`,
  description: `View a list of moderation actions taken against a user`,
  options: [
    {type: 6, name: `user`, description: `The user to view actions for`},
  ],
});
commands.push({
  name: `mod-actions`,
  description: `View a list of moderation actions made by a user`,
  options: [
    {type: 6, name: `user`, description: `The user to view mod-actions for`},
  ],
});
commands.push({
  name: `case`,
  description: `View details about a case`,
  options: [{type: 4, name: `case`, description: `The case to view`}],
});
//-----------------------------------------------------------Moderation Commands------------------------------------------------------------
commands.push({
  name: `warn`,
  description: `Warn a user`,
  options: [
    {type: 6, name: `user`, description: `The user to warn`, required: true},
    {type: 3, name: `reason`, description: `The reason for the warn`},
  ],
});
commands.push({
  name: `ban`,
  description: `Ban a user`,
  options: [
    {type: 6, name: `user`, description: `The user to ban`, required: true},
    {type: 3, name: `reason`, description: `The reason for the ban`},
  ],
});
commands.push({
  name: `kick`,
  description: `Kick a user`,
  options: [
    {type: 6, name: `user`, description: `The user to kick`, required: true},
    {type: 3, name: `reason`, description: `The reason for the kick`},
  ],
});
commands.push({
  name: `softban`,
  description: `Softban a user (deletes messages)`,
  options: [
    {type: 6, name: `user`, description: `The user to softban`, required: true},
    {type: 3, name: `reason`, description: `The reason for the softban`},
  ],
});
commands.push({
  name: `time-in`,
  description: `Time in a user`,
  options: [
    {type: 6, name: `user`, description: `The user to time in`, required: true},
    {type: 3, name: `reason`, description: `The reason for the time in`},
  ],
});
commands.push({
  name: `clear-warns`,
  description: `Clear a users warnings`,
  options: [
    {
      type: 6,
      name: `user`,
      description: `The user to clear warnings for`,
      required: true,
    },
    {
      type: 3,
      name: `reason`,
      description: `The reason for clearing the warnings`,
    },
  ],
});
commands.push({
  name: `time-out`,
  description: `Time out a user`,
  options: [
    {
      type: 6,
      name: `user`,
      description: `The user to time out`,
      required: true,
    },
    {
      type: 3,
      name: `duration`,
      description: `The duration of the time out. Up to 28 days`,
      required: true,
    },
    {type: 3, name: `reason`, description: `The reason for the time out`},
  ],
});
commands.push({
  name: `unban`,
  description: `Unban a user`,
  options: [
    {
      type: 3,
      name: `user-id`,
      description: `The user to unban`,
      required: true,
    },
    {type: 3, name: `reason`, description: `The reason for the unban`},
  ],
});
commands.push({
  name: `slowmode`,
  description: `Set slowmode in the current channel`,
  options: [
    {
      type: 4,
      name: `duration`,
      description: `The length of slowmode, in seconds`,
      required: true,
    },
    {type: 3, name: `reason`, description: `The reason for settings slowmode`},
  ],
});
commands.push({
  name: `purge`,
  description: `Purge messages in the current channel`,
  options: [
    {
      type: 4,
      name: `number`,
      description: `The number of messages to delete. 1-100`,
      required: true,
    },
    {
      type: 3,
      name: `reason`,
      description: `The reason for purging the messages`,
    },
  ],
});
commands.push({
  name: `nuke`,
  description: `Nukes the channel, deleteing all messages`,
  options: [
    {type: 3, name: `reason`, description: `The reason for nuking the channel`},
  ],
});
commands.push({
  name: `lock`,
  description: `Locks or Unlocks the current channel. (Toggle)`,
  options: [
    {
      type: 3,
      name: `reason`,
      description: `The reason for locking/unlocking the channel`,
    },
  ],
});
commands.push({
  name: `edit`,
  description: `Update the reason for a previous case`,
  options: [
    {type: 4, name: `case`, description: `The case to update`, required: true},
    {type: 3, name: `reason`, description: `The new reason`, required: true},
  ],
});
//-------------------------------------------------------------Setup Command----------------------------------------------------------------
commands.push({
  name: `setup`,
  description: `Configure stuff`,
  options: [
    {
      type: 1,
      name: `moderator`,
      description: `Set the moderator role`,
      options: [
        {
          type: 8,
          name: `role`,
          description: `Your moderator role`,
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: `appeals`,
      description: `Set the appeals link`,
      options: [
        {
          type: 3,
          name: `link`,
          description: `appeals link`,
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: `logging`,
      description: `Set the logging channel`,
      options: [
        {
          type: 7,
          name: `channel`,
          description: `The channel you want moderation logs to go to`,
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: `reports`,
      description: `Set the reports channel`,
      options: [
        {
          type: 7,
          name: `channel`,
          description: `The channel you want reports to go to`,
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: `verification`,
      description: `Setup the verification for new members`,
      options: [
        {
          type: 3,
          name: `type`,
          description: `The type of verification. Channel & role are required if not set to 'None'`,
          required: true,
          choices: [
            {name: `Captcha`, value: `captcha`},
            {name: `Button`, value: `button`},
            {name: `None`, value: `none`},
          ],
        },
        {
          type: 7,
          name: `channel`,
          description: `The channel members go to get verified`,
        },
        {
          type: 8,
          name: `role`,
          description: `The role members should get when they are verifed`,
        },
      ],
    },
    {
      type: 2,
      name: `auto-moderation`,
      description: `Configure the auto moderation`,
      options: [
        {
          type: 1,
          name: `profanity-filter`,
          description: `Stop users from swearing`,
          options: [
            {
              type: 5,
              name: `enabled`,
              description: `Turn the profanity filter on or off`,
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: `anti-links`,
          description: `Stop users from sending links`,
          options: [
            {
              type: 5,
              name: `enabled`,
              description: `Turn anti-links on or off`,
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: `anti-invites`,
          description: `Stop users from sending Discord server links`,
          options: [
            {
              type: 5,
              name: `enabled`,
              description: `Turn anti-invites  on or off`,
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: `anti-token-grabbers`,
          description: `Stop users from sending malicious links`,
          options: [
            {
              type: 5,
              name: `enabled`,
              description: `Turn anti-token-grabbers on or off`,
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: `anti-everyone-ping`,
          description: `Stop users from pinging @everyone & @here`,
          options: [
            {
              type: 5,
              name: `enabled`,
              description: `Turn anti-everyone-ping on or off`,
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: `anti-mass-mention`,
          description: `Stop users from mentioning lots of members`,
          options: [
            {
              type: 4,
              name: `amount`,
              description: `Number of mentions to allow (0 to disable)`,
              required: true,
            },
          ],
        },
        {
          type: 1,
          name: `anti-caps`,
          description: `Stop users from sending messages with lots of caps in`,
          options: [
            {
              type: 4,
              name: `amount`,
              description: `Percentage of caps in message to allow (0 to disable)`,
              required: true,
            },
          ],
        },
      ],
    },
  ],
});
await lib.discord.commands['@release'].bulkOverwrite({commands});
