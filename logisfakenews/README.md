# Logisfakenews

With this app you can log basically everytime time a user creates, deletes or updates something in your server. It will log role, channel, guild, user updates and more!

## Table of Contents

- [Setup](#setup)
- [Updates](#update)
- [Features](#features)
- [Commands](#commands)
- [Logged Events](#logs)
- [Links & Support](#links)

<h2 id="setup">Setup</h2>

1. Press install
2. Link your discord bot
3. Your done!

<h2 id="update">Updates</h2>

<h3>1.0.1</h3>

- Fixed issues with custom emojis

<h2 id="features">Features</h2>

- Multi Server
- Per Category Log Channels:
  - Default
  - Channel
  - Message
  - Member
  - Invite
  - Thread
  - Emoji
  - Voice
  - Role
- Logs all events possible in Autocode
- Provides data from the audit log about who performed the action as well as what they changed

<h2 id="commands">Commands</h2>

- `/set-logging <category> <channel>` - Set the logging channels for each category

<h2 id="logs">Logged Events</h2>

<details>
  <summary>Channel Create</summary>
  <ul>
  <li><b>Category:</b> Channel</li>
  <li><b>File:</b> <code>functions/Create/channel.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Channel Created</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977834024829583360/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Channel Update</summary>
  <ul>
  <li><b>Category:</b> Channel</li>
  <li><b>File:</b> <code>functions/Update/channel.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Channel Name Changed</li>
  <li>Channel Perms Changed</li>
  <li>Channel Topic Changed</li>
  <li>Channel Type Changed</li>
  <li>Channel NSFW Toggled</li>
  <li>Channel Slowmode Changed</li>
  <li>Channel Position Changed</li>
  <li>Channel Category Changed</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977834281042841660/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Channel Delete</summary>
  <ul>
  <li><b>Category:</b> Channel</li>
  <li><b>File:</b> <code>functions/Delete/channel.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Channel Deleted</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977834441818923028/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Thread Create</summary>
  <ul>
  <li><b>Category:</b> Thread</li>
  <li><b>File:</b> <code>functions/Create/thread.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Thread Created</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977841374944706570/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Thread Update</summary>
  <ul>
  <li><b>Category:</b> Thread</li>
  <li><b>File:</b> <code>functions/Update/thread.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Thread Name Changed</li>
  <li>Thread Slowmode Changed</li>
  <li>Thread Archive Duration</li>
  <li>Thread Archived</li>
  <li>Thread Unarchived</li>
  <li>Thread Locked</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977841805322240090/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Thread Delete</summary>
  <ul>
  <li><b>Category:</b> Thread</li>
  <li><b>File:</b> <code>functions/Delete/thread.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Thread Deleted</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977842250421764176/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Role Create</summary>
  <ul>
  <li><b>Category:</b> Role</li>
  <li><b>File:</b> <code>functions/Create/role.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Role Created</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977835322647937054/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Role Update</summary>
  <ul>
  <li><b>Category:</b> Role</li>
  <li><b>File:</b> <code>functions/Update/role.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Role Name Changed</li>
  <li>Role Perms Changed</li>
  <li>Role Color Changed</li>
  <li>Role Position Changed</li>
  <li>Role Hoisted</li>
  <li>Role Mentionable</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977835968285532170/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Role Delete</summary>
  <ul>
  <li><b>Category:</b> Role</li>
  <li><b>File:</b> <code>functions/Delete/role.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Role Deleted</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977836170090254346/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Emoji Create</summary>
  <ul>
  <li><b>Category:</b> Emoji</li>
  <li><b>File:</b> <code>functions/Create/emoji.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Emoji Created</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977837461344497664/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Emoji Update</summary>
  <ul>
  <li><b>Category:</b> Emoji</li>
  <li><b>File:</b> <code>functions/Update/emoji.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Emoji Name Changed</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977837926165676103/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Emoji Delete</summary>
  <ul>
  <li><b>Category:</b> Emoji</li>
  <li><b>File:</b> <code>functions/Delete/emoji.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Emoji Deleted</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977838130080149524/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Pin Create</summary>
  <ul>
  <li><b>Category:</b> Message</li>
  <li><b>File:</b> <code>functions/Update/pins.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Message Pinned</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977838747246809128/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Pin Delete</summary>
  <ul>
  <li><b>Category:</b> Message</li>
  <li><b>File:</b> <code>functions/Update/pins.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Message Unpinned</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977838908786212894/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Message Updated</summary>
  <ul>
  <li><b>Category:</b> Message</li>
  <li><b>File:</b> <code>functions/Update/message.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Message Edited</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/995732641989017660/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Message Delete</summary>
  <ul>
  <li><b>Category:</b> Message</li>
  <li><b>File:</b> <code>functions/Delete/message.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Message Deleted</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/995732815482204201/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Member Update</summary>
  <ul>
  <li><b>Category:</b> Member</li>
  <li><b>File:</b> <code>functions/Update/member.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Nickname Changed</li>
  <li>Member Roles Changed</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977839591568576512/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Ban Create</summary>
  <ul>
  <li><b>Category:</b> Member</li>
  <li><b>File:</b> <code>functions/Create/ban.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>User Banned</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977839957550972939/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Ban Delete</summary>
  <ul>
  <li><b>Category:</b> Member</li>
  <li><b>File:</b> <code>functions/Delete/ban.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Member Unbanned</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977840194394914816/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Invite Create</summary>
  <ul>
  <li><b>Category:</b> Invite</li>
  <li><b>File:</b> <code>functions/Create/invite.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Invite Created</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977840631512727653/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>Invite Delete</summary>
  <ul>
  <li><b>Category:</b> Invite</li>
  <li><b>File:</b> <code>functions/Delete/invite.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>Invite Deleted</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/977840773787713606/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>User Join VC</summary>
  <ul>
  <li><b>Category:</b> Voice</li>
  <li><b>File:</b> <code>functions/Update/voice.js</code> & <code>voice/join.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>User Joined VC</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/995712588954468422/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>User VC State Update</summary>
  <ul>
  <li><b>Category:</b> Voice</li>
  <li><b>File:</b> <code>functions/Update/voice.js</code> & <code>voice/update.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>User Self Muted</li>
  <li>User Self Deafened</li>
  <li>User Muted</li>
  <li>User Deafened</li>
  <li>User Supressed</li>
  <li>User Video Enabled</li>
  <li>User Video Disabled</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/995713785530699846/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>User Move VC</summary>
  <ul>
  <li><b>Category:</b> Voice</li>
  <li><b>File:</b> <code>functions/Update/voice.js</code> & <code>voice/move.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>User Move VC</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/995714326881124453/unknown.png">
  </li>
  </ul>
</details>
<details>
  <summary>User Leave VC</summary>
  <ul>
  <li><b>Category:</b> Voice</li>
  <li><b>File:</b> <code>functions/Update/voice.js</code> & <code>voice/leave.js</code></li>
  <li><b>Triggers:</b><ul>
  <li>User Leave VC</li>
  <li>User Disconnected From VC</li>
  </ul></li>
  <li><b>Log Example:</b><br>
  <img src="https://cdn.discordapp.com/attachments/972413179890130964/995741737601466378/unknown.png">
  </li>
  </ul>
</details>

<h2 id="links">Links & Support</h2>

- If you need help please ask in [my server](https://discord.gg/q8R44ksqt4):
  - Send your issue in <code>#📝「logisfakenews」</code>
  - Please also tell me what event you are having issues with
  - (Not providing this info just means i will ask for it and therefore it will take longer to get your issue resolved)
- My discord user [lifeisfakenews#0404](https://discord.com/users/760170825629958184)
- My discord server [LIFN Bots](https://discord.gg/q8R44ksqt4)