const Agent = require('./agent');

class InitiatorAgent extends Agent {
    constructor(name, displayRow, displayCol) {
        super(name, displayRow, displayCol);
        this.agentType = "initiator-agent";   
        console.log("New initiator agent " + this.name + " UUID: " + this.uuid);
    }
        
}

module.exports = InitiatorAgent;
