module.exports = {
    name: '!unrole',
    description: 'Allows the user to select a role from a list of roles they can access.',
    execute(msg, args) {
        let role = args.join(' ');
        let roles = msg.guild.roles;
        let exists = false;
        let permitted = false;
        roles.forEach((value, key, map) => {
            if(value.name.toLowerCase() === role.toLowerCase()) {
                exists = true;
                permitted = value.color == 15844367;
                if(permitted) {
                    let member = msg.guild.members.get(msg.author.id);
                    let hasrole = false;
                    member.roles.forEach((val, key, map) => {
                        if(val.name.toLowerCase() === value.name.toLowerCase()) {
                            hasrole = true;
                        }
                    });
                    if(hasrole) {
                        member.removeRole(value);
                        require('../channel').reply(msg, `Your role "${value.name}" has been removed.`);
                        console.log(`Removed from member ${msg.author.username}#${msg.author.discriminator} the role "${value.name}".`);
                    } else {
                        require('../channel').reply(msg, `You do not have the role "${value.name}".`);
                    }
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
