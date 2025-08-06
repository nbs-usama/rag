const OpenAI = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');
const logger = require('../utils/logger');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

class RAGService {
  static async generateEmbedding(text) {
    const response = await openai.embeddings.create({
      model: process.env.EMBEDDING_MODEL,
      input: text,
    });
    return response.data[0].embedding;
  }

  static async retrieveRelevantDocuments(query, topK = 5) {
    try {
      const queryEmbedding = await this.generateEmbedding(query);
      const index = pinecone.index(process.env.PINECONE_INDEX);
      
      const queryResponse = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
      });

      return queryResponse.matches.map(match => ({
        id: match.id,
        score: match.score,
        content: match.metadata.content,
        source: match.metadata.source,
      }));
    } catch (error) {
      logger.error('Document retrieval error:', error);
      return [];
    }
  }

  static async generateResponse(userQuery, retrievedDocs, conversationHistory = []) {
    const context = retrievedDocs
      .map(doc => `Source: ${doc.source}\nContent: ${doc.content}`)
      .join('\n\n');

    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI assistant. Use the following context to answer questions accurately. If the context doesn't contain relevant information, say so clearly.

Context:
${context}`
      },
      ...conversationHistory,
      { role: 'user', content: userQuery }
    ];

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return {
      content: response.choices[0].message.content,
      retrievedContext: retrievedDocs,
    };
  }

  static async storeDocument(content, metadata) {
    try {
      const embedding = await this.generateEmbedding(content);
      const index = pinecone.index(process.env.PINECONE_INDEX);
      
      await index.upsert([{
        id: metadata.id,
        values: embedding,
        metadata: { content, ...metadata },
      }]);

      logger.info('Document stored successfully', { id: metadata.id });
    } catch (error) {
      logger.error('Document storage error:', error);
      throw error;
    }
  }
}

module.exports = RAGService;