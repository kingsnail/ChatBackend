const Agent = require('./agent');

class InputAgent extends Agent {
    constructor(agentStore, name, displayRow, displayCol) {
        super(agentStore, name, displayRow, displayCol);
        this.agentType = "input-agent";
        this.inputType = "Text";
    }

    setInputType(t) {
        this.inputType = t;
        this.version++;
    }

    save(){
        let d = super.save();
        
        return d;
    }
    load(d){
        super.load(d);
        this.systemPrompt   = d['systemPrompt'];
        this.userPrompt     = d['userPrompt'];
        this.outputPrompt   = d['outputPrompt'];
        this.output         = d['output'];
        this.apiKey         = d['apiKey'];        
        this.listItemOutput = d['listItemOutput'];
    }
}

    
}

module.exports = InputAgent;
