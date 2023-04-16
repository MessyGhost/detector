const rule  = require('./rule');
const gpt   = require('./gpt');

module.exports = async function handleMessage(msg, reply, info) {
    let action = rule(info.from, info.by);
    if(action != undefined) {
        console.log(`Message from ${info.from} by ${info.by} passed the test:\n${msg.raw}.`);
        let message = msg.raw;
        if(action.beginner) {
            if(msg.raw.startsWith(action.beginner)) {
                message = msg.raw.substring(action.beginner.length);
            }
            else if(info.from) {
                return;
            }
        }
        console.log('Now passed the beginner test.')
        let response = '';
        if(msg.textOnly) {
            try {
                response = await gpt(message, action);
            }
            catch(err) {
                if(err.response) {
                    console.log(`Server error: ${err.response.status} with data ${err.response.data}.`);
                    switch(err.response.status) {
                    case 429:
                        response = '问得太快啦。';
			break;
                    default:
                        response = `服务器回应${err.response.status}。`;
                        break;
                    }
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
