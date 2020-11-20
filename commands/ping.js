module.exports = {
    name: '!ping',
    description: 'Ping!',
    execute(msg, args) {
        require('../channel').reply(msg, 'pong');
    }
}