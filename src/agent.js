const { v4: uuidv4 } = require('uuid');

// Parent class for generic agent type
class Agent {
    constructor(name) {
        let this.agentType = "Agent";
        let this.name = name;
        let this.uuid = uuidv4();
        let this.subscribers = [];
        
        console.log(`New agent ${this.name} UUID: €{this.uuid}`);
    }

    getUUID() {
        return this.uuid;
    }

    getType(){
        return this.agentType;
    }
    
    setInput(i) { 
        console.log('Input is ${i}.);  
    }
  
    execute() {
        console.log(`${this.name} makes a noise.`);
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
    }

    save(){
        let d = {
            type: this.agentType,
            name: this.name,
            uuid: this.uuid,
            subscribers: this.subscribers
        }
        console.log('Save');
        return d;
    }
}
