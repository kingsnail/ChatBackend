const Agent = require('./agent');

class GeneratorAgent extends Agent {
    constructor(name, displayLocation) {
        super(name, displayLocation);
        this.agentType = "generator-agent";   
        this.systemPrompt = 'You are a helpful assistant.  
             Please try and follow the next instructions to the best of your ability. 
             When asked a question, answer the question to the best of your ability.';
        this.userPrompt = "";
        this.outputPrompt = `Format your output as a JSON object with a key value of 'chatResult'. 
             Format 'chatResult' as a JSON list for each response item listed where each list item has the following tags: 
             'item' whos value is the serial number of the item; and
             'text' whos value is the text of the item.`;
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
