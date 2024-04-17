const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let messages = await lib.keyvalue.store['@0.1.16'].get({key: `${context.params.event.guild_id}_messages`, defaultValue: []});

messages.push(context.params.event)

await lib.keyvalue.store['@0.1.16'].set({key: `${context.params.event.guild_id}_messages`, value: messages});