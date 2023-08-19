const Agent = require('./agent');

class OutputAgent extends Agent {
    constructor(name, displayRow, displayCol) {
        super(name, displayRow, displayCol);
        this.agentType = "output-agent";   
        console.log("New initiator agent " + this.name + " UUID: " + this.uuid);
    }
        
}

module.exports = OutputAgent;
