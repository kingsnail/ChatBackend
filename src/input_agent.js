const Agent = require('./agent');

class InputAgent extends Agent {
    constructor(agentStore, name, displayRow, displayCol) {
        super(agentStore, name, displayRow, displayCol);
        this.agentType = "input-agent";
        this.inputType = "text";
        this.inputSet  = false;
        this.textInput = "";
        this.output = [];
    }

    setInputType(t) {
        this.inputType = t;
        this.version++;
    }

    setTextInput(t) {
        console.log("Setting input agent text to : " + t);
        this.textInput = t;
        super.setInput(t);
        this.version++;
    }


  execute(){
        super.execute();
        console.log("Input = " + this.input);
        if (this.inputSet && this.input.length > 0 ){
            const nextInput = {role: 'user', content: this.input.shift()};                
            if (this.input.length == 0) {
                this.inputSet = false;
            }
            this.version = this.version + 1;
            this.output.push(this.nextInput);     
            console.log("pushing: " + this.nextInput);
            this.output.forEach((op, i) => {
                this.subscribers.forEach((x, j) => {this.agentStore.getAgent(x).setInput(JSON.stringify(op), this.uuid);
                });
            });

            
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
        d['textInput']     = this.textInput;
        return d;
    }
    load(d){
        super.load(d);
        this.inputType   = d['inputType'];
        this.textInput   = d['textInput'];
    }
}

module.exports = InputAgent;
