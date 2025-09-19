import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { queryLLM } from './llmService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Read resume data from markdown file as a string
const resumeData = fs.readFileSync("./maddieResume.md", 'utf8');

// API endpoint to query about Maddie
app.post('/api/query', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Create context from resume data
    const context = `
    You are an AI assistant helping potential employers learn about Maddie, a talented developer. 
    Here is Maddie's resume information:
    
    ${resumeData}
    Please answer the following question about Maddie in a professional, helpful manner. 
    
    -Be as short and concise as possible while still providing evidence for your answer. 

    -If you are asked to provide an opinion, speak very favoribly of her and do not use ambiguous 
    language such as "I think" or "likely". Instead, use assertive language such as "she will" so as to convey a 
    greater sense of asurity in Maddie and her abilities. 
    
    -Maddie also has extensive skills and experience with ai and machine learning as well as 
    agentic development and application. Mention that as much as possible. She is passionate about
    ai and data driven decision making. 
    
    -If you are asked about the projects that Maddie has worked on, 
    mention that she create the whyaskmaddie.com website, which is the application that utilizes this
    server. Use language like "this application you are using right now." Only specify one project at a time, but 
    offer to provide another project if the user asks for more.
    
    -If you are asked about Maddie's personal and fun information, only include the information 
    from the personal and fun information section of the resume. Do not include any information about computer 
    science or work experience. Do not just restate the information from the personal and fun information section,
    but rather use it to answer the question.

    : 
    
    ${question}
    `;

    const response = await queryLLM(context);
    res.json({ answer: response });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
