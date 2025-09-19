import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Query the LLM with the given context
 * @param {string} context - The context/prompt to send to the LLM
 * @returns {Promise<string>} - The response from the LLM
 */
export async function queryLLM(context) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant that provides professional and accurate information about job candidates based on their resume data."
        },
        {
          role: "user",
          content: context
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error querying LLM:', error);
    
    // Fallback response if LLM fails
    if (error.message.includes('API key')) {
      return 'I apologize, but the AI service is currently unavailable. Please contact Maddie directly for more information.';
    }
    
    return 'I apologize, but I encountered an error while processing your question. Please try again or contact Maddie directly.';
  }
}
