const OpenAI = require('openai');

class OpenAIAgent{
    constructor(apiKey){
        this.apiKey = apiKey;
        this.openai = new OpenAI({apiKey: this.apiKey});
    }

    async execute(){
        try {
            const completion = await this.openai.chat.completions.create({
                messages: [{ role: 'user', content: 'Say this is a test' }],
                model: 'gpt-3.5-turbo',
            });
    
            console.log(completion.choices);

            return( completion.choices );
        
        } catch (error) {
            console.error("Error fetching data:", error);
            throw error;
        }

    }
}

module.exports = OpenAIAgent;
