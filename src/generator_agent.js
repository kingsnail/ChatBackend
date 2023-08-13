const Agent = require('./agent');

class GeneratorAgent extends Agent {
    constructor(name, displayLocation) {
        super(name, displayLocation);
        this.agentType = "generator-agent";   
        this.systemPrompt = "";
        this.userPrompt = "";
        this.outputPrompt = "";
        console.log("New generator agent " + this.name + " UUID: " + this.uuid);
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


}

module.exports = GeneratorAgent;
