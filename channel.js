module.exports = {
    channelid: "",
    serverid: "",
    reply: function(msg, txt) {
        const db = require('./connect');
        if(module.exports.channelid != "" && msg.guild.id == module.exports.serverid) { //use last seen channel id
            msg.guild.channels.get(module.exports.channelid).send(txt, {reply: msg.member});
        } else {
            db.query(`SELECT channelid FROM servers WHERE serverid = "${msg.guild.id}" AND name = "${msg.guild.name}";`, function(err, rows, fields) {
                if(err) {
                    console.log('channel.js: ' + err.sqlMessage);
                } else if(rows.length > 0) {
                    module.exports.channelid = rows[0].channelid;
                    module.exports.serverid = msg.guild.id;
                    msg.guild.channels.get(module.exports.channelid).send(txt, {reply: msg.member});
                } else {
                    msg.reply(txt);
                }
            });
        }
    }
}
