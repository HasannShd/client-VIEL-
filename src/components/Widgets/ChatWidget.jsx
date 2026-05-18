import './Widgets.css';
import { MessageCircle, Send, X } from 'lucide-react';
import React, { useState } from 'react';
import { useLanguage } from '../../context/languageStore.js';
import { sendSubmission } from '../../services/submissionService.js';

const whatsappNumber = (import.meta.env.VITE_CHAT_WHATSAPP_NUMBER || '').replace(/\D/g, '');

export default function ChatWidget() {
  const { copy, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: copy.widgets.chatHello }
  ]);

  const send = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || sending) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { role: 'user', text: trimmedMessage }
    ]);
    setMessage('');
    setSending(true);

    try {
      if (whatsappNumber) {
        const body = `${copy.widgets.chatOwnerIntro}\n\n${trimmedMessage}`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(body)}`, '_blank', 'noopener,noreferrer');
      } else {
        await sendSubmission({
          type: 'chat',
          language,
          subject: copy.widgets.chatEmailSubject,
          data: {
            message: trimmedMessage
          }
        });
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: 'bot',
          text: whatsappNumber ? copy.widgets.chatWhatsAppConfirm : copy.widgets.chatEmailConfirm
        }
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: 'bot',
          text: error.message || copy.widgets.chatEmailConfirm
        }
      ]);
    } finally {
      setSending(false);
    }
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
            <button type="button" onClick={send} disabled={sending} aria-label={copy.widgets.chatSend}><Send size={18} /></button>
          </div>
        </div>
      ) : null}
      <button className="chat-widget__button" type="button" onClick={() => setOpen((value) => !value)} aria-label={copy.widgets.chatOpen}>
        <MessageCircle size={26} />
      </button>
    </div>
  );
}
