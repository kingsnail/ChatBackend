const Agent = require('./agent');
const OpenAIAgent = require('./ChatGPT');

class GeneratorAgent extends Agent {
    constructor(agentStore, name, displayRow, displayCol) {
        super(agentStore, name, displayRow, displayCol);
        this.agentType = "generator-agent";   
        this.systemPrompt = `You are a helpful assistant. Please try and follow the next instructions to the best of your ability. When asked a question, answer the question to the best of your ability.`;
        this.userPrompt = "Say this is a test";
        this.outputPrompt = `You must format all of your output as a JSON object with a key value of 'chatResult'. Format 'chatResult' as a JSON list for each response item listed where each list item has the following tags: 'item' whos value is the serial number of the item; and 'text' whos value is the text of the item.`;
        this.output = [];
        this.triggered = false;
        
    }
        
    setApiKey(k) {
         if (k != this.apiKey){
              this.apiKey = k;
              this.myAgent = new OpenAIAgent(this.apiKey);
         }
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
        if (!this.triggered){
            this.triggered = true;
            (async () => {
        
                try{ 
                    const apiKey = this.agentStore.getSessionStore().getApiKeyToUse();
                    const myAgent = new OpenAIAgent(apiKey);
                    const msg = [{role: 'system', content: this.systemPrompt},
                                 {role: 'system', content: this.outputPrompt},
                                 {role: 'user',   content: this.userPrompt}
                                ];
                    const choices = await myAgent.execute(msg);
                    console.log(choices);
                    this.output.push(choices);
                    this.subscribers.forEach((x, i) => {this.agentStore.getAgent(x).setInput(choices, this.uuid);
                                                       });
                } catch (error) {
                    console.error("Failed to fetch data:", error);
                }
            })();
        } else {
              console.log("Already triggered.");
        }
    }

    save(){
        let d = super.save();
        d['systemPrompt'] = this.systemPrompt;
        d['userPrompt'] = this.userPrompt;
        d['outputPrompt'] = this.outputPrompt;
        d['output'] = this.output;
        d['apiKey'] = this.apiKey;
        return d;
    }
    
    load(d){
        super.load(d);
        this.systemPrompt = d['systemPrompt'];
        this.userPrompt   = d['userPrompt'];
        this.outputPrompt = d['outputPrompt'];
        this.output       = d['output'];
        this.apiKey       = d['apiKey'];        
    }

}
module.exports = GeneratorAgent;
