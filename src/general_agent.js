// Parent class for generic agent type
class GeneralAgent extends Agent {
    constructor(name, displayLocation) {
        let this.agentType = "GeneralAgent";
        let this.name = name;
        let this.uuid = uuidv4();
        let this.subscribers = [];
        let this.displayLocation = displayLocation;
        
        console.log(`New general agent ${this.name} UUID: €{this.uuid}`);
    }
}
