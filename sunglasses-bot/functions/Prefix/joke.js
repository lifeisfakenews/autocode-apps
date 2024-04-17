const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let request = await lib.http.request['@1.1.6'].get({
  url: `https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,racist,sexist,explicit`
});

await lib.discord.channels['@release'].messages.create({
  channel_id: context.params.event.channel_id,
  content: request.data.type == `single` ? request.data.joke : `${request.data.setup}\n||${request.data.delivery || ``}||`,
});