const Agent = require('./agent');

class MergeAgent extends Agent {
    constructor(agentStore, name, displayRow, displayCol) {
        super(agentStore, name, displayRow, displayCol);
        this.agentType = "merge-agent";
        this.output = [];
        this.sourcesList = []
        
    }

    getOutput(){
        return this.output;
    } 
    
    addSource( s ){
        this.sourcesList.push( s );
    }
  
    save(){
        let d = super.save();
        d['output'] = this.output;
        d['sourcesList'] = this.sourcesList;
        return d;
    }

}

module.exports = MergeAgent;
