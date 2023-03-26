const icqq      =        require('icqq');
const config    =      require('./config');
const handle    =     require('./message');

const client = icqq.createClient({platform: 4, data_dir: config.dataDir});

client.login(config.qqNumber, config.qqPassword);

client.on('system.login.device', e => {
    client.sendSmsCode();
    console.log('SMS Code:')
    process.stdin.once('data', (res) => {
        client.submitSmsCode(res.toString().trim())
    })
});

client.on('system.login.slider', e => {
    console.log('Sider url:' + e.url);
    console.log('Ticket:');
    process.stdin.once('data', (data) => {
        client.submitSlider(data.toString().trim())
    })
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
    handle(checkMessageType(event)? event.raw_message : undefined, m => event.reply(m), { by: event.friend.user_id });
});

function handleGroup(event) {
    let msg = event.raw_message;
    if(msg.startsWith(config.beginner)) {
        msg = msg.substring(config.beginner.length);
        handle(checkMessageType(event)? msg : undefined, m => event.reply(m), { from: event.group_id, by: event.sender.user_id });
    } 
}

client.on('message.group', handleGroup);
//client.on('message.discuss', handleGroup);

module.exports = client;
