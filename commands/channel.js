module.exports = {
    name: '!channel',
    description: 'Set the channel that this bot will send messages in.',
    execute(msg, args) {
        const channel = args.join(' ');
        const channels = msg.guild.channels;
        var exists = false;
        channels.forEach((value, key, map) => {
            if(value.type === 'text' && value.name.toLowerCase() === channel.toLowerCase()) {
                exists = true;
                //require('../channel').reply(msg, `Role found with id \`${key}\``);
                const db = require('../connect');
                const serverid = msg.channel.guild.id;
                const servername = msg.channel.guild.name;
                db.query(`UPDATE servers SET channel = "${channel}", channelid = "${key}" WHERE serverid = "${serverid}" AND name = "${servername}";`, function(err, rows, fields) {
                    if(err) {
                        require('../channel').reply(msg, err.sqlMessage);
                        console.log('channel.js: ' + err.sqlMessage);
                    } else {
                        require('../channel').reply(msg, `The bot will now respond only in the channel "${channel}"`);
                    }
                });
                //db.end();
                //require('../channel').reply(msg, 'The bot will now manage the role "${role}"');
            }
        });
        if(!exists) {
            require('../channel').reply(msg, `The channel "${role}" does not exist in this server`);
        }
    }
};