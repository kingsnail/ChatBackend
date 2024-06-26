const Agent = require('./agent');

class InputAgent extends Agent {
    constructor(agentStore, name, displayRow, displayCol) {
        super(agentStore, name, displayRow, displayCol);
        this.agentType = "input-agent";
        this.inputType = "Text";
    }

setInputType(t) {
        this.inputType = t;
        this.version++;
    }

}

module.exports = InputAgent;
