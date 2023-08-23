const OpenAI = require('openai');

class OpenAIAgent{
    constructor(apiKey){
        this.apiKey = apiKey;
        this.openai = new OpenAI({apiKey: this.apiKey});
    }

    execute(){
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: 'Say this is a test' }],
            model: 'gpt-3.5-turbo',
        });

        console.log(completion.choices);
    }
}
  
async function main() {
}

main();
