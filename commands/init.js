module.exports = {
    name: '!init',
    description: 'Initialize the role for members currently in the server.',
    execute(msg, args) {
        //For each member, check their current roles and how long they've been in the server.
        //3 months, at least 1 role. (?)
        //Last message was less than 1 month ago.
        const db = require('../connect');
        const m = 2592E6;
        var threeMonths = new Date();
        var oneMonth = new Date();
        const serverid = msg.guild.id;
        const servername = msg.guild.name;
        threeMonths.setTime(Date.now() - 3*m);
        oneMonth.setTime(Date.now() - m);
        var members = msg.guild.members.filter((val, key, map) => {
            if(val.lastMessage != null) {
                return (val.joinedAt < threeMonths && val.lastMessage.createdAt > oneMonth && val.lastMessage.channel.name != "releases");
            } else {
                return false;
            }
        });
        db.query(`SELECT role,roleid FROM servers WHERE name = "${servername}" AND serverid = "${serverid}";`, function(err,rows,fields) {
            if(err) {
                console.log('init.js: ' + err.sqlMessage);
            }
            if(rows.length > 0) {
                var server = rows[0];
                var rolesGiven = 0;
                members.forEach((val, key, map) => {
                    if(!val._roles.includes(server.roleid)) {
                        val.addRole(server.roleid);
                        rolesGiven++;
                        console.log(`Given member ${val.user.username}#${val.user.discriminator} the role "${server.role}".`);
                    }
                });
                require('../channel').reply(msg, `Given ${rolesGiven} users the role "${server.role}".`);
            } else {
                require('../channel').reply(msg, 'Please register this server first using !register');
            }
        });
        //db.end();
    }
}