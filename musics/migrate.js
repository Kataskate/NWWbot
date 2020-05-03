const { play } = require("./play.js");

module.exports = {
  name: "migrate",
  description: "Move the bot to the user's voice channel.",
  usage: " ",
  async music(message, serverQueue, looping, queue, pool, repeat) {
    if(!message.member.voice.channel) {
      return message.channel.send("You are not in any voice channel!");
    }
    if(!message.guild.me.voice.channel) {
      return message.channel.send("I am not in any voice channel!");
    }
    if(message.member.voice.channelID === message.guild.me.voice.channelID) {
      return message.channel.send("I'm already in the same channel with you!");
    }
    if(!serverQueue) {
      return message.channel.send("There is nothing playing.");
    }
    if(!serverQueue.playing) {
      return message.channel.send("I'm not playing anything.");
    }
    if(!message.member.voice.channel.permissionsFor(message.guild.me).has(3145728)) {
      return message.channel.send("I don't have the required permissions to play music here!");
    }
    
    var oldChannel = serverQueue.voiceChannel;
    var begin = 0;
    if(serverQueue.connection != null && serverQueue.connection.dispatcher) {
      begin = serverQueue.connection.dispatcher.streamTime - serverQueue.startTime;
      serverQueue.connection.dispatcher.destroy();
    }
    serverQueue.playing = false;
    serverQueue.connection = null;
    serverQueue.voiceChannel = null;
    serverQueue.textChannel = null;
    if(message.guild.me.voice.channel) message.guild.me.voice.channel.leave();
    
    var voiceChannel = message.member.voice.channel;
    var msg = await message.channel.send("Migrating in 3 seconds...");
    
    setTimeout(async() => {
      if (
          !message.guild.me.voice.channel ||
          message.guild.me.voice.channelID !== voiceChannel.id
        ) {
          var connection = await voiceChannel.join();
        } else {
          await message.guild.me.voice.channel.leave();
          var connection = await voiceChannel.join();
        }
        serverQueue.voiceChannel = voiceChannel;
        serverQueue.connection = connection;
        serverQueue.playing = true;
        serverQueue.textChannel = message.channel;
        await queue.set(message.guild.id, serverQueue);
        play(message.guild, serverQueue.songs[0], looping, queue, pool, repeat, begin);
        msg.edit(`Moved from **${oldChannel.name}** to **${voiceChannel.name}**`);
      
    }, 3000);
  }
}