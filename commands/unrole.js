const { findMember } = require("../function.js")

module.exports = {
	name: 'unrole',
    description: 'Remove role from someone',
    args: true,
    usage: '<user> <role to remove>',
	async execute(message, args) {
    if (!message.member.permissions.has('MANAGE_ROLES')) { 
      message.channel.send(`You don\'t have the permission to use this command.`)
      return;
    }
    
    if(!args[0]) return message.channel.send("Please mention an user!");
    if(!args[1]) return message.channel.send("Please mention a role!");
    
		var roleID = args[1].replace(/<@&/g, "").replace(/>/g, "");
    if(isNaN(parseInt(roleID))) {
      var role = await message.guild.roles.cache.find(x => x.name === `${args[1]}`);
    } else {
      var role = await message.guild.roles.fetch(roleID);
    }
		// Let's pretend you mentioned the user you want to add a role to (!addrole @user Role Name):
		let member = await findMember(message, args[0]);
    

    if(!member) return;
		// or the person who made the command: let member = message.member;

    if(!role) {
      return message.channel.send("The role is not valid!");
    }

		// Remove a role!
    if(member.roles.cache.get(role.id)) {
        member.roles.remove(role).then(role => console.log(`Removed role ${role.name} from ${taggedUser.username}.`)).catch(console.error);
        const taggedUser = message.mentions.users.first();
    
        message.channel.send(`Removed role **${role.name}** from **${taggedUser.tag}**.`);
    } else {
      return message.reply("that user doesn't have the role " + role + "!");
    }
	},
};