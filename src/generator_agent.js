const Agent = require('./agent');
const OpenAIAgent = require('./ChatGPT');

class GeneratorAgent extends Agent {
    constructor(agentStore, name, displayRow, displayCol) {
        super(agentStore, name, displayRow, displayCol);
        this.agentType = "generator-agent";   
        this.systemPrompt = `You are a helpful assistant. Please try and follow the next instructions to the best of your ability. When asked a question, answer the question to the best of your ability.`;
        this.userPrompt = "Say this is a test";
        this.outputPrompt = `You must format all of your output as a JSON object with a key value of 'chatResult'. Format 'chatResult' as JSON object that has values 'item': 0, 'from': ${this.name} and 'text' is to contain all of your response.`;
        this.outputPromptList = `You must format all of your output as a JSON object with a key value of 'chatResult'. Format 'chatResult' as a JSON list for each response item listed where each list item has the following tags: 'item' whos value is the serial number of the item; 'from': "${this.name}"; and 'text' whos value is the text of the item.`;
        this.output = [];
        this.triggered = false;
        this.listItemOutput = false;    
        this.completionTokens = 0;
        this.promptTokens = 0;
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
    getListItemOutput(){
        return this.listItemOutput;
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
    setListItemOutput( l ) {
        this.listItemOutput = l;
    }
    
    execute(){
        super.execute();
        if (!this.triggered){
            this.triggered = true;
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
                                 {role: 'user',   content: this.userPrompt}
                                ];
                    const completion = await myAgent.execute(msg);
                    const choices = completion.choices;
                    const completionTokens = completion.usage['completion_tokens'];
                    const propmtTokens     = completion.usage['prompt_tokens'];
                    this.completionTokens  = this.completionTokens + completionTokens;
                    this.promptTokens      = this.promptTokens + promptTokens;
                    console.log("choices[0]=" + JSON.stringify(choices[0]));
                    console.log("message=" + JSON.stringify(choices[0].message));
                    console.log("content=" + choices[0].message.content);
                    const content = JSON.parse(choices[0].message.content);
                    if (content.chatResult.isArray()){
                        content.chatResult.forEach((x, i) => {this.output.push(x)});
                    } else {
                        this.output.push(content.chatResult);
                    }
                    this.output.forEach((op, i) => {
                        this.subscribers.forEach((x, j) => {this.agentStore.getAgent(x).setInput(JSON.stringify(op), this.uuid);
                        });
                    });
                    
                } catch (error) {
                    console.error("Failed to fetch data:", error);
                }
            })();
        } else {
              console.log("Already triggered.");
        }
    }

    reset(){
        super.reset();
        this.completionTokens = 0;
        this.promptTokens = 0;
        this.output = [];
        this.triggered = false;
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
module.exports = GeneratorAgent;
