#!/usr/bin/env node
require('dotenv').config();
const Discord = require('discord.js');
const Canvas = require('canvas');
const bot = new Discord.Client();

let cessorCounter = 0;

//TODO:
//For now, have this as a constant
//Should become a server attribute at some point
//!setdays {days}
const DEFAULT_MIN_DAYS_JOINED = 8;

bot.commands = new Discord.Collection();
bot.usrcomms = new Discord.Collection();
const botCommands = require('./commands/admin');
const usrCommands = require('./commands/user');

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
});

Object.keys(usrCommands).map(key => {
    bot.commands.set(usrCommands[key].name, usrCommands[key]);
    bot.usrcomms.set(usrCommands[key].name, usrCommands[key]);
});

bot.login(process.env.TOKEN);

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
});

var data = {};
module.exports.init = function() {
    return data;
}

function logSQL(err,rows,fields) {
    if(err) {
        console.log('index.js: ' + err.sqlMessage);
    }
}

function verifyMessage(str) {
    var words = str.split(' ').length;
    var chars = str.length;
    if(words < 3 || chars < 5) return false;
    if(chars < words + 3) return false;
    return true;
}

function checkNitroScam(str) {
    words = str.toLowerCase().split(" ");
    if(words.includes("free") && words.includes("discord") && words.includes("nitro")) {
        var hasUrl = false;
        for(var i = 0; i < words.length; i++) {
            try {
                let y = new URL(words[i])
                hasUrl = true;
            } catch(x) {
                continue;
            }
        }
        if(hasUrl) {
            return true;
        }
    }
    return false;
}

bot.on('message', msg => {
    var member = msg.member;
    if(member.permissions != undefined && member.permissions.has('ADMINISTRATOR') && msg.content.startsWith('!')) { //Command executed by an administrator
        const args = msg.content.split(/ +/);
        const command = args.shift().toLowerCase();
        if (!bot.commands.has(command)) return;
        try {
            console.info(`Admin command: ${command}`);
            bot.commands.get(command).execute(msg, args);
        } catch (error) {
            console.error(error);
            require('./channel').reply(msg, 'There was an error trying to execute that command!');
        }
    } else if(msg.content.startsWith('!')) {
        const args = msg.content.split(/ +/);
        const command = args.shift().toLowerCase();
        if (!bot.usrcomms.has(command)) return;
        try {
            console.info(`User command: ${command}`);
            bot.usrcomms.get(command).execute(msg, args);
        } catch (error) {
            console.error(error);
            require('./channel').reply(msg, 'There was an error trying to execute that command!');
        }
    } else if(!msg.author.bot) {
        if(checkNitroScam(msg.content)) {
            try {
                member.ban("Discord Nitro scam links");
            } catch(x) {
                console.log(x);
            }
        } else {
            const db = require('./connect');
            db.query(`SELECT id, role, roleid, threshold FROM servers WHERE serverid = ${msg.channel.guild.id} LIMIT 1;`, function(err1, rows, fields) {
                logSQL(err1,rows,fields);
                if(rows.length > 0) {
                    var server = rows[0];
                    if(!member._roles.includes(server.roleid)) { //User does not have the managed role
                        db.query(`SELECT messages, DATEDIFF(NOW(), joined) AS days FROM members WHERE userid = "${msg.author.id}" AND server = ${server.id};`, function(err2, users, fields) {
                            logSQL(err2,users,fields);
                            if(verifyMessage(msg.content)) {
                                if(users.length == 1) {
                                    //Update messages
                                    var messages = users[0].messages + 1;
                                    if(messages >= server.threshold && users[0].days >= DEFAULT_MIN_DAYS_JOINED) {
                                        //Give user the role
                                        member.addRole(server.roleid);
                                        db.query(`UPDATE members SET messages = ${messages} WHERE userid = "${msg.author.id} AND server = ${server.id}";`, logSQL);
                                        console.log(`Given member ${msg.author.username}#${msg.author.discriminator} the role "${server.role}".`);
                                        //or DELETE this user? maybe? perhaps? probably?
                                    } else {
                                        db.query(`UPDATE members SET messages = ${messages} WHERE userid = "${msg.author.id}" AND server = ${server.id};`, logSQL);
                                    }
                                } else if(users.length == 0) {
                                    //Create user record
                                    var isoStr;
                                    if(member.joinedAt == null) {
                                        isoStr = (new Date()).toISOString();
                                    } else {
                                        isoStr = member.joinedAt.toISOString();
                                    }
                                    db.query(`INSERT INTO members (username, discr, userid, server, joined) VALUES ("${msg.author.username}", "${msg.author.discriminator}", "${msg.author.id}", ${server.id}, '${isoStr.replace('Z', '000')}');`, logSQL);
                                    console.log(`Created new member record for ${msg.author.username}#${msg.author.discriminator}`);
                                }
                            }
                        });
                    }
                }
            });
        }
    }
});

