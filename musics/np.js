const Discord = require("discord.js");
const request = require("request-stream");
const requestStream = url => {
  return new Promise(resolve => {
    request(url, (err, res) => resolve(res));
  });
};
const mm = require("music-metadata");
const moment = require("moment");
const formatSetup = require("moment-duration-format");
formatSetup(moment);
const ytdl = require("ytdl-core-discord");

module.exports = {
  name: "np",
  description: "Display the music being played.",
  aliases: ["nowplaying"],
  usage: " ",
  async music(message, serverQueue) {
    if (!serverQueue) return message.channel.send("There is nothing playing.");
    if(serverQueue.songs.length < 1) return message.channel.send("Nothing is in the queue now.");
    var position = 0;
    if(serverQueue.connection && serverQueue.connection.dispatcher) position = (serverQueue.connection.dispatcher.streamTime - serverQueue.startTime);
    var processBar = [];
    for(let i = 0; i < 20; i++) processBar.push("=");
    var progress = 0;
    switch(serverQueue.songs[0].type) {
      case 0:
      case 1:
        var songInfo = await ytdl.getInfo(serverQueue.songs[0].url).catch(console.error);
        var length = parseInt(songInfo.length_seconds);
        break;
      case 2:
        var stream = await requestStream(serverQueue.songs[0].url).catch(console.error);
        var metadata = await mm.parseStream(stream).catch(console.error);
        var length = Math.round(metadata.format.duration);
        break;
    }
    var songLength = moment.duration(length, "seconds").format();
    var positionTime = moment.duration(Math.round(position / 1000), "seconds").format();
    if(position === 0 || isNaN(position))
      positionTime = "0:00";
    var totalLength = Math.round(length * 1000);
    progress = Math.floor((position / totalLength) * processBar.length);
    processBar.splice(progress, 1, "+");
    
    var info = [];
  var embed = new Discord.MessageEmbed()
    .setColor(Math.floor(Math.random() * 16777214) + 1)
    .setTitle("Now playing:" + (serverQueue.playing ? "" : " (Not actually)"))
    .setTimestamp()
    .setTimestamp()
    .setFooter("Have a nice day! :)", message.client.user.displayAvatarURL());
    if(serverQueue.songs[0].type === 0 || serverQueue.songs[0].type === 3) info = [`**[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})**\nLength: **${serverQueue.songs[0].time}**`, serverQueue.songs[0].thumbnail];
    if(serverQueue.songs[0].type === 1) info = [`**[${serverQueue.songs[0].title}](${serverQueue.songs[0].spot})**\nLength: **${serverQueue.songs[0].time}**`, serverQueue.songs[0].thumbnail];
    if(serverQueue.songs[0].type === 2) info = [`**[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})**\nLength: **${serverQueue.songs[0].time}**`];
    embed.setDescription(`${info[0]}\n\n${positionTime} **${processBar.join("")}** ${songLength}`).setThumbnail(info[1]);
  return message.channel.send(embed).then(msg => {
    setTimeout(() => {
      msg.edit({ embed: null, content: "**[Insert Displayed Information Here]**" });
    }, 30000);
  });
  }
}