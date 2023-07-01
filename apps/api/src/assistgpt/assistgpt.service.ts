import { Injectable } from '@nestjs/common';
import { CreateAssistgptDto } from './dto/create-assistgpt.dto';
import { UpdateAssistgptDto } from './dto/update-assistgpt.dto';
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

@Injectable()
export class AssistgptService {
  async createRoadmap(createAssistgptDto: CreateAssistgptDto) {
    const template = `what is {topic}`

    const openAIModel = new OpenAI({ openAIApiKey: "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", temperature: 0.7 })


    const propmt = new PromptTemplate({
      template: template,
      inputVariables: ["topic"]
    })

    const formatprompt = await propmt.format({topic: `${createAssistgptDto.roadmapTopic}`})
    const res = await openAIModel.call(formatprompt)
    return(res)
  }
}
