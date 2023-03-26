const axios = require('axios');
const config = require('./config');

async function chat(message) {
    let result = await axios.post(`${config.apiUrl}/v1/chat/completions`, {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": message}]
    }, 
    {
        headers: {
            Authorization: `Bearer ${config.apiToken}`
        }
    });
    return result.data.choices[0]?.message.content;
}

module.exports = chat;
