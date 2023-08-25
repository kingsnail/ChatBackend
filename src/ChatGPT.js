const OpenAI = require('openai');

class OpenAIAgent{
    constructor(apiKey){
        this.apiKey = apiKey;
        this.openai = new OpenAI({apiKey: this.apiKey});
    }

    async execute(msg){
        try {
            // msg = [{ role: 'user', content: 'Say this is a test' }]
            const completion = await this.openai.chat.completions.create({
                messages: msg,
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
