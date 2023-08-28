const Agent = require('./agent');

class InputAgent extends Agent {
    constructor(name, displayRow, displayCol) {
        super(name, displayRow, displayCol);
        this.agentType = "input-agent";   
    }
        
}

module.exports = InputAgent;
