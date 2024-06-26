const Agent = require('./agent');

class InputAgent extends Agent {
    constructor(agentStore, name, displayRow, displayCol) {
        super(agentStore, name, displayRow, displayCol);
        this.agentType = "input-agent";
        this.inputType = "text";
        this.inputSet  = false;
    }

    setInputType(t) {
        this.inputType = t;
        this.version++;
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
                    const completionTokens = usage['completion_tokens'];
                    const propmtTokens     = usage['prompt_tokens'];
                    this.version           = this.version + 1;
                    this.completionTokens  = this.completionTokens + completionTokens;
                    this.promptTokens      = this.promptTokens + promptTokens;
                    console.log(choices);
                    this.output.push(choices);
                
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
        this.inputSet = false;
        this.output = [];
    }
    
    
    save(){
        let d = super.save();
        d['inputType']     = this.inputType;
        return d;
    }
    load(d){
        super.load(d);
        this.inputType   = d['inputType'];
    }
}

module.exports = InputAgent;
