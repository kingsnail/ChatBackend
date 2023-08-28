const Agent = require('./agent');

class OutputAgent extends Agent {
    constructor(agentStore, name, displayRow, displayCol) {
        super(agentStore, name, displayRow, displayCol);
        this.agentType = "output-agent";   
    }
        
}

module.exports = OutputAgent;
