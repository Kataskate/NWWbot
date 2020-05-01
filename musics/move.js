const { prefix } = require("../config.json");
const arrayMove = require('array-move');

module.exports = {
  name: "move",
  description: "Move a music to a specific position of the song queue.",
  usage: "<target> <destination>",
  async music(message, serverQueue, looping, queue, pool) {
    const args = message.content.split(" ");
    if(!args[1]) return message.channel.send("You did not provide any target." + ` Usage: \`${prefix}${this.name} ${this.usage}\``);
    if(!args[2]) return message.channel.send("You did not provide any destination." + ` Usage: \`${prefix}${this.name} ${this.usage}\``);
    var queueIndex = parseInt(args[1]);
    var dest = parseInt(args[2]);
  if (isNaN(queueIndex))
    return message.channel.send("The target provided is not a number.");
  if(isNaN(dest))
    return message.channel.send("The destination provided is not a number.");
  if (!serverQueue) return message.channel.send("There is nothing playing.");
  var targetIndex = queueIndex - 1;
  var destIndex = dest - 1;
  if (targetIndex === 0)
    return message.channel.send(
      `You cannot move the song that is now playing. To move it, stop the playback first.`
    );
    if (targetIndex > serverQueue.songs.length - 1)
    return message.channel.send(
      `You cannot move the song that doesn't exist.`
    );
    var title = serverQueue.songs[targetIndex].title;
    arrayMove.mutate(serverQueue.songs, targetIndex, destIndex);
    pool.getConnection(function(err, con) {
            con.query(
              "UPDATE servers SET queue = '" +
                escape(JSON.stringify(serverQueue.songs))
                   +
                "' WHERE id = " +
                message.guild.id,
              function(err, result) {
                if (err) return message.reply("there was an error trying to execute that command!");
                console.log("Updated song queue of " + message.guild.name);
              }
            );
            con.release();
          });
  message.channel.send(
    `**${title}** has been moved from **#${queueIndex}** to **#${dest}**.`
  );
  }
}