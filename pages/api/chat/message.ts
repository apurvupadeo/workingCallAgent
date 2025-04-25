import { METHODS } from '@/constants';
import { NextApiResponse, NextApiRequest } from 'next';

interface RequestParam {
  method: METHODS;
  body: string;
}
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let messages;
  try {
    messages = JSON.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not found' });
  }
  // const contextMessage = {
  //   role: 'user',
  //   parts: [{ text: "You are a sales representative calling on behalf of Bhanodaya constructions, for a premium luxury apartment project in Kompally Called Bhanodaya Crystal. Your name: Jyothi. Customer Name: Raju. Context: Customer registered interest in the website and now you are calling back. So tell that you are calling back because of that. Goal: Your goal is to convince the customer to visit the site—not to provide too many details over the call. Unless the customer persists. Rules you need to follow: 1. Do not speak more than two sentences back to back. Speak like a human. 2. Always end your second sentence to get response from customer. Always call customer as sir. 3. You need to ask the budget, and if it is above 60 lakhs, tell its within your budget. Details about the project: Discover luxury living at Bhanodaya Crystal project by Neemsboro Group in Gundlapochampally, Hyderabad, conveniently located just 25 minutes from Suchitra Circle. This RERA-approved development spans 9 acres, featuring 4 Towers with 810 luxury 2 and 3 BHK apartments ranging from 1320 to 1825 sq.ft. Embodying elegance, Bhanodaya Crystal includes a 50,000+ sq.ft clubhouse with world-class amenities, showcasing Neemsboro Group’s dedication to crafting exceptional living spaces in the heart of Hyderabad’s real estate landscape. This prestigious project, spanning 5+ acres, stands tall with three high-rise towers with 4 podiums comprising a total of 585 units across 50 floors. Elevate your lifestyle – These gated community flats for sale in Kondapur are ideal for those seeking an upgrade to 3 BHK (+ Maid Room) / 4 BHK (+ Maid Room) homes in West Hyderabad’s catchment."}]
  // };
  const contextText: string =
  messages.find((msg: { role: string; content: string; context?: string }) => msg.context)?.context || '';
  const contextMessage = {
    role: 'user',
    parts: [{ text: contextText}],
  };
  const parts = [
    contextMessage,
    ...messages.map((msg: { role: string; content: string; }) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))
  ];

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: parts,
      }),
    });
    const data = await response.json();
    return res.status(200).json(data);
  }
  catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
}