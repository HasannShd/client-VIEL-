import './Widgets.css';
import { MessageCircle, Send, X } from 'lucide-react';
import React, { useState } from 'react';
import { useLanguage } from '../../context/languageStore.js';

export default function ChatWidget() {
  const { copy } = useLanguage();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: copy.widgets.chatHello }
  ]);

  const send = () => {
    if (!message.trim()) return;
    const next = [...messages, { role: 'user', text: message.trim() }];
    setMessages(next);
    setMessage('');
    window.setTimeout(() => {
      setMessages([...next, { role: 'bot', text: copy.widgets.replies[Math.floor(Math.random() * copy.widgets.replies.length)] }]);
    }, 500);
  };

  return (
    <div className="chat-widget">
      {open ? (
        <div className="chat-widget__panel">
          <div className="chat-widget__header">
            <div>
              <h3>{copy.widgets.chatTitle}</h3>
              <p>{copy.widgets.chatSubtitle}</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label={copy.widgets.chatClose}><X size={18} /></button>
          </div>
          <div className="chat-widget__messages">
            {messages.map((item, index) => (
              <div className={`chat-widget__message ${item.role}`} key={`${item.role}-${index}`}>{item.text}</div>
            ))}
          </div>
          <div className="chat-widget__input">
            <input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && send()} placeholder={copy.widgets.chatPlaceholder} />
            <button type="button" onClick={send} aria-label={copy.widgets.chatSend}><Send size={18} /></button>
          </div>
        </div>
      ) : null}
      <button className="chat-widget__button" type="button" onClick={() => setOpen((value) => !value)} aria-label={copy.widgets.chatOpen}>
        <MessageCircle size={26} />
      </button>
    </div>
  );
}
