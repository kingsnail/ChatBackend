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
        let d = super.save();
        d['systemPrompt'] = this.systemPrompt;
        d['userPrompt'] = this.userPrompt;
        d['outputPrompt'] = this.outputPrompt;
        console.log('General Agent Save');
        return d;
    }

}

module.exports = GeneralAgent;
