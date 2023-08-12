const Agent = require('./agent');

class GeneralAgent extends Agent {
    constructor(name, displayLocation) {
        super(name, displayLocation);
        this.agentType = "GeneralAgent";        
        console.log(`New general agent ${this.name} UUID: €{this.uuid}`);
    }
}

module.exports = GeneralAgent;
