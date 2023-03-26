const rule  = require('./rule');
const gpt   = require('./gpt');

module.exports = async function handleMessage(message, reply, info) {
    if(rule(info.from, info.by)) {
        console.log(`Message from ${info.from} by ${info.by} passed the test:\n${message}.`);
        let response = '';
        if(message != undefined) {
            try {
                response = await gpt(message);
            }
            catch(err) {
                if(err.response) {
                    console.log(`Server error: ${err.response.status} with data ${err.response.data}.`);
                    response = `服务器回应${err.response.status}。`;
                }
                else if(err.request) {
                    console.log(`Error while receiving response from server.`);
                    response = '未成功请求。';
                }
                else {
                    console.log('Internal error while sending request.');
                    response = '内部错误。';
                }
            }
        }
        else {
            response = '还不能回复非文字内容捏。';
        }
        console.log(`In response to message from ${info.from} by ${info.by}:\n${message}\nResponding:\n${response}.`);
        reply(response);
    }
}
