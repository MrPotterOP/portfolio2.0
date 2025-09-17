'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './styles.module.css';

import { useChat } from '@/app/hooks/useChat';


const CHAT_CONFIG = {
  API_ENDPOINT: '/api/chat',
  PLACEHOLDER_TEXT: 'Type your message here...',
  ASSISTANT_NAME: 'Selena',
  OWNER_NAME: 'Peter',
  PROFILE_PIC: '/images/profile.png'
};

// Subcomponents
const ChatInitial = () => (
  <div className={styles.chatInitial}>
    <div className={styles.chatInitialBox}>
      <div className={styles.chatProfile}>
        <Image 
          src="/images/profileHD.png" 
          width={40} 
          height={40} 
          alt={`${CHAT_CONFIG.ASSISTANT_NAME}'s profile picture`}
          priority
        />
      </div>
      <div className={styles.chatInitialText}>
        <p>
          Hi there! 👋 I&apos;m {CHAT_CONFIG.ASSISTANT_NAME}, {CHAT_CONFIG.OWNER_NAME}&apos;s personal AI assistant.
        </p>
      </div>
    </div>
  </div>
);

const UserMsg = (text) => {
    return (
      <div className={styles.msgBox + ' ' + styles.userMsg}>
        <div className={styles.msgBlob}>
          <p className={styles.msgText}>
            {text}
          </p>
        </div>
      </div>
    )
  }

  const AssistantMsg = (lines, typing) => {

    // Parse things like ** and *, also if https:// or www. is present, add a link

    const parseText = (text) => {
      const parts = text.split(/(\*\*.*?\*\*)/g); // split bold
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <span key={i} className={styles.msgBold}>{part.slice(2, -2)}</span>;
        }
        return part;
      });
    };

    const parseUrl = (nodes) => {
      return nodes.map((node, i) => {
        if (typeof node === "string") {
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          const parts = node.split(urlRegex);
          return parts.map((part, j) =>
            urlRegex.test(part) ? (
              <a className={styles.msgLink + ' ' + 'linkLight'} key={`${i}-${j}`} href={part} target="_blank" rel="noopener noreferrer">
                {part}
              </a>
            ) : (
              part
            )
          );
        }
        return node;
      });
    };

    const parseTextAndUrl = (text) => {
      return parseUrl(parseText(text));
    };



    return (
      <div className={styles.msgBox + ' ' + styles.assistantMsg}>
        

        
        <div className={styles.msgGroup}>
          {
            lines.split('-endl-').map((text, index) => (
              text.trim().length > 0 && (
                <div className={styles.msgBlob + ' ' + styles.received + ' ' + 'cursorLight'} key={index}>
                <p className={styles.msgText}>
                  {parseTextAndUrl(text)}
                </p>
              </div>
              )
            ))
          }
          
          {
            typing && <div className={styles.msgBlob + ' ' + styles.typing + ' ' + 'cursorLight'}>
                        <div className={styles.typingDots}>
                          <div className={styles.typingDot}></div>
                          <div className={styles.typingDot}></div>
                          <div className={styles.typingDot}></div>
                        </div>
                      </div>
          }
        </div>
      </div>
    )
  }


const Converstion = ({historyChats}) => {

  return (
      <Chats messages={historyChats} staticChat={true} />
  );
}

const UserInput = ({ msg, setMsg, onSubmit, isLoading, focus }) => {

  const inputRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  }, [onSubmit]);

  const handleChange = useCallback((e) => {
    setMsg(e.target.value);
  }, [setMsg]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (focus) {
      inputRef.current.focus();
    }
  }, [focus]);

  return (
    <div className={styles.chatInput}>
      <input
        className={"link"}
        ref={inputRef}
        type="text"
        value={msg}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={CHAT_CONFIG.PLACEHOLDER_TEXT}
        disabled={isLoading}
        aria-label="Chat message input"
        name="msg"
        maxLength="200"
        autoCorrect='off'
        autoComplete='off'
      ></input>
      <button 
        onClick={onSubmit}
        disabled={isLoading || msg.trim() === ''}
        aria-label="Send message"
        className={"link"}
      >
        {/* {isLoading ? 'Sending...' : 'Send'} */}
        <Image 
          src="/images/send.png" 
          width={24} 
          height={24} 
          alt="Send message icon" 
        />
      </button>
    </div>
  );
};

