const Agent = require('./agent');

const OpenAIAgent = require('./ChatGPT');

class GeneralAgent extends Agent {
    constructor(agentStore, name, displayRow, displayCol, apiKey) {
        super(agentStore, name, displayRow, displayCol);
        this.agentType = "standard-agent";
        this.systemPrompt = `You are a helpful assistant. Please try and follow the next instructions to the best of your ability. When asked a question, answer the question to the best of your ability.`;
        this.userPrompt = "";
        this.outputPrompt = `You must format all of your output as a JSON object with a key value of 'chatResult'. Format 'chatResult' as JSON object that has values 'item': 0, 'from': ${this.name} and 'text' is to contain all of your response.`;
        this.outputPromptList = `You must format all of your output as a JSON object with a key value of 'chatResult'. Format 'chatResult' as a JSON list for each response item listed where each list item has the following tags: 'item' whos value is the serial number of the item; 'from': "${this.name}"; and 'text' whos value is the text of the item.`;
        this.output = [];
        this.listItemOutput = false;
        this.completionTokens = 0;
        this.promptTokens = 0;
        this.apiKey = apiKey;
        this.myAgent = new OpenAIAgent(this.apiKey);
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
    getListItemOutput(){
        return this.listItemOutput;
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
    setListItemOutput(l){
        this.listItemOutput = l;
    }
 
    execute(){
        super.execute();
        if (this.inputSet && this.input.length > 0 ){
            const nextInput = {role: 'user', content: this.input.shift()};                
            if (this.input.length == 0) {
                this.inputSet = false;
            }
            (async () => {
        
                try{ 
                    let opPrompt = this.outputPrompt;
                    if (this.listItemOutput){
                         opPrompt = this.outputPromptList;
                    }
                    const apiKey = this.agentStore.getSessionStore().getApiKeyToUse();
                    const myAgent = new OpenAIAgent(apiKey);
                    const msg = [{role: 'system', content: this.systemPrompt},
                                 {role: 'system', content: opPrompt},
                                 {role: 'user',   content: this.userPrompt},
                                 nextInput
                                ];
                    const completion = await myAgent.execute(msg);
                    const choices = completion.choices;
                    const completionTokens = completion.usage['completion_tokens'];
                    const promptTokens     = completion.usage['prompt_tokens'];
                    this.version           = this.version + 1;
                    this.completionTokens  = this.completionTokens + completionTokens;
                    this.promptTokens      = this.promptTokens + promptTokens;
                    console.log(choices);
                    this.output.push(choices);
                    this.output.forEach((op, i) => {
                        this.subscribers.forEach((x, j) => {this.agentStore.getAgent(x).setInput(JSON.stringify(op), this.uuid);
                        });
                    });

                } catch (error) {
                    console.error("Failed to fetch data:", error);
                }
            })();
        } else {
              console.log("Awaiting input.");
        }
    }
    
    reset(){
        super.reset();
        this.completionTokens = 0;
        this.promptTokens = 0;
        this.output = [];
    }
    
    save(){
        let d = super.save();
        d['systemPrompt']     = this.systemPrompt;
        d['userPrompt']       = this.userPrompt;
        d['outputPrompt']     = this.outputPrompt;
        d['output']           = this.output;
        d['apiKey']           = this.apiKey;
        d['listItemOutput']   = this.listItemOutput;
        d['completionTokens'] = this.completionTokens;
        d['promptTokens']     = this.promptTokens;
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

module.exports = GeneralAgent;
