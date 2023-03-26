const rule  = require('./rule');
const gpt   = require('./gpt');

module.exports = async function handleMessage(message, reply, info) {
    if(rule(info.from, info.by)) {
        let response = '';
        if(message != undefined) {
            response = await gpt(message);
        }
        else {
            response = '还不能回复非文字内容捏。';
        }
        console.log(`Message from ${info.from} by ${info.by} passed the test: ${message}.`);
        console.log(`Responding ${response}.`);
        reply(response);
    }
}
