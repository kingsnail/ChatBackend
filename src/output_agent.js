const Agent = require('./agent');

class OutputAgent extends Agent {
    constructor(name, displayRow, displayCol) {
        super(name, displayRow, displayCol);
        this.agentType = "output-agent";   
    }
        
}

module.exports = OutputAgent;
