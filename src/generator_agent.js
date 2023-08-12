const Agent = require('./agent');

class GeneratorAgent extends Agent {
    constructor(name, displayLocation) {
        super(name, displayLocation);
        this.agentType = "GeneratorAgent";        
        console.log(`New generator agent ${this.name} UUID: €{this.uuid}`);
    }
}

module.exports = GenetorAgent;
