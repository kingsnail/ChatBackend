const Agent = require('./agent');

class MergeAgent extends Agent {
    constructor(name, displayRow, displayCol) {
        super(name, displayRow, displayCol);
        this.agentType = "merge-agent";
        this.output = [];
        this.sourcesList = []
        
        console.log("New Merge agent " + this.name + " UUID: " + this.uuid);
      
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
        console.log('General Agent Save');
        return d;
    }

}

module.exports = MergeAgent;
