const Agent = require('./agent');
const OpenAIAgent = require('./ChatGPT');

class GeneratorAgent extends Agent {
    constructor(name, displayRow, displayCol, apiKey) {
        super(name, displayRow, displayCol);
        this.agentType = "generator-agent";   
        this.systemPrompt = `You are a helpful assistant. Please try and follow the next instructions to the best of your ability. When asked a question, answer the question to the best of your ability.`;
        this.userPrompt = "Say this is a test";
        this.outputPrompt = `Format your output as a JSON object with a key value of 'chatResult'. Format 'chatResult' as a JSON list for each response item listed where each list item has the following tags: 'item' whos value is the serial number of the item; and 'text' whos value is the text of the item.`;
        this.myAgent = new OpenAIAgent(apiKey);
        this.output = [];
        
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

    getOutput(){
        return this.output;
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

    execute(){

        (async () => {
        
            try{ 
                const msg = [{role: 'system', content: this.systemPrompt},
                             {role: 'system', content: this.outputPrompt},
                             {role: 'user',   content: this.userPrompt}
                            ];
                const choices = await this.myAgent.execute(msg);
                console.log(choices);
                this.output.push(choices);
                
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
         })();
    }

    save(){
        let d = super.save();
        d['systemPrompt'] = this.systemPrompt;
        d['userPrompt'] = this.userPrompt;
        d['outputPrompt'] = this.outputPrompt;
        d['output'] = this.output;
        console.log('Generator Agent Save');
        return d;
    }

}
module.exports = GeneratorAgent;
