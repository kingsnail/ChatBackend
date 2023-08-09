const { v4: uuidv4 } = require('uuid');

// Parent class for generic agent type
class Agent {
    constructor(name) {
        let this.name = name;
        let this.uuid = uuidv4();
        let this.subscribers = [];
        
        console.log(`New agent ${this.name} UUID: €{this.uuid}`);
    }

    getUUID() {
        return this.uuid;
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
    }

    save(){
        console.log('Save');
        return "Saved data";
    }
}
