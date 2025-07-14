import React, { useState } from 'react';

import { Gadget } from '@/components/gadget/Gadget.component';
import { GadgetTypes } from '@/components/gadget/Gadget.interface';
import { ChatbotService } from '@/services/Chatbot.service';
import styles from './Chatbot.module.scss';

export default function Chatbot() {
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [userId] = useState(() => 'user_123'); // Replace with actual user ID

  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      const response = await ChatbotService.sendMessage({
        input: message,
        sessionId,
        userId,
      });
      return response;
    } catch (error) {
      throw new Error('Failed to send message');
    }
  };

  return (
    <section className={styles.section}>
      <h3 className={styles.section__title}>Different Health</h3>

      <div className={styles.content}>
        <Gadget 
          type={GadgetTypes.chatbot}
          data={{ 
            title: "Health Assistant",
            description: "Ask me anything about your health and wellness",
            onSendMessage: handleSendMessage
          }}
          size={undefined}
          gripSize={2}
        />
      </div>
    </section>
  );
}
