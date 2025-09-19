import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Resume data - you'll need to embed this directly or fetch it differently
const resumeData = `# Maddie's Resume
[Your resume content here - you'll need to copy the content from maddieResume.md]`;

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { question } = JSON.parse(event.body);
    
    if (!question) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Question is required' }) };
    }

    if (!process.env.OPENAI_API_KEY) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'OpenAI API key not configured' }) 
      };
    }

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

    const response = completion.choices[0]?.message?.content || 'No response generated';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: response })
    };
  } catch (error) {
    console.error('Error processing query:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process query' })
    };
  }
};

