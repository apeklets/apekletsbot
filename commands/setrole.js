module.exports = {
    name: '!setrole',
    description: 'Set the role that is managed by this bot.',
    execute(msg, args) {
        const role = args.join(' ');
        const roles = msg.guild.roles;
        var exists = false;
        roles.forEach((value, key, map) => {
            if(value.name.toLowerCase() === role.toLowerCase()) {
                exists = true;
                //msg.reply(`Role found with id \`${key}\``);
                const db = require('../connect');
                const serverid = msg.channel.guild.id;
                const servername = msg.channel.guild.name;
                db.query(`UPDATE servers SET role = "${role}", roleid = "${key}" WHERE serverid = "${serverid}" AND name = "${servername}";`, function(err, rows, fields) {
                    if(err) {
                        console.log('setrole.js: ' + err.sqlMessage);
                    } else {
                        require('../channel').reply(msg, `The bot will now manage the role "${role}"`);
                    }
                });
                //db.end();
                //msg.reply('The bot will now manage the role "${role}"');
            }
        });
        if(!exists) {
            require('../channel').reply(msg, `The role "${role}" does not exist in this server`);
        }
    }
};