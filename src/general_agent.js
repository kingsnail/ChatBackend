const Agent = require('./agent');

class GeneralAgent extends Agent {
    constructor(name, displayLocation) {
        super(name, displayLocation);
        this.agentType = "GeneralAgent";
        this.systemPrompt = "";
        this.userPrompt = "";
        this.outputPrompt = "";
        console.log("New general agent " + this.name + " UUID: " + this.uuid);
    }

    getSystemPrompt() {
        return this.systemPrompt;
    }
    getUserPrompt() {
        return this.userPrompt;
    }
    getOutputPrompt() {
        return this.outputPrompt;
    }
    
    setSystemPrompt(p) {
        this.systemPrompt = p;
    }
    setUserPrompt(p) {
        this.userPrompt = p;
    }
    setOutputPrompt(p) {
        this.outputPrompt = p;
    }

    save(){
        d = super();
        d['systemPrompt'] = this.systemPrompt;
        d['userPrompt'] = this.userPrompt;
        d['outputPrompt'] = this.outputPrompt;
        return d;
    }

}

module.exports = GeneralAgent;
