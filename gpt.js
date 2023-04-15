const axios     = require('axios');
const config    = require('./config');

async function chat(message, action) {
    let messages = [{"role": "user", "content": message}];
    if(action.hint != undefined) {
        messages.unshift(
            { "role": "system", "content": action.hint },
        );
    }
    let result = await axios.post(`${config.apiUrl}/v1/chat/completions`, {
        "model": "gpt-3.5-turbo",
        "messages": messages
    }, 
    {
        headers: {
            Authorization: `Bearer ${config.apiToken}`
        }
    });
    return result.data.choices[0]?.message.content;
}

module.exports = chat;
