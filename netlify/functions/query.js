import OpenAI from 'openai';

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

    // Initialize OpenAI client inside the function
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // You need to add your actual resume data here
    const resumeData = `# Maddie's Resume
# Madeline Mathis

📞 +1 801-473-8343 | 📧 madelinemathis79@gmail.com | [LinkedIn](https://www.linkedin.com/in/madeline-mary-mathis)

---

## Experience

**Full Stack Developer Intern** | Strategic Maintenance Solutions  
*May 2025 – Present*  
- Developed and deployed an internal web tool leveraging OpenAI APIs to automate business processes, reducing redundant manual effort and increasing team productivity.  
- Customized IBM Maximo software by integrating React-based mobile components with enterprise systems, enhancing usability and streamlining client operations.  

**Full Stack Developer** | Brigham Young University  
*January 2023 – May 2025*  
- Designed and implemented responsive and user-friendly interfaces that improved user task time completion by **46.3%**.  
- Developed and maintained a full-stack asset management web application, ensuring data integrity across different platforms by writing and maintaining APIs.  
- Created and executed data cleaning procedures to fix errors in the database, improving multiple assets from **10–15% coverage to 100% coverage**.  

---

## Education

**Brigham Young University**  
B.S. Computer Science | GPA: **3.93** | *Anticipated Graduation: December 2025*  

---

## Technical Skills

- **Programming Languages:** Python, C, C++, Java, HTML, CSS, XML, JavaScript, SQL, Typescript  
- **Technologies & Frameworks:** GitHub, MySQL, Postman, AWS, REST API, WebSocket, Relational Databases, Node.js, OpenAI API (automation, agentic workflows)  
- **Languages:** English (native), Estonian (proficient)  
- **Relevant Coursework:** Data Structures, Computer Systems, Advanced Software Construction, Systems Programming, Discrete Structures, Web Programming, Algorithm Design & Analysis, Intro to Machine Learning, Computational Linear Algebra, Building Agentic Applications  

---

## Projects

**RFP Express**
- Maddie developed a web application using react that stores a database of previous questions and answers that a consulting company 
has used in their responses to the Requests for Proposals that they have received. The database is used in 
conjunction with an LLM that can generate answers to new questions, and provides a confidence score for each 
question it answers. This is used to simplify and streamline a company's process when generating responses to new 
requests for proposals. This project uses a substantial amount of AI and machine learning. 

**Chess Game**  
- Developed a command-line chess application using Java for backend logic and MySQL for data persistence.  
- Implemented WebSocket to enable real-time interaction between players and observers via a web interface.  

**Personal Financial Management Startup**  
- Built an application hosted on an AWS server using CSS, HTML, JavaScript, and MongoDB for data persistence.  
- Enabled users to connect with each other, and log and view information using WebSocket.  

---

## Awards & Involvement

- BYU Women In Computer Science Club (2023–Present, leadership position)  
- Utah State Sterling Scholar Runner-Up (2020)  
- Distinguished Young Women of American Fork (2020)  

## Personal and Fun Information 
- Aside from computer science, Maddie is passionate about musical theater. She performed for 15 years.
- Maddie is a big Laufey fan!
- Maddie is the second oldest of 5 siblings and grew up in American Fork Utah!
- Maddie loves cucumbers but hates pickles!
- Maddie speaks Estonian and lived in Estonia for a year and a half!`;

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
    server. Use language like "this application you are using right now!" and make it clear that the user knows 
    that maddie made this application. 

    -If you are asked about Maddie's personal and fun information, only include the information 
    from the personal and fun information section of the resume. Do not include any information about computer 
    science or work experience. Do not just restate the information from the personal and fun information section,
    but rather use it to answer the question. Do not use the information from the personal and fun information section 
    to answer any other questions. 

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

