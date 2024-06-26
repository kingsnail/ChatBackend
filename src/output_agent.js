const Agent = require('./agent');

class OutputAgent extends Agent {
    constructor(agentStore, name, displayRow, displayCol) {
        super(agentStore, name, displayRow, displayCol);
        this.agentType = "output-agent";   
        this.output    = [];
    }

    setInput(i, fromAgent) {
        super.setInput(i, fromAgent);
        this.output = this.input;
    }
       
    load(d){
        console.log('Load');
        this.agentType = d.type;
        this.name = d.name;
        this.uuid = d.uuid;
        this.subscribers = d.subscribers;
        this.subscriptions = d.subscriptions;
        this.output = d.output;
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
            output: this.output,
            displayRow: this.displayRow,
            displayCol: this.displayCol,
            version: this.version,
            uuidv:  this.uuid + "|" + this.version.toString()
        }
        return d;
    }
}

module.exports = OutputAgent;
