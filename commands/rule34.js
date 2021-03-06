const Discord = require("discord.js");
var color = Math.floor(Math.random() * 16777214) + 1;
const Booru = require("booru");

module.exports = {
  name: "rule34",
  description: "Display Rule34 images. Add tags to filter. Require NSFW channel.",
  aliases: ["r34"],
  usage: "<tags>",
  async execute(message, args) {
    if(message.channel.nsfw === false) {
      return message.channel.send("Please use an NSFW channel to use this command!")
    }
    if(!args[0]) return message.channel.send("Please provide at least 1 tag!" + ` Usage: ${message.client.prefix}${this.name}${this.usage}`)
    async function pick() {
    var sites = ["rule34.paheal.net", "rule34.xxx"];
    var pickedSite = sites[Math.floor(Math.random() * sites.length)];
    
    var posts = await Booru.search(pickedSite, args, { limit: 100, random: false });
    var pickedPost = posts[Math.floor(Math.random() * posts.length)];
      if(pickedPost === undefined) return pick();
      else return pickedPost;
    }
    
    var post = await pick();
    var fileUrl;
    if(!post.fileUrl || post.fileUrl === null || post.fileUrl === undefined) {
      if(!post.data.file_url || post.data.file_url === null || post.data.file_url === undefined) {
        return await this.execute(message, args);
      }
      fileUrl = post.data.file_url;
    } else {
      fileUrl = post.fileUrl;
    }
    const Embed = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle("Searching tags: " + args.join(", "))
    .setDescription("Tags: `" + post.tags.join(", ") + "`\nPlease be patient. Image will load soon...")
    .setTimestamp()
    .setFooter("From " + post.booru.domain, message.client.user.displayAvatarURL());
    
    message.channel.send(Embed);
    var attachment = new Discord.MessageAttachment(fileUrl, "image.jpg");
    message.channel.send(attachment);
  }
}