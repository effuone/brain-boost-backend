import { Injectable } from '@nestjs/common';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { jsonrepair } from 'jsonrepair';
import cohere from 'cohere-ai';

const baseRoadmapJsonStructure = `{"title":"Learning topic","description":"Learning topic description","steps":[{"title":"Roadmap step 1 name","description":"Roadmap step 1 description","topics":[{"name":"Topic 1 name","description":"Topic 1 description","resources":[{"name":"Topic 1 first useful resource name","link":"link to Topic 1 first useful resource name"},{"name":"Topic 1 second useful resource name","link":"link to Topic 1 second useful resource name"}]},{"name":"Topic 2 name","description":"Topic 2 description","resources":[{"name":"Topic 2 first useful resource name","link":"link to Topic 2 first useful resource name"},{"name":"Topic 2 second useful resource name","link":"link to Topic 2 second useful resource name"}]},{"name":"Topic 3 name","description":"Topic 3 description","resources":[{"name":"Topic 3 first useful resource name","link":"link to Topic 3 first useful resource name"},{"name":"Topic 3 second useful resource name","link":"link to Topic 3 second useful resource name"}]},{"name":"Topic 4 name","description":"Topic 4 description","resources":[{"name":"Topic 4 first useful resource name","link":"link to Topic 4 first useful resource name"},{"name":"Topic 4 second useful resource name","link":"link to Topic 4 second useful resource name"}]},{"name":"Topic 5 name","description":"Topic 5 description","resources":[{"name":"Topic 5 first useful resource name","link":"link to Topic 5 first useful resource name"},{"name":"Topic 5 second useful resource name","link":"link to Topic 5 second useful resource name"}]}]},{"title":"Roadmap step 2 name","description":"Roadmap step 2 description","topics":[{"name":"Topic 1 name","description":"Topic 1 description","resources":[{"name":"Topic 1 first useful resource name","link":"link to Topic 1 first useful resource name"},{"name":"Topic 1 second useful resource name","link":"link to Topic 1 second useful resource name"}]},{"name":"Topic 2 name","description":"Topic 2 description","resources":[{"name":"Topic 2 first useful resource name","link":"link to Topic 2 first useful resource name"},{"name":"Topic 2 second useful resource name","link":"link to Topic 2 second useful resource name"}]},{"name":"Topic 3 name","description":"Topic 3 description","resources":[{"name":"Topic 3 first useful resource name","link":"link to Topic 3 first useful resource name"},{"name":"Topic 3 second useful resource name","link":"link to Topic 3 second useful resource name"}]},{"name":"Topic 4 name","description":"Topic 4 description","resources":[{"name":"Topic 4 first useful resource name","link":"link to Topic 4 first useful resource name"},{"name":"Topic 4 second useful resource name","link":"link to Topic 4 second useful resource name"}]},{"name":"Topic 5 name","description":"Topic 5 description","resources":[{"name":"Topic 5 first useful resource name","link":"link to Topic 5 first useful resource name"},{"name":"Topic 5 second useful resource name","link":"link to Topic 5 second useful resource name"}]}]}]}`;

const baseRoadmapTestJsonStructure = `{"tests":[{"question":"What is the purpose of Source Code Management (SCM)?","Answers":["It provides a way to store and access source code","It helps developers collaborate on projects","It allows developers to roll back changes","It enables access control"],"RightAnswer":0},{"question":"What is the most popular Source Code Management system?","Answers":["Github","Bitbucket","Subversion","Mercurial"],"RightAnswer":0},{"question":"What are the benefits of using Source Code Management?","Answers":["It encourages code reuse","It enables access control","It provides better version control","It minimizes risk of data loss"],"RightAnswer":2}]}`;

@Injectable()
export class AiService {
  async getConceptDescription(mainRoadmapTitle: string, description: string) {
    cohere.init(process.env.COHERE_API_KEY);
    const prompt = `what is meant by ${description}, where it used and how it useful for ${mainRoadmapTitle}`;
    const response = await cohere.generate({
      model: 'command',
      prompt: prompt,
      max_tokens: 300,
      temperature: 0.9,
      k: 0,
      stop_sequences: [],
      return_likelihoods: 'NONE',
    });

    const text = response.body.generations[0].text;
    return text;
  }

  async createRoadmapSteps(topic: string) {
    const template = `I am creating a roadmap generator service where users can request a roadmap for any topic they want to learn. For example, topics could include calculus, DevOps, cooking, driving prerequisites, and more. I gather information from ChatGPT using the following JSON structure: {structure}. Your task is to generate a roadmap for {roadmapTopic} and return a response that is ONLY structured in JSON format (that I have sent you)`;

    const openAIModel = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0.7,
      maxTokens: 2000,
    });

    const propmt = new PromptTemplate({
      template: template,
      inputVariables: ['structure', 'roadmapTopic'],
    });
    const formatprompt = await propmt.format({
      structure: baseRoadmapJsonStructure,
      roadmapTopic: topic,
    });
    const responseText = await openAIModel.call(formatprompt);
    const fixedRes = JSON.parse(jsonrepair(responseText));
    const { title, description, steps } = fixedRes;
    return { title, description, steps };
  }

  async createRoadmapTests(topic: string) {
    const template = `Create a json file using following structure: {structure}. Given structure is an example of test question created on topic of Source Code Management. Your JSON file should include 5 questions on {topic}`;

    const openAIModel = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-davinci-003',
      temperature: 1,
      maxTokens: 2000,
    });

    const prompt = new PromptTemplate({
      template: template,
      inputVariables: ['structure', 'topic'],
    });

    const formatprompt = await prompt.format({
      structure: baseRoadmapTestJsonStructure,
      topic: topic,
    });

    const responseText = await openAIModel.call(formatprompt);

    return responseText;
  }
}
