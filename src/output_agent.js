const Agent = require('./agent');

class OutputAgent extends Agent {
    constructor(agentStore, name, displayRow, displayCol) {
        super(agentStore, name, displayRow, displayCol);
        this.agentType = "output-agent";   
    }

    setInput(i, fromAgent) {
        super.setInput(i, fromAgent);
        this.output = this.input;
    }
    
}

module.exports = OutputAgent;
