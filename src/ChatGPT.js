import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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', // defaults to process.env["OPENAI_API_KEY"]
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-3.5-turbo',
  });

  console.log(completion.choices);
}

main();
