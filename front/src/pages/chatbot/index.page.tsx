import React, { useState, useEffect } from 'react';

import { Gadget } from '@/components/gadget/Gadget.component';
import { GadgetTypes } from '@/components/gadget/Gadget.interface';
import { ChatbotService } from '@/services/Chatbot.service';
import { AuthService, User } from '@/services/Auth.service';
import styles from './Chatbot.module.scss';

export default function Chatbot() {
    const [sessionId] = useState(() => `session_${Date.now()}`);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authenticated = AuthService.isAuthenticated();
        setIsAuthenticated(authenticated);
        if (authenticated) {
            setUser(AuthService.getCurrentUser());
        }
    }, []);

    const handleLogin = async () => {
        const loggedUser = await AuthService.mockLogin();
        setUser(loggedUser);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        AuthService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const handleSendMessage = async (message: string): Promise<string> => {
        if (!user) throw new Error('Usuario no autenticado');

        try {
            const response = await ChatbotService.sendMessage({
                input: message,
                sessionId,
                userId: user._id,
            });
            return response;
        } catch (error) {
            throw new Error('Failed to send message');
        }
    };

    if (!isAuthenticated) {
        return (
            <section className={styles.section}>
                <h3 className={styles.section__title}>Different Health</h3>
                <div className={styles.content}>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <h4 style={{ color: 'white' }}>
                            Log In for use the chatbot
                        </h4>
                        <button
                            onClick={handleLogin}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '16px',
                            }}
                        >
                            Log In
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.section}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                }}
            >
                <h3 className={styles.section__title}>Different Health</h3>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                    }}
                >
                    <span style={{ color: 'white' }}>Hi, {user?.name}</span>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                <Gadget
                    type={GadgetTypes.chatbot}
                    data={{
                        title: 'Health Assistant',
                        description:
                            'Ask me anything about your health and wellness',
                        onSendMessage: handleSendMessage,
                    }}
                    size={undefined}
                    gripSize={2}
                />
            </div>
        </section>
    );
}
