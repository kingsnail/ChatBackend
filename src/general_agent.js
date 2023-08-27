const Agent = require('./agent');

const OpenAIAgent = require('./ChatGPT');

class GeneralAgent extends Agent {
    constructor(name, displayRow, displayCol, apiKey) {
        super(name, displayRow, displayCol);
        this.agentType = "standard-agent";
        this.systemPrompt = `You are a helpful assistant. Please try and follow the next instructions to the best of your ability. When asked a question, answer the question to the best of your ability.`;
        this.userPrompt = "";
        this.outputPrompt = `You must format all of your output as a JSON object with a key value of 'chatResult'. Format 'chatResult' as a JSON list for each response item listed where each list item has the following tags: 'item' whos value is the serial number of the item; and 'text' whos value is the text of the item.`;
        this.output = [];
        this.myAgent = new OpenAIAgent(apiKey);
        
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

    getOutput(){
        return this.output;
    } 
    
    setSystemPrompt(p) {
        this.systemPrompt = p;
        this.version++;

    }
    setUserPrompt(p) {
        this.userPrompt = p;
        this.version++;
    }
    setOutputPrompt(p) {
        this.outputPrompt = p;
        this.version++;
    }

    save(){
        let d = super.save();
        d['systemPrompt'] = this.systemPrompt;
        d['userPrompt'] = this.userPrompt;
        d['outputPrompt'] = this.outputPrompt;
        d['output'] = this.output;
        return d;
    }

}

module.exports = GeneralAgent;
