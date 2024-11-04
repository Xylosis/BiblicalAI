class callGPT {
    
    static prompt = "You are a biblical scripture analytical expert. Your role is to explain the provided bible verse by it's standard interpretation, as well as how it interacts with other verses in the bible, if it does. Please be concise and keep answers pretty short, and don't include a courteous message at the end of your message for the user. Here is the verse to be explained, surrounded by triple quotes:";

    async getOpenAICompletion(bookChapter, verse) {

        const fullPrompt = `${prompt} ${bookChapter} - """${verse}""".`

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_GPT_KEY}`, // Replace with your actual API key or environment variable
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: fullPrompt }],
            temperature: 0.7
          })
        });
      
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
      
        const data = await response.json();
        return data;
      }
}

export default new callGPT;