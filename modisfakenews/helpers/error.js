const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = {
  slash: async (token, channel_id, error) => {
    let emojis = await lib.utils.kv['@0.1.16'].get({key: `emojis`, defaultValue: {moderator: null, user: null, reason: null, channel: null, error: null, timeout: null, clock: null}});
    if (error.includes('Failed to respond to the specified interaction')) {
      try {
        return lib.discord.channels['@release'].messages.create({channel_id,
          content: `<:error:${emojis.error}> | Failed to responsd to the interaction. Please try again!`
        });
      } catch (e) {
        if (e.includes('It appears you are using test data')) console.error(`Please test from discord instead of using the run button.`)
      }
    }
    if (error.includes('You are being rate limited.'))
      error = `You are being rate limited! Please slow down.`
    else if (error.includes('Missing Permissions'))
      error = `I don't have the permissions to moderate that user! Make sure that your not trying to moderate someone with a higher role than me or the owner & that i have the correct permissions.`
    else if (error.includes('Could not find table'))
      error = `You have not linked the correct Airtable base! Please clone this template and link it instead:\nhttps://airtable.com/shrVJZ0aCUVLnqcav`
    else console.log(error)

    await lib.discord.interactions['@release'].followups.ephemeral.create({token,
      content: `<:error:${emojis.error}> | ${error}`
    });
  },
  prefix: async (channel_id, error) => {
    let emojis = await lib.utils.kv['@0.1.16'].get({key: `emojis`, defaultValue: {moderator: null, user: null, reason: null, channel: null, error: null, timeout: null, clock: null}});
    if (error.includes('It appears you are using test data'))
      console.error(`Please test from discord instead of using the run button.`)
    if (error.includes('You are being rate limited.'))
      error = `You are being rate limited! Please slow down.`
    else if (error.includes('Missing Permissions'))
      error = `I don't have the permissions to moderate that user! Make sure that your not trying to moderate someone with a higher role than me or the owner & that i have the correct permissions.`
    else if (error.includes('Could not find table'))
      error = `You have not linked the correct Airtable base! Please clone this template and link it instead:\nhttps://airtable.com/shrVJZ0aCUVLnqcav`
    else console.log(error)

    await lib.discord.channels['@release'].messages.create({channel_id,
      content: `<:error:${emojis.error}> | ${error}`
    });
  },
}