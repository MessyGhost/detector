const config        = require('./config');
const fs            = require('fs');


const rules = JSON.parse(fs.readFileSync(config.ruleFile));
if(typeof(rules) != 'object') {
    throw new Error('Invalid rule file.')
}

function isRule(rule) {
    return rule.action != undefined;
}

for(let rule of rules) {
    if(!isRule(rule)) {
        throw new Error('Invalid rule in rule file.');
    }
}

function testRule(from, by, rule) {
    function match(val, matcher) {
        return matcher === undefined || val === matcher;
    }

    return match(from, rule.from) && match(by, rule.by);
}

//returns action object if passed
function test(from, by) {
    for(let rule of rules) {
        if(testRule(from, by, rule)) {
            if(rule.action === 1) {
                return config.defaultAction;
            }
            else if(rule.action === 0) {
                return undefined;
            }
            else if(typeof(rule.action) === 'object') {
                return Object.assign({}, config.defaultAction, rule.action);
            }
        }
    }
    return undefined;
}

module.exports = test;
