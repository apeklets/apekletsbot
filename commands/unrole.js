module.exports = {
    name: '!unrole',
    description: 'Allows the user to select a role from a list of roles they can access.',
    execute(msg, args) {
        var role = args.join(' ');
        var roles = msg.guild.roles;
        var exists = false;
        var permitted = false;
        roles.forEach((value, key, map) => {
            if(value.name.toLowerCase() === role.toLowerCase()) {
                exists = true;
                permitted = value.color == 15844367;
                if(permitted) {
                    var member = msg.guild.members.get(msg.author.id);
                    member.removeRole(key).then(function() {
                        require('../channel').reply(msg, `Your role "${value.name}" has been removed.`);
                    }).catch(function() {
                        require('../channel').reply(msg, `You do not have the role "${role}".`);
                    });
                    
                    console.log(`Removed from member ${msg.author.username}#${msg.author.discriminator} the role "${value.name}".`);
                }
            }
        });
        if(!exists) {
            require('../channel').reply(msg, `The role "${role}" does not exist in this server.`);
        } else if(!permitted) {
            require('../channel').reply(msg, `You can only manage Yellow roles. To see a list of Yellow roles, use \`!roles\``);
        }
    }
}
