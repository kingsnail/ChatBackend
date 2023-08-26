const Agent = require('./agent');

class InitiatorAgent extends Agent {
    constructor(name, displayRow, displayCol) {
        super(name, displayRow, displayCol);
        this.agentType = "initiator-agent";   
    }
        
}

module.exports = InitiatorAgent;
