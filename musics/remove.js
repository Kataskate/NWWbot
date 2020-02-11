const { prefix } = require("../config.json")

module.exports = {
  name: "remove",
  description: "Remove a music from the song queue.",
  music(message, serverQueue) {
    const args = message.content.split(" ").slice(prefix.length);
    
    if (!message.member.voice.channel)
    return message.channel.send("You are not in a voice channel!");
    if(!args[0]) return message.channel.send("You did not provide any index.")
    var queueIndex = args[0];
  if (typeof queueIndex !== "number")
    return message.channel.send("The query provided is not a number.");
  if (!serverQueue) return message.channel.send("There is nothing playing.");
  var deleteIndex = queueIndex - 1;
  if (deleteIndex === 0)
    return message.channel.send(
      `You cannot remove the song that is now playing. To remove it, use skip command instead.`
    );
  var removed = serverQueue.songs.splice(deleteIndex, 1);
  message.channel.send(
    `**${removed[0].title}** has been removed from the queue.`
  );
  }
}