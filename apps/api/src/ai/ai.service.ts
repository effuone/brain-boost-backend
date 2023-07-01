import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { jsonrepair } from 'jsonrepair';
import cohere from 'cohere-ai';

const baseRoadmapJsonStructure = `{"title":"Learning topic","description":"Learning topic description","steps":[{"title":"Roadmap step 1 name","description":"Roadmap step 1 description","topics":[{"name":"Topic 1 name","description":"Topic 1 description","resources":[{"name":"Topic 1 first useful resource name","link":"link to Topic 1 first useful resource name"},{"name":"Topic 1 second useful resource name","link":"link to Topic 1 second useful resource name"}]},{"name":"Topic 2 name","description":"Topic 2 description","resources":[{"name":"Topic 2 first useful resource name","link":"link to Topic 2 first useful resource name"},{"name":"Topic 2 second useful resource name","link":"link to Topic 2 second useful resource name"}]},{"name":"Topic 3 name","description":"Topic 3 description","resources":[{"name":"Topic 3 first useful resource name","link":"link to Topic 3 first useful resource name"},{"name":"Topic 3 second useful resource name","link":"link to Topic 3 second useful resource name"}]},{"name":"Topic 4 name","description":"Topic 4 description","resources":[{"name":"Topic 4 first useful resource name","link":"link to Topic 4 first useful resource name"},{"name":"Topic 4 second useful resource name","link":"link to Topic 4 second useful resource name"}]},{"name":"Topic 5 name","description":"Topic 5 description","resources":[{"name":"Topic 5 first useful resource name","link":"link to Topic 5 first useful resource name"},{"name":"Topic 5 second useful resource name","link":"link to Topic 5 second useful resource name"}]}]},{"title":"Roadmap step 2 name","description":"Roadmap step 2 description","topics":[{"name":"Topic 1 name","description":"Topic 1 description","resources":[{"name":"Topic 1 first useful resource name","link":"link to Topic 1 first useful resource name"},{"name":"Topic 1 second useful resource name","link":"link to Topic 1 second useful resource name"}]},{"name":"Topic 2 name","description":"Topic 2 description","resources":[{"name":"Topic 2 first useful resource name","link":"link to Topic 2 first useful resource name"},{"name":"Topic 2 second useful resource name","link":"link to Topic 2 second useful resource name"}]},{"name":"Topic 3 name","description":"Topic 3 description","resources":[{"name":"Topic 3 first useful resource name","link":"link to Topic 3 first useful resource name"},{"name":"Topic 3 second useful resource name","link":"link to Topic 3 second useful resource name"}]},{"name":"Topic 4 name","description":"Topic 4 description","resources":[{"name":"Topic 4 first useful resource name","link":"link to Topic 4 first useful resource name"},{"name":"Topic 4 second useful resource name","link":"link to Topic 4 second useful resource name"}]},{"name":"Topic 5 name","description":"Topic 5 description","resources":[{"name":"Topic 5 first useful resource name","link":"link to Topic 5 first useful resource name"},{"name":"Topic 5 second useful resource name","link":"link to Topic 5 second useful resource name"}]}]}]}`;

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  async getConceptDescription(mainRoadmapTitle: string, description: string) {
    cohere.init(process.env.COHERE_API_KEY);
    const prompt = `what is meant by ${description}, where it used and how it useful for ${mainRoadmapTitle}`;
    this.logger.log(prompt);
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
    this.logger.log(text);
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
    this.logger.log(title);
    this.logger.log(description);
    this.logger.log(steps);
    return { title, description, steps };
  }
}