import React from 'react';

import { Gadget } from '@/components/gadget/Gadget.component';
import styles from './Chatbot.module.scss';

export default function Chatbot() {
  return (
    <section className={styles.section}>
      <h3 className={styles.section__title}>Different Health</h3>

      <div className={styles.content}>
        <Gadget data={{ title: "Chatbot" }}>
          <div>{"TODO"}</div>
        </Gadget>
      </div>
    </section>
  );
}
