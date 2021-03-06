const Discord = require("discord.js");
var color = Math.floor(Math.random() * 16777214) + 1;
const { twoDigits } = require("../function.js")

module.exports = {
	name: 'server',
	description: 'Display some server information.',
  usage: " ",
	execute(message) {
    const name = message.guild.name;
    const id = message.guild.id;
    const memberCount = message.guild.memberCount;
    const userMember = message.guild.members.cache;
    const userMemberCount = [];
    const botMemberCount = [];
    for(const user of userMember.values()) {
      if(user.user.bot === false) userMemberCount.push(user.id);
      if(user.user.bot) botMemberCount.push(user.id);
    }
    const roles = message.guild.roles.cache;
    const roleIDs = [];
    for(const role of roles.values()) {
      if(role.name !== "@everyone")
      roleIDs.push(role.id);
    }
    const createdAt = message.guild.createdAt
    const owner = message.guild.owner.user.tag;
    const icon = message.guild.iconURL({ format: "png", dynamic: true});
    const region = message.guild.region;
    
    var date = createdAt.getDate();
        var month = createdAt.getMonth();
        var year = createdAt.getFullYear();
        var hour = createdAt.getHours();
        var minute = createdAt.getMinutes();
        var second = createdAt.getSeconds();
      
      var createdTime =
          twoDigits(date) +
          "/" +
          twoDigits(month + 1) +
          "/" +
          twoDigits(year) +
          " " +
          twoDigits(hour) +
          ":" +
          twoDigits(minute) +
          ":" +
          twoDigits(second) +
          " UTC";
		
    const Embed = new Discord.MessageEmbed()
    .setTitle("Information of " + name)
    .setColor(color)
    .setThumbnail(icon)
    .addField("ID", id, true)
    .addField("Name", name, true)
    .addField("Member count", `Members: \`${memberCount}\`\nUsers: \`${userMemberCount.length}\`\nBots: \`${botMemberCount.length}\``, true)
    .addField("Created", createdTime, true)
    .addField("Region", region, true)
    .addField("Owner", owner, true)
    .addField(`Roles [${roleIDs.length}]`, (`<@&${roleIDs.join("> <@&")}>`).length < 1024 ? (`<@&${roleIDs.join("> <@&")}>`) : "Too many roles...")
    .setTimestamp()
    .setFooter("Have a nice day! :)", message.client.user.displayAvatarURL());
    
    message.channel.send(Embed);
    
	},
};