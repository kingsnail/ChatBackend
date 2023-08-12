// Parent class for generic agent type
class GeneralAgent extends Agent {
    constructor(name, displayLocation) {
        super(name, displayLocation);
        this.agentType = "GeneralAgent";        
        console.log(`New general agent ${this.name} UUID: €{this.uuid}`);
    }
}
