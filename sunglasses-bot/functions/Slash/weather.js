const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let info = await lib.http.request['@1.1.5'].get({
  url: `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${context.params.event.data.options[0].value}&aqi=no`,
});
let date = new Date(info.data.location.localtime)
let day = `${date.getDate()}${date.getDate().toString().endsWith('1') ? `st` : `${date.getDate().endsWith('2') ? `nd` : `${date.getDate().endsWith('3') ? `rd` : `th`}`}`}`
let month = date.getMonth().toString().replace('0', 'January').replace('1', 'February').replace('2', 'March').replace('3', 'April').replace('4', 'May').replace('5', 'June').replace('6', 'July').replace('7', 'August').replace('8', 'September').replace('9', 'October').replace('10', 'November').replace('11', 'December')

await lib.discord.interactions['@release'].responses.create({
  token: context.params.event.token,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  content: ``,
  embeds: [{
    type: 'rich',
    description: `
🗺️ ${info.data.location.name}, ${info.data.location.region}, ${info.data.location.country}
🕓 ${day} ${month} ${date.getFullYear()}  ${date.getHours()}:${date.getMinutes()}
📈 <t:${info.data.current.last_updated_epoch}:R>
🌦️ ${info.data.current.condition.text}
🌡️ ${info.data.current.temp_c}°C
🥵 ${info.data.current.feelslike_c}°C
🍃 ${info.data.current.wind_kph} kph
🧭 ${info.data.current.wind_dir.toLowerCase().length >= 2 ? `${info.data.current.wind_dir.toLowerCase().slice(1, 3)
.replace('ne', 'North East')
.replace('nw', 'North West')
.replace('se', 'South East')
.replace('sw', 'South West')}` : `${info.data.current.wind_dir.toLowerCase()
.replace('n', 'North')
.replace('e', 'East')
.replace('s', 'South')
.replace('w', 'West')}`}
${info.data.current.precip_mm > 0 ? `💧 ${info.data.current.precip_mm} mm\n` : ``}💦 ${info.data.current.humidity}%
☀️ ${info.data.current.uv}`,
    thumbnail: {url: `https:${info.data.current.condition.icon}`},
    color: parseInt(process.env.COLOR),
    timestamp: new Date().toISOString(),
    author: {name: `Weather In ${info.data.location.name}`, icon_url: `https:${info.data.current.condition.icon}`},
    footer: {text: `${context.params.event.member.user.username}#${context.params.event.member.user.discriminator}`, icon_url: context.params.event.member.user.avatar ? `https://cdn.discordapp.com/avatars/${context.params.event.member.user.id}/${context.params.event.member.user.avatar}.${context.params.event.member.user.avatar.startsWith('a_')?'gif':'png'}` : 'https://bit.ly/3KPnEKt'}
  }],
  components: [
    {type: 1, components: [
      {style: 1, label: `Metric`, custom_id: `weather-metric`, type: 2},
      {style: 2, label: `Imperial`, custom_id: `weather-imperial`, type: 2}
    ]}
  ],
});