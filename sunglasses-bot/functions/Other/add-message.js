const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const helpers = require('../../helpers/count');
let count = await lib.utils.kv['@0.1.16'].get({key: `count`});

if (context.params.event.content == parseInt(count.count) + 1 && count.user != context.params.event.author.id) {
  await lib.utils.kv['@0.1.16'].set({
    key: `count`, 
    value: {count: parseInt(count.count) + 1, user: context.params.event.author.id}
  });
  await lib.discord.webhooks['@0.1.0'].execute({
    webhook_id: `957623967995293696`,
    webhook_token: `6XQw3UQ_hwqlKlEnoiZHGoqE9h2w-o2AZ97yDN8tez5ihYDhH-W4Ay14w-9V0mU76Dvg`,
    content: `${parseInt(count.count) + 1}`,
    username: context.params.event.author.username,
    avatar_url: `https://cdn.discordapp.com/avatars/${context.params.event.author.id}/${context.params.event.author.avatar}.png`
  });
} else {
  await lib.discord.guilds['@0.2.3'].members.roles.update({
    role_id: `900059085918044170`,
    user_id: context.params.event.author.id,
    guild_id: context.params.event.guild_id
  });
}
await lib.discord.channels['@0.3.0'].messages.destroy({
  message_id: context.params.event.id,
  channel_id: context.params.event.channel_id
});
await helpers(context, count);