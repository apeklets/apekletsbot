module.exports = {
    name: '!register',
    description: 'Register this server in the database.',
    execute(msg, args) {
        //For each member, check their current roles and how long they've been in the server.
        //3 months, at least 1 role. (?)
        const serverid = msg.guild.id;
        const servername = msg.guild.name;
        const db = require('../connect');
        db.query(`SELECT id FROM servers WHERE name = "${servername}" AND serverid = "${serverid}";`, function(err, rows, fields) {
            if(err) {
                console.log('register.js: ' + err.sqlMessage);
            } else if(rows.length === 0) {
                db.query(`INSERT INTO servers (name,serverid) VALUES ("${servername}", "${serverid}");`, function(err, d, fields) {
                    if(err) {
                        console.log('register.js: ' + err.sqlMessage);
                    } else {
                        require('../channel').reply(msg, "Succesfully registered this server.");
                    }
                });
            } else {
                require('../channel').reply(msg, "This server is already registered.");
            }
        });
        //db.end();
    }
}