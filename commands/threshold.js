module.exports = {
    name: '!threshold',
    description: 'Message threshold for gaining the role.',
    execute(msg, args) {
        var thresh = Number(args[0]);
        if(0 > thresh || thresh > 65535) {
            require('../channel').reply(msg, "Threshold must be between 1 and 65535");
        } else {
            const db = require('../connect');
            const serverid = msg.channel.guild.id;
            const servername = msg.channel.guild.name;
            db.query(`UPDATE servers SET threshold = ${thresh} WHERE serverid = "${serverid}" AND name = "${servername}";`, function(err, rows, fields) {
                if(err) {
                    console.log('threshold.js: ' + err.sqlMessage);
                } else {
                    require('../channel').reply(msg, `Succesfully changed message threshold to ${thresh}.`);
                }
            });
            //db.end();
        }
    }
};