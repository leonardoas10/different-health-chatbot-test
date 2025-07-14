import dotenv from 'dotenv';
dotenv.config();

import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { RunnablePassthrough, RunnableWithMessageHistory } from '@langchain/core/runnables';
import { MongoDBAtlasVectorSearch, MongoDBChatMessageHistory } from '@langchain/mongodb';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { AgentExecutor, createOpenAIToolsAgent } from 'langchain/agents';
import { formatDocumentsAsString } from 'langchain/util/document';
import mongoose from 'mongoose';

import { ChatbotMessage } from '@/models/ChatbotMessage.model';
import { getLatestBodyCompositionScan, getHRVTrends, getVO2MaxProgress, getWearableMetrics, getHealthTrendAnalysis } from '@/modules/chatbot/tools';

interface AgentInput {
  input: string;
  userId: string;
}

interface AgentOutput {
  output: string;
}

const tools: any[] = [
  getLatestBodyCompositionScan,
  getHRVTrends,
  getVO2MaxProgress,
  getWearableMetrics,
  getHealthTrendAnalysis
];

// Debug: Check if OpenAI API key is loaded
console.log('OpenAI API Key loaded:', !!process.env.OPENAI_API_KEY);
console.log('OpenAI API Key prefix:', process.env.OPENAI_API_KEY?.substring(0, 10));

let agentWithChatHistory: any = null;
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});
const getAgent = async (): Promise<RunnableWithMessageHistory<AgentInput, AgentOutput>> => {
  if (agentWithChatHistory) {
    return agentWithChatHistory;
  }

  const llm = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  const nativeClient = mongoose.connection.getClient();

  const messageCollection = nativeClient.db('dev').collection('chatbotmessages');

  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection: messageCollection,
    textKey: 'content',
    embeddingKey: 'embedding',
    indexName: 'default',
  });

  const retriever = vectorStore.asRetriever({ k: 5 });

  const agentPrompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      `You are an advanced health analytics assistant specializing in personalized health insights and trend analysis.
  
       CAPABILITIES:
       - Analyze body composition (DEXA scans) for muscle/fat trends
       - Monitor HRV patterns for recovery and stress insights
       - Track VO2 Max progress for fitness improvements
       - Process real-time wearable data (heart rate, steps, calories, stress, recovery)
       - Identify health trends and correlations across multiple data sources
       - Provide actionable recommendations based on data patterns
  
       USER CONTEXT:
       - User ID: {userId} (always use this when calling tools)
       - Access to multiple health data collections: DEXA, HRV, VO2 Max, Wearables
  
       ANALYSIS APPROACH:
       1. Always look for trends and patterns in the data
       2. Correlate different health metrics when relevant
       3. Provide specific, data-driven insights
       4. Suggest actionable improvements based on findings
       5. Highlight concerning patterns or positive improvements
  
       STRICT RULES:
       - Only respond to health, fitness, recovery, and performance topics
       - Always use actual data from tools when available
       - Refuse non-health related questions politely
       - Maintain user privacy and data security
  
       Retrieved context from past conversations:
       {context}`,
    ],
    new MessagesPlaceholder('chat_history'),
    ['human', '{input}'],
    new MessagesPlaceholder('agent_scratchpad'),
  ]);

  const agent = await createOpenAIToolsAgent({ llm, tools, prompt: agentPrompt });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });

  const runnableAgent: any = RunnablePassthrough.assign({
    context: async (input: Record<string, unknown>) => {
      const agentInput = input as unknown as AgentInput;
      console.log('Context input:', agentInput);

      if (!agentInput?.input || typeof agentInput.input !== 'string') {
        console.log('Invalid input for context retrieval:', agentInput);
        return '';
      }

      try {
        return await retriever.pipe(formatDocumentsAsString).invoke(agentInput.input);
      } catch (error) {
        console.error('Error in context retrieval:', error);
        return '';
      }
    },
  }).pipe(agentExecutor);

  const getMessageHistory = (sessionId: string) => {
    return new MongoDBChatMessageHistory({
      collection: messageCollection,
      sessionId,
    });
  };

  agentWithChatHistory = new RunnableWithMessageHistory({
    runnable: runnableAgent,
    getMessageHistory,
    inputMessagesKey: 'input',
    historyMessagesKey: 'chat_history',
  });

  return agentWithChatHistory;
};

const invoke = async (params: { input: string; sessionId: string; userId: string }): Promise<AgentOutput> => {
  const { input, sessionId, userId } = params;

  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input: input must be a non-empty string');
  }

  const agent = await getAgent();

  const result: AgentOutput = await agent.invoke({ input, userId }, { configurable: { sessionId } });

  try {
    const [userEmbedding, assistantEmbedding] = await embeddings.embedDocuments([input, result.output]);

    const userMessage = {
      sessionId,
      userId: new mongoose.Types.ObjectId(userId),
      role: 'user' as const,
      content: input,
      embedding: userEmbedding,
    };

    const assistantMessage = {
      sessionId,
      userId: new mongoose.Types.ObjectId(userId),
      role: 'assistant' as const,
      content: result.output,
      embedding: assistantEmbedding,
    };

    await ChatbotMessage.insertMany([userMessage, assistantMessage]);
  } catch (dbError) {
    console.error('Error saving the conversation in the database:', dbError);
  }

  return result;
};

export const ChatbotService = {
  invoke,
};
