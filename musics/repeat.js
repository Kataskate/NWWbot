module.exports = {
  name: "repeat",
  description: "Toggle repeat of a song.",
  usage: " ",
  aliases: ["rep", "rp"],
  music(message, serverQueue, looping, queue, pool, repeat) {
  const guildLoopStatus = looping.get(message.guild.id);
  const guildRepeatStatus = repeat.get(message.guild.id);
  if (guildRepeatStatus === undefined || guildRepeatStatus === null || !guildRepeatStatus) {
    repeat.set(message.guild.id, true);
    if(guildLoopStatus === true) {
      looping.set(message.guild.id, false);
      message.channel.send("Disabled looping to prevent conflict.");
    }
    pool.getConnection(function(err, con) {
        if(err) return message.reply("there was an error trying to connect to the database!");
        con.query("UPDATE servers SET repeating = 1, looping = NULL WHERE id = '" + message.guild.id + "'", function(err) {
          if(err) return message.reply("there was an error trying to update the status!");
          message.channel.send("The song is now being repeated.");
        });
        con.release();
      });
  } else {
    if (guildRepeatStatus === false) {
      repeat.set(message.guild.id, true);
      if(guildLoopStatus === true) {
        looping.set(message.guild.id, false);
        message.channel.send("Disabled looping to prevent conflict.");
      }
      pool.getConnection(function(err, con) {
        if(err) return message.reply("there was an error trying to connect to the database!");
        con.query("UPDATE servers SET repeating = 1, looping = NULL WHERE id = '" + message.guild.id + "'", function(err) {
          if(err) return message.reply("there was an error trying to update the status!");
          message.channel.send("The song is now being repeated.");
        });
        con.release();
      });
      return;
    } else {
      repeat.set(message.guild.id, false);
      pool.getConnection(function(err, con) {
        if(err) return message.reply("there was an error trying to connect to the database!");
        con.query("UPDATE servers SET repeating = NULL WHERE id = '" + message.guild.id + "'", function(err) {
          if(err) return message.reply("there was an error trying to update the status!");
          message.channel.send("The song is no longer being repeated.");
        });
        con.release();
      });
      return;
    }
  }
  }
}