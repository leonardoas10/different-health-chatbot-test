import React, { useContext, useState, useRef, useEffect } from 'react';

import { useTranslation } from 'next-i18next';

import GadgetContext from '../../Gadget.context';
import { ChatbotMessage, ChatbotGadgetProps } from './ChatbotGadget.interface';
import styles from './ChatbotGadget.module.scss';

export const ChatbotGadget = ({ onSendMessage }: ChatbotGadgetProps) => {
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data, isDark } = useContext(GadgetContext);
  const { t } = useTranslation("common");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatbotMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await onSendMessage(inputValue);
      const assistantMessage: ChatbotMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatbotMessage = {
        id: (Date.now() + 1).toString(),
        content: t('chatbot.error', 'Sorry, something went wrong. Please try again.'),
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {data?.title && (
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h3
              className={`${styles.header__title} ${isDark ? styles.header__title___isBoxDark : ""}`}
            >
              {data.title}
            </h3>
          </div>
        </div>
      )}

      <div className={styles.chatContainer}>
        <div className={styles.messagesContainer}>
          {messages.length === 0 && (
            <div className={styles.emptyState}>
              <p className={styles.emptyState__text}>
                {t('chatbot.welcome', 'Hello! How can I help you with your health today?')}
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.role === 'user' 
                  ? styles.message___user 
                  : styles.message___assistant
              }`}
            >
              <div className={styles.message__content}>
                {message.content}
              </div>
              <div className={styles.message__timestamp}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className={`${styles.message} ${styles.message___assistant}`}>
              <div className={styles.message__content}>
                <div className={styles.loadingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputContainer}>
          <textarea
            className={styles.inputContainer__textarea}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chatbot.placeholder', 'Type your message...')}
            rows={1}
            disabled={isLoading}
          />
          <button
            className={`${styles.inputContainer__button} ${
              !inputValue.trim() || isLoading 
                ? styles.inputContainer__button___disabled 
                : ""
            }`}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
          >
            {t('chatbot.send', 'Send')}
          </button>
        </div>
      </div>
    </>
  );
};