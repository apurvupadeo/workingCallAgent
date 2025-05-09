import { METHODS } from '@/constants';
import { i18n } from 'next-i18next';

export async function getChatGptAnswer(messagesWithSender: { message: string; sender: string; context?: string }[]) {
  i18n?.init();

  const chatGptApiFormattedMessages = messagesWithSender.map(messageObject => {
    return {
      role: messageObject.sender === 'ChatGPT' ? 'assistant' : 'user',
      content: messageObject.message,
      context: messageObject.context || '',
    };
  });

  const systemMessageToSetChatGptBehaviour = {
    role: 'system',
    content: i18n?.t('bob.systemMessage'),
  };

  const chatGptApiMessages = [
    systemMessageToSetChatGptBehaviour, // The system message DEFINES the logic of our chatGPT
    ...chatGptApiFormattedMessages, // The messages from our chat with ChatGPT
  ];

  try {
    const response = await fetch(`/api/chat/message`, {
      method: METHODS.POST,
      body: JSON.stringify(chatGptApiMessages),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const text = (data.candidates[0].content.parts[0].text);
    return text;
  } catch (error) {
    console.error('Error:', error);
  }
}
