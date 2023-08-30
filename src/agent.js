const { v4: uuidv4 } = require('uuid');

// Parent class for generic agent type
class Agent {
    constructor(agentStore, name, displayRow, displayCol) {
        this.agentType = "agent";
        this.name = name;
        this.uuid = uuidv4();
        this.subscribers = [];
        this.subscriptions = [];
        this.version = 0;
        this.displayRow = displayRow;
        this.displayCol = displayCol;
        
    }

    getUUID() {
        return this.uuid;
    }

    getVersion(){
        return this.version;
    }

    getUUIDV() {
        return this.uuid + "|" + this.version.toString();
    }

    getSignature(){
        return this.uuid + "|" + this.version.toString() + "|" + this.agentType;
    }
    
    getType(){
        return this.agentType;
    }

    getDisplayRow(){
        console.log("getDisplayRow() = " + this.displayRow);
        return this.displayRow;
    }
    getDisplayCol(){
        console.log("getDisplayCol() = " + this.displayCol);
        return this.displayCol;
    }

    getName(){
        return this.name;
    }
    setUUID( uuid ) {
        this.uuid = uuid;
    }
    
    setName(n) {
        this.name = n;
        this.version++;
    }
    
    setInput(i, fromAgent) { 
        console.log("Input is" + i + " from agent " + fromAgent);  
        this.version++;
    }
  
    execute() {
        console.log(`${this.name} executes.`);
    }

    subscribe(s) {
        this.subscribers.push(s);
        console.log('Subscribe');
    }

    addSubscription(to){
        this.subscriptions.push( to );
        console.log("subscription logged");
    }

    load(d){
        console.log('Load');
        this.agentType = d.type;
        this.name = d.name;
        this.uuid = d.uuid;
        this.subscribers = d.subscribers;
        this.subscriptions = d.subscriptions;
        this.displayRow = d.displayRow;
        this.displayCol = d.displayCol;
        this.version = d.version;
    }

    save(){
        let d = {
            type: this.agentType,
            name: this.name,
            uuid: this.uuid,
            subscribers: this.subscribers,
            subscriptions: this.subscriptions,
            displayRow: this.displayRow,
            displayCol: this.displayCol,
            version: this.version,
            uuidv:  this.uuid + "|" + this.version.toString()
        }
        return d;
    }
}

module.exports = Agent;
