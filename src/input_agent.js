const Agent = require('./agent');

class InputAgent extends Agent {
    constructor(agentStore, name, displayRow, displayCol) {
        super(agentStore, name, displayRow, displayCol);
        this.agentType = "input-agent";
        this.inputType = "text";
        this.inputSet  = false;
    }

    setInputType(t) {
        this.inputType = t;
        this.version++;
    }

  execute(){
        super.execute();
        if (this.inputSet && this.input.length > 0 ){
            const nextInput = {role: 'user', content: this.input.shift()};                
            if (this.input.length == 0) {
                this.inputSet = false;
            }
            this.version = this.version + 1;
            this.output.push(nextInput);                                
        } else {
              console.log("Awaiting input.");
        }
    }
    
    reset(){
        super.reset();
        this.inputSet = false;
        this.output = [];
    }
    
    
    save(){
        let d = super.save();
        d['inputType']     = this.inputType;
        return d;
    }
    load(d){
        super.load(d);
        this.inputType   = d['inputType'];
    }
}

module.exports = InputAgent;
