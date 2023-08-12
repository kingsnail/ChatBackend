const { v4: uuidv4 } = require('uuid');

// Parent class for generic agent type
class Agent {
    constructor(name, displayLocation) {
        this.agentType = "Agent";
        this.name = name;
        this.uuid = uuidv4();
        this.subscribers = [];
        this.displayLocation = displayLocation;
        
        console.log(`New agent ${this.name} UUID: €{this.uuid}`);
    }

    getUUID() {
        return this.uuid;
    }

    getType(){
        return this.agentType;
    }

    getDisplayLocation(){
        return this.displayLocation;
    }
    
    setInput(i) { 
        console.log('Input is ${i}.');  
    }
  
    execute() {
        console.log(`${this.name} executes.`);
    }

    subscribe(s) {
        this.subscribers.push(s);
        console.log('Subscribe');
    }

    load(d){
        console.log('Load');
        this.agentType = d.type;
        this.name = d.name;
        this.uuid = d.uuid;
        this.subscribers = d.subscribers;
        this.displayLocation = d.displayLocation;
    }

    save(){
        let d = {
            type: this.agentType,
            name: this.name,
            uuid: this.uuid,
            subscribers: this.subscribers,
            displayLocation: this.displayLocation
        }
        console.log('Save');
        return d;
    }
}

module.exports = Agent;
