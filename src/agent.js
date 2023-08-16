const { v4: uuidv4 } = require('uuid');

// Parent class for generic agent type
class Agent {
    constructor(name, displayRow, displayCol) {
        this.agentType = "agent";
        this.name = name;
        this.uuid = uuidv4();
        this.subscribers = [];
        this.version = 0;
        this.displayRow = displayRow;
        this.displayCol = displayCol;
        
        console.log("New agent " + this.name + " UUID: " + this.uuid);
    }

    getUUID() {
        return this.uuid;
    }

    getVersion{
        return this.version;
    }

    getUUIDV() {
        return this.uuid + "|" + this.version.toString();
    }

    getType(){
        return this.agentType;
    }

    getDisplayRow(){
        return this.displayRow;
    }
    getDisplayCol(){
        return this.displayCol;
    }

    getName(){
        return this.name;
    }
    
    setName(n) {
        this.name = n;
        this.version++;
    }
    
    setInput(i) { 
        console.log('Input is ${i}.');  
        this.version++;
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
        this.version = d.version;
    }

    save(){
        let d = {
            type: this.agentType,
            name: this.name,
            uuid: this.uuid,
            subscribers: this.subscribers,
            displayLocation: this.displayLocation
            version: this.version;
        }
        console.log('agent save');
        return d;
    }
}

module.exports = Agent;
