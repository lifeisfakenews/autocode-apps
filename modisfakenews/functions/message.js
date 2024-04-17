const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const event = context.params.event
const { guild_id, channel_id, member} = event;
let emojis = await lib.utils.kv['@0.1.16'].get({key: `emojis`, defaultValue: {moderator: null, user: null, reason: null, channel: null, error: null, timeout: null, clock: null}});
let base = await lib.airtable.query['@1.0.0'].select({table: `Config`, where: [{'Guild__is': guild_id}]});
if (!base?.rows?.length) base = await lib.airtable.query['@1.0.0'].insert({table: `Config`, fieldsets: [{'Guild': guild_id}]});
let cNum = (await lib.airtable.query['@1.0.0'].max({table: `Cases`, where: [{'Guild__is': guild_id}], field: `Case`})).max.max + 1
let guildInfo = await lib.discord.guilds['@0.2.4'].retrieve({guild_id});
if (guildInfo.owner_id == event.author.id) return
if (member.roles.includes(base.rows[0].fields.Moderator)) return
if (guildInfo.roles.filter(role => (role.permissions & (1 << 3)) === 1 << 3 && member.roles.includes(role.id))?.length) return

if (base.rows[0].fields.Profanity == `true`) {
  try {
    await require('../helpers/AutoMod/anti-profanity.js')(context.params.event, emojis, base.rows[0].fields.Logging)
  } catch (e) {console.log(e)}
} else if (base.rows[0].fields.Scams == `true`) {
  try {
    await require('../helpers/AutoMod/anti-scams.js')(context.params.event, emojis, base.rows[0].fields.Logging)
  } catch (e) {console.log(e)}
} else if (base.rows[0].fields.Invites == `true`) {
  try {
    await require('../helpers/AutoMod/anti-invites.js')(context.params.event, emojis, base.rows[0].fields.Logging)
  } catch (e) {console.log(e)}
} else if (base.rows[0].fields.Links == `true`) {
  try {
    await require('../helpers/AutoMod/anti-links.js')(context.params.event, emojis, base.rows[0].fields.Logging)
  } catch (e) {console.log(e)}
} else if (base.rows[0].fields.Caps && base.rows[0].fields.Caps != `0`) {
  try {
    await require('../helpers/AutoMod/anti-caps.js')(context.params.event, base.rows[0].fields.Caps, emojis, base.rows[0].fields.Logging)
  } catch (e) {console.log(e)}
} else if (base.rows[0].fields.Everyone == `true`) {
  try {
    await require('../helpers/AutoMod/anti-@everyone.js')(context.params.event, emojis, base.rows[0].fields.Logging)
  } catch (e) {console.log(e)}
} else if (base.rows[0].fields.Mentions && base.rows[0].fields.Mentions != `0`) {
  try {
    await require('../helpers/AutoMod/mass-mentions.js')(context.params.event, base.rows[0].fields.Mentions, emojis, base.rows[0].fields.Logging)
  } catch (e) {console.log(e)}
}