const fs            =           require('fs');
const { program }   =           require('commander');
const process       =           require('process');


program
    .requiredOption('-c, --config <config>')
    .parse(process.argv);

const options = program.opts();

const configObject = JSON.parse(fs.readFileSync(options.config));

function testType(object, type, defaultValue) {
    const objType = typeof(object);
    if(type === objType ) {
        return object;
    }
    else if (type === 'undefined') {
        return defaultValue;
    }
    else {
        throw new Error(`${options.config}: type doesn't match: expected ${type} but got ${objType}.`)
    }
}

testType(configObject.api,          'object');
testType(configObject.api.url,      'string');
testType(configObject.api.token,    'string');
testType(configObject.qq,           'object');
testType(configObject.qq.account,   'number');
testType(configObject.qq.password,  'string');
testType(configObject.ruleFile,     'string');
testType(configObject.chat,         'object');

module.exports = {
    apiUrl:         configObject.api.url,
    apiToken:       configObject.api.token,
    qqNumber:       configObject.qq.account,
    qqPassword:     configObject.qq.password,
    ruleFile:       configObject.ruleFile,
    dataDir:        typeof(configObject.dataDir) === 'string'? configObject.dataDir : undefined,
    defaultAction: {
        beginner: typeof(configObject.chat.beginner) === 'string'? configObject.chat.beginner : undefined,
        hint: typeof(configObject.chat.hint) === 'string'? configObject.chat.hint : undefined
    }
};

