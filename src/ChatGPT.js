require { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: "org-lNKLoHVe60pOjy4RBnctEeEx",
    apiKey: "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"
    //apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const response = await openai.listEngines();

