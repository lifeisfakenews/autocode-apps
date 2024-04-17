const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let request = await lib.http.request['@1.1.6'].get({
  url: `https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,racist,sexist,explicit`
});

await lib.discord.interactions['@release'].responses.create({
  token: context.params.event.token,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  content: request.data.type == `single` ? request.data.joke : `${request.data.setup}\n||${request.data.delivery || ``}||`,
});