const icqq      =        require('icqq');
const config    =      require('./config');
const handle    =     require('./message');

const conf = { platform: 4 };
if(config.dataDir) {
    conf.data_dir = config.dataDir;
}
const client = icqq.createClient(conf);

client.login(config.qqNumber, config.qqPassword);

client.on('system.login.device', e => {
    client.sendSmsCode();
    console.log('SMS Code:');
    process.stdin.once('data', (res) => {
        client.submitSmsCode(res.toString().trim());
    });
});

client.on('system.login.slider', e => {
    console.log('Sider url:' + e.url);
    console.log('Ticket:');
    process.stdin.once('data', (data) => {
        client.submitSlider(data.toString().trim());
    });
})

function checkMessageType(event) {
    for(let msg of event.message) {
        if(msg.type != 'text') {
            return false;
        }
    }
    return true;
}

client.on('message.private', event => {
    const msg = { raw: event.raw_message, textOnly: checkMessageType(event) };
    handle(msg, m => event.reply(m, true), { by: event.friend.user_id });
});

function handleGroup(event) {
    const msg = { raw: event.raw_message, textOnly: checkMessageType(event) };
    handle(msg, m => event.reply(m, true), { from: event.group_id, by: event.sender.user_id });
}

client.on('message.group', handleGroup);
//client.on('message.discuss', handleGroup);

module.exports = client;
