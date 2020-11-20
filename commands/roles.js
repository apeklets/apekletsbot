module.exports = {
    name: '!roles',
    description: 'List the roles available for users.',
    execute(msg, args) {
        const roles = msg.guild.roles;
        var output = "Available roles:\n";
        roles.forEach((value, key, map) => {
            if(value.color == 15844367) {
                output += value.name + "\n";
            }
        });
        require('../channel').reply(msg, output);
    }
};
