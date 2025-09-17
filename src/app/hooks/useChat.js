'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

import axios from 'axios';

const CHAT_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant'
};

const CHAT_CONFIG = {
  API_ENDPOINT: '/api/chat',
  API_HISTORY: '/api/chathistory',
  PLACEHOLDER_TEXT: 'Type your message here...',
  ASSISTANT_NAME: 'Selena',
  OWNER_NAME: 'Peter'
};


export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(false);
  const [initialChat, setInitialChat] = useState(false);
  const abortControllerRef = useRef(null);

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const updateLastMessage = useCallback((content) => {
    setMessages(prev => {
      if (prev.length === 0) return prev;
      
      const updated = [...prev];
      const lastMessage = updated[updated.length - 1];
      updated[updated.length - 1] = {
        ...lastMessage,
        content: lastMessage.content + content
      };
      return updated;
    });
  }, []);

  const updateTyping = useCallback((typing) => {
    setMessages(prev => {
      if (prev.length === 0) return prev;
      
      const updated = [...prev];
      const lastMessage = updated[updated.length - 1];
      updated[updated.length - 1] = {
        ...lastMessage,
        typing: typing
      };
      return updated;
    });
  }, []);

  const updateOptions = useCallback((options) => {
    const optionsArray = options.replace(/"/g, '').split(',');
    console.log(optionsArray, "OPTIONS");

    if(optionsArray.length > 1 && optionsArray.length <= 4){
      setOptions(optionsArray);
    }
  }, []);

  const updateChatLocal = useCallback((content, lastMessage) => {
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory'));
    if(!chatHistory){
      chatHistory = [];
    };
    chatHistory.push({
      role: 'user',
      content: content
    });
    chatHistory.push({
      role: 'assistant',
      content: lastMessage
    });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, []);

  const sendMessage = useCallback(async (content) => {
    if (content.trim() === '' || isLoading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {

      setOptions(false);

      const userMessage = {
        role: CHAT_ROLES.USER,
        content: content.trim()
      };
      addMessage(userMessage);

      const assistantMessage = {
        role: CHAT_ROLES.ASSISTANT,
        content: '',
        typing: true
      };
      addMessage(assistantMessage);

      const response = await fetch(CHAT_CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msg: content.trim(), clientId: localStorage.getItem('clientId') }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: 'Sorry, I encountered an error. Please try again.',
            typing: false
          };
          return updated;
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is empty');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let lastMessage = '';
      let allowed = true;

      try {
        while (true) {
          const { value: chunk, done } = await reader.read();
          
          if (done) {
            updateTyping(false);
            break;
          };

          const text = decoder.decode(chunk);

          lastMessage += text;


          if(text.includes('[')){
            allowed = false;
            updateLastMessage(text.split('[')[0]);
          }

          if(allowed){
            updateLastMessage(text);
          }

        }



      } finally {

        updateChatLocal(content, lastMessage.split('[')[0]);

        if(!allowed){
          updateOptions(lastMessage.split('[')[1].split(']')[0]);
        }
        reader.releaseLock();
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        return;
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading, addMessage, updateLastMessage, updateChatLocal, updateOptions, updateTyping]);


  useEffect(() => {
    const setChatHistory = async () => {
      axios.post('/api/chathistory', {clientId: "newUser"})
      .then((response) => {
        if(response.data.chatHistory){
          localStorage.setItem('chatHistory', JSON.stringify(response.data.chatHistory));
          localStorage.setItem('clientId', response.data.clientId);
          // setInitialChat([]);
          setIsLoading(false);
        }
      })
    }

    // if(!clientId){
    //   setIsLoading(true);
    //   setChatHistory();
    // }
    // setInitialChat(JSON.parse(localStorage.getItem('chatHistory')));


      const clientId = localStorage.getItem('clientId');
      if(!clientId){
        setIsLoading(true);
        setChatHistory();
      }
      setInitialChat(JSON.parse(localStorage.getItem('chatHistory')));
    

  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    options,
    initialChat
  };
};