const Chat = ({ 
  isChatOpen, 
  onClose, 
  msg, 
  setMsg, 
  onSubmit, 
  isLoading,
  initialChat,
  children 
}) => (
  <motion.div 
    className={`${styles.chatbot} ${isChatOpen ? styles.active : styles.inactive}`}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.2 }}
    data-lenis-prevent
  >
    <div className={styles.chatHeadNav}>
      <p className={styles.chatHeadNavText}>Chat</p>

      <button
        className={`${styles.chatCloseBtn} link`}
        onClick={onClose}
        aria-label="Close chat"
        type="button"
      >
        <Image 
          src="/images/close.png" 
          width={24} 
          height={24} 
          alt="Close chat icon" 
        />
      </button>
    </div>
    <div className={styles.chatBody} data-lenis-prevent>
      { initialChat ? <Converstion historyChats={initialChat} /> : <ChatInitial /> }
      {children}
    </div>
    <UserInput 
      msg={msg} 
      setMsg={setMsg} 
      onSubmit={onSubmit}
      isLoading={isLoading}
      focus={!isLoading}
    />
  </motion.div>
);

const Chats = ({ messages, options, handleOption, staticChat }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if(!staticChat){
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0) {
    return null;
  }

  const handleChoice = (option) => {
    handleOption(option);
  }


  // Chat Assistant MSGS


  return (
    <div className={styles.chats} >
      {messages.map((message, index) => (
        <div key={`${message.role}-${index}`} className={styles.message}> 
        {
          message.role === 'user' && UserMsg(message.content)
        }
        {
          message.role === 'assistant' && AssistantMsg(message.content, message.typing)
        }
        </div>
      ))}

      {
        options && <div className={styles.optionsBox}>
          <p className={styles.optionsTitle}>You can pick one of the following options:</p>
          <div
            className={styles.optionsBtns}
          >
          {
            options.map((option, index) => (
              <motion.button 
              key={index} 
              className={styles.optionsBtn + ' linkLight'}
              onClick={() => handleChoice(option)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut', delay: index * 0.2 }}
              >
                {option}
              </motion.button>
            ))
          }
          </div>
        </div>
      }


      <div ref={chatEndRef} />
    </div>
  );
};



// Main Chatbot component
const Chatbot = () => {
  const [msg, setMsg] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { messages, isLoading, sendMessage, options, initialChat } = useChat();

  const handleSubmit = useCallback(async () => {
    if (msg?.trim() === '' || msg?.length > 200) return;
    
    const messageToSend = msg;
    setMsg('');
    await sendMessage(messageToSend);
  }, [msg, sendMessage]);

  const handleOption = useCallback((option) => {
    if (option?.trim() === '' || option?.length > 200) return;

    const messageToSend = option;
    setMsg('');
    sendMessage(messageToSend);
  }, [sendMessage]);

  const handleToggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  return (
    <div className={`${styles.chatContainer} ${isChatOpen ? styles.active : ''}`}>
      <motion.button
        className={`${styles.chatButton} ${isChatOpen ? styles.active : styles.inactive} linkLight`}
        onClick={handleToggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isChatOpen ? "Close chat" : "Open chat"}
      >
        <div className={styles.chatProfilePic}>
          <Image 
            src="/images/profile.png" 
            width={40} 
            height={40} 
            alt={`${CHAT_CONFIG.ASSISTANT_NAME}'s profile picture`}
          />
          <div className={styles.idleDot} />
        </div>

        {isChatOpen && (
          <div className={styles.closeIcon}>
            <Image 
              src="/images/close.png" 
              width={24} 
              height={24} 
              alt="Close chat icon" 
            />
          </div>
        )}
        <div className={styles.chatBtnText}>
          {isChatOpen ? "Close Chat" : "Talk to me"}
        </div>
      </motion.button>

      {isChatOpen && (
        <Chat
          isChatOpen={isChatOpen}
          onClose={handleCloseChat}
          msg={msg}
          setMsg={setMsg}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialChat={initialChat}
        >
          <Chats messages={messages} options={options} handleOption={handleOption} />
        </Chat>
      )}
    </div>
  );
};

export default Chatbot;
