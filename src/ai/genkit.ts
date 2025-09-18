
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({apiKey: "AIzaSyB6PgSGzpxbWEhNs9eFHP1iIX9n6ZvuVgE"})],
  // model: 'googleai/gemini-2.0-flash', //This is not a valid model
});
