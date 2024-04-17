const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let event = context.params.event
let channel = await lib.utils.kv['@0.1.16'].get({key: `${event.guild_id}_channels`});//Get log channels
let userVC = await lib.utils.kv['@0.1.16'].get({key: `${event.user_id}_voice`});
if (channel?.voice || channel?.default) {
  if (event.channel_id != null) {
    if (userVC == null) {
      await require('../../voice/join.js')(context.params.event, channel?.voice || channel?.default)
      await lib.utils.kv['@0.1.16'].set({key: `${event.user_id}_voice`, value: event.channel_id});
    } else {
      if (userVC != event.channel_id) {
        await require('../../voice/move.js')(context.params.event, channel?.voice || channel?.default, userVC)
        await lib.utils.kv['@0.1.16'].set({key: `${event.user_id}_voice`, value: event.channel_id});
      } else {
        await require('../../voice/update.js')(context.params.event, channel?.voice || channel?.default)
      }
    }
  } else {
    await lib.utils.kv['@0.1.16'].clear({key: `${event.user_id}_voice`});
    await require('../../voice/leave.js')(context.params.event, channel?.voice || channel?.default)
  }
}