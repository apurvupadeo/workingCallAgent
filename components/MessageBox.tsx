// import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// interface MessageBoxProps {
//   message: string;
// }
// export default function MessageBox({ message }: MessageBoxProps) {
//   return (
//     <div className="text-xl text-[#22223B] font-bold xxs:h-full md:h-auto flex-1 md:mb-5 md:mt-0 xxs:mt-12 xxs:mb-[148px] flex justify-center items-center overflow-y-auto ">
//       <FontAwesomeIcon
//         icon={faQuoteLeft}
//         style={{ color: 'black', fontSize: '35px', paddingRight: '12px' }}
//       ></FontAwesomeIcon>

//       <div className="h-full flex items-center">{message}</div>
//     </div>
//   );
// }
// import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import React, { useEffect, useRef } from 'react';

// interface MessageBoxProps {
//   messages: string[];
// }

// export default function MessageBox({ messages }: MessageBoxProps) {
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // Auto scroll to bottom
//   useEffect(() => {
//     scrollRef.current?.scrollTo({
//       top: scrollRef.current.scrollHeight,
//       behavior: 'smooth',
//     });
//   }, [messages]);

//   return (
//     <div className="text-base text-[#22223B] font-medium xxs:h-full md:h-auto flex-1 md:mb-5 md:mt-0 xxs:mt-12 xxs:mb-[148px] flex justify-center items-center overflow-y-auto">
//       <div
//         ref={scrollRef}
//         className="w-full max-w-2xl h-full px-4 py-4 overflow-y-auto space-y-4"
//         style={{ maxHeight: '400px', backgroundColor: '#f8f8ff', borderRadius: '8px' }}
//       >
//         {messages.map((msg, index) => (
//           <div key={index} className="flex items-start">
//             <FontAwesomeIcon
//               icon={faQuoteLeft}
//               style={{ color: 'black', fontSize: '16px', marginRight: '8px', marginTop: '4px' }}
//             />
//             <span className="text-gray-800">{msg}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useRef } from 'react';
import { MessageType } from './CallBob';

interface MessageBoxProps {
  messages: MessageType[];
}

export default function MessageBox({ messages }: MessageBoxProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="w-full h-[300px] overflow-y-auto px-2 py-4 space-y-2"
    >
      {messages.map((msg, index) => {
        const isUser = msg.sender.toLowerCase() === 'user';

        return (
          <div
            key={index}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-xl px-4 py-2 max-w-[70%] text-sm ${
                isUser ? 'bg-blue-800 text-white' : 'bg-gray-700 text-white'
              }`}
            >
              {msg.message}
            </div>
          </div>
        );
      })}
    </div>
  );
}
