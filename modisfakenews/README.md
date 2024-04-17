# Modisfakenews

This is the best moderation app with loas of andvanced features including
- Slash commands
- Multi-server
- Captcha verification system
- Dyno style case system
- Advanced lock command(works on private channels!)
- Warn counting
- Auto Moderation
- Context Menus
- Built In Appeals
- And so much more!

## Table of Contents

- [Setup](#setup)
- [Commands](#commands)
- [Auto Moderation](#automod)
- [Other Features](#features)
- [FAQ](#faq)
- [Credits](#credits)
- [Links & Support](#links)

<h2 id="setup">Setup</h2>

**1:** Press the install button

**2:** Link your Discord bot

**3:** Clone **[this Airtable Base](https://airtable.com/shrVJZ0aCUVLnqcav)** <b><ins>IF YOU SKIP THIS STEP IT WILL NOT WORK!</ins></b>, 

**4:** Link the base you have created, using the steps provided if you hav not linked an Airtable account before.

<img src="https://cdn.discordapp.com/attachments/911294620439293993/949695504793600040/unknown.png">

**5:** Set your env variables. 
  - <code>SUPPORT_SERVER</code> should be the invite link to your bots support server, preferably one that doesnt never expires
  - <code>EMOJI_GUILD</code> should be the ID of the guild you want your emojis to be created in. <b>Your bot must have access to this guild in order for the emojis to display correctly</b>
<img src="https://cdn.discordapp.com/attachments/911294620439293993/970589564953579580/unknown.png">

**6:** Your commands & context menu items should be created automatically. 
  - If they aren't you can run the `commands.js` file for commands & `context.js` file for context menu items.

Please remember that commands & context menu items may take up to an hour to appear

<h2 id="commands">Commands</h2>

`[]` - required

`{}` - optional

- `?ban [@user] {reason}` - ban a user from the server
- `?kick [@user] {reason}` - kick a user from the server
- `?soft-ban [@user] {reason}` - soft-ban a user, deleting thier messages
- `?time-out [@user] [time] {reason}` - time-out a user so that can't speak
- `?time-in [@user] {reason}` - remove the time-out from a user
- `?unban [user ID] {reason}` - unban a user from the server
- `?warn [@user] {reason}` - warn a user
- `?clear-warns [@user] {reason}` - clear all users warnings
- `?edit [case NO] [new reason]` - update the reason for a previous case
- `?slowmode [time] {reason}` - set the slowmode in that channel
- `?lock {reason}` - lock/unlock a channel to toggle members speaking
- `?lockdown {reason}` - lock all channels in the current server
- `?nuke {reason}` - clones the current channel to remove all messages
- `?purge [1-100] {reason}` - delete up to 100 messages
- `?help` - View a list of commands
- `?support` - Get your bots invite link and support server
- `?case [case NO]` - View the details about a previous case
- `?actions {@user}` - View moderation actions against a user
- `?mod-actions {@user}` - View the moderation actions made by a user
- `?warns {@user}` - View how many warns a user has
- `?user-info {@user}` - View info about a user
- `?server-info` - View info about this server
- `?role-info [@role]` - View info about a role
- `?setup logging [#channel]` - Set the logging channel
- `?setup reports [#channel]` - Set the reports channel
- `?setup appeals [#channel]` - Set the appeals channel
- `?setup moderator [@role]` - Set the moderator role
- `?setup verification [button/captcha/none] {#channel} {@role}` - Configure verification
- `?setup auto-moderation [auto mod] [true/false/int]` - Configure auto moderation (only `int` if auto mod is `anti-mass-mentions` or `anti-caps`)

![help](/readme/gallery/help.png)

<h2 id="automod">Auto Moderation</h2>

- Anti Profanity - Deletes messages containing swear words
- Anti Links - Deletes messages containing links
- Anti Invites - Deletes messages containing Discord server invites
- Anti Caps - Deletes messages with a certain amount of capitals in
- Anti Everyone Ping - Deletes messages containing @everyone and @here
- Anti Mass Mention - Deletes messages mentioning a certain amount of users
- Anti Token Grabbers - Deletes messages containing token grabbers

To configure auto moderation please use `?setup auto-moderation [AUTO-MOD-TYPE] [true/false/int(only for mass mention and caps)]`

E.G.

`?setup auto-moderation anti-links true` to enable anti links

`?setup auto-moderation anti-caps 50` to require 50% of a message to be caps for anti caps to trigger

![settings](/readme/gallery/settings.png)

<h2 id="features">Other Features</h2>

### Appeals

To setup the built in appeal system, use

`?setup appeals [APPEAL URL]`

A user can appeal by clicking the button in the DM they recieve

For ban, kick & soft bans a user is DMed regardless, however the button to appeal is only shown if an appeal link is set.

For time outs & warnings, a user is only DMed if there is an appeal link set.

### Verification

#### There a 2 diffrent types of verification:

- Captcha - you get a captcha code, you need to answer it with `?captcha [code]`
- Button - you press a button

#### How to setup:

To setup verification use `?setup [captcha/button/none] {#channel} {@role}`

- Channel is the channel members go to get verified
- Role is the role members get when the complete verification

**NOTE:** Channel & Role are required when type is set to captcha or button

E.G.

`?setup verification captcha #verify @Members` - Members go to #verify channel and must complete a captcha to get the Members role

`?setup verification none` - Verification is disabled

![captcha](/readme/gallery/captcha.png)

### Reporting

You can report users with the `Report` context menu item

This will send a message in the Reports channel

Set the Reports channel with `?setup reports [#channel]`

E.G.

`?setup reports #reports` - Sends Reports to #reports

![reports](/readme/gallery/report.png)

<h2 id="faq">FAQ</h2>
<h3>Please make sure you read this <ins>before</ins> you try and contact me about any errors. I will most likely tell you go read the FAQ/README anyway</h3>
<details><summary>How do i change the prefix?</summary>
<p>The current prefix is `?`</p>
<p>To change this you need to change the trigger for each file in the `functions/Prefix` folder to your prefered prefix.</p>
<p>E.G.</p>
<img src="https://cdn.discordapp.com/attachments/911294620439293993/970585844274569246/unknown.png">
<hr>
</details>
<details>
  <summary>My emojis are not working</summary>
  <p>Make sure that you put a valid guild ID that your bot has access in the <code>EMOJI_GUILD</code> variable. Run the emoji.js file if the emojis where not created</p>
  <b>Do not rename the emojis after they have created.</b>
</details>
<details>
  <summary>Where are my slash commands?</summary>
  <p>Make sure you run the `commands.js` file. Global commands may take up to 1 hour to appear</p>
</details>
<details>
  <summary>Where are my context menu items?</summary>
  <p>Make sure you run the `context.js` file. Global context menu items may take up to 1 hour to appear</p>
</details>
<details>
  <summary>When i run commands i get an error like `Could not find table Config in application...`</summary>
  <p>This most likely means tha you have not used the correct airtable base. Please read step 2 in the installaion instructions</p>
</details>
<details>
  <summary>When i try and create the commands i get the error <code>`Invalid Form Body: code 50035 - APPLICATION_COMMANDS_DUPLICATE_NAME`</code></summary>
  <p>This means that you are trying to create a command that already exists, E.G. if you already have a `/help` command and it is trying to create another one. This can be fixed by un-commenting line 4 and commenting line 2 as seen below</p>
  <img src="https://cdn.discordapp.com/attachments/893849678356029480/961525256676311090/unknown.png">
  <p>**NOTE:** this will delete all your existing commands!
</details>

<h2 id="credit">Credits</h2>

- User, Role & Server info commands were based on some snippets
- Captcha based on [this app](https://autocode.com/app/chinmay2/verificationcaptcha/) by chinmay

<h2 id="links">Links & Support</h2>

- Read the FAQ
- I've mostly moved on from this project but will fix bugs / provide support if i have a chance
- DM me `@lifeisfakenews` on Discord