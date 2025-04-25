import 'regenerator-runtime/runtime';

// import React from 'react';

// import ConversionIdea from './ConversionIdea';
// import MessageBox from './MessageBox';
// import TalkButton from './TalkButton';
// import { useCallManager } from './CallManager';

// export default function CallBob() {
//   const {
//     userCall,
//     userSpeak,
//     userStopSpeaking,
//     listening,
//     isCalling,
//     endCall,
//     handleSend,
//     messages,
//     isChatbotSpeaking,
//   } = useCallManager();
//   return (
//     <div className="flex lg:flex-row lg:items-center lg:justify-center xxs:h-full flex-col items-center justify-end overflow-auto">
//       {/* <div className="bg-[url(../public/assets/Bob.gif)] lg:h-[500px] lg:w-[500px] xxs:h-0 w-full bg-no-repeat bg-contain bg-center"></div> */}
//       <div className="flex justify-center flex-col items-center lg:w-[calc(100%-600px)] w-full xxs:h-full">
//         <MessageBox message={messages[messages.length - 1].message} />
//         <div className="mb-8 flex justify-center flex-col items-center">
//           <TalkButton
//             userCall={userCall}
//             userSpeak={userSpeak}
//             userStopSpeaking={userStopSpeaking}
//             listening={listening}
//             isCalling={isCalling}
//             endCall={endCall}
//             isChatbotSpeaking={isChatbotSpeaking}
//           />
//           {/* <ConversionIdea onSelect={handleSend} /> */}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import MessageBox from './MessageBox';
import TalkButton from './TalkButton';
import { useCallManager } from './CallManager';

export interface MessageType {
  message: string;
  sender: string; // 'user' or 'ChatGPT'
}

export default function CallBob() {
  const {
    userCall,
    userSpeak,
    userStopSpeaking,
    listening,
    isCalling,
    endCall,
    messages,
    isChatbotSpeaking,
  } = useCallManager();

  const [storedMessages, setStoredMessages] = useState<MessageType[]>([]);
  const [instructions, setInstructions] = useState<string>('');

  // Load messages from localStorage on first render
  useEffect(() => {
    const history = localStorage.getItem('chatHistory');
    if (history) {
      setStoredMessages(JSON.parse(history));
    }
  }, []);

  // Store new system messages when they arrive
  useEffect(() => {
    if (messages.length > 0) {
      const latest = messages[messages.length - 1];

      const updated = [...storedMessages, { sender: latest.sender, message: latest.message }];
      setStoredMessages(updated);
      localStorage.setItem('chatHistory', JSON.stringify(updated));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const change = (value: string) => {
      setInstructions(value);
      localStorage.setItem('context', value);
  }
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-[1200px] bg-[#1f1f1f] rounded-xl p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campaign Instructions */}
          <div className="bg-[#2a2a2a] rounded-lg p-6 flex flex-col text-white">
            <h2 className="text-2xl font-semibold mb-4">Campaign Instructions</h2>
            <textarea
              className="flex-1 resize-none rounded-md p-4 bg-black border border-gray-700 text-white placeholder-gray-400"
              placeholder="Write your instructions here..."
              value={instructions}
              onChange={(e) => change(e.target.value)}
              rows={12}
            />
          </div>

          {/* Test Conversation */}
          <div className="bg-[#2a2a2a] rounded-lg p-6 flex flex-col text-white">
            <h2 className="text-2xl font-semibold mb-4 text-center">Test Conversation</h2>
            <div className="flex-1 overflow-y-auto mb-6">
              <MessageBox messages={storedMessages} />
            </div>
            <div className="mt-4 flex justify-center">
              <TalkButton
                userCall={userCall}
                userSpeak={userSpeak}
                userStopSpeaking={userStopSpeaking}
                listening={listening}
                isCalling={isCalling}
                endCall={endCall}
                isChatbotSpeaking={isChatbotSpeaking}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
