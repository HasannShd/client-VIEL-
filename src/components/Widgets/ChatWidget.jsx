import './Widgets.css';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/languageStore.js';

const whatsappNumber = (import.meta.env.VITE_CHAT_WHATSAPP_NUMBER || '4917632452623').replace(/\D/g, '');

export default function ChatWidget() {
  const { copy } = useLanguage();

  return (
    <div className="chat-widget">
      <a
        className="chat-widget__button"
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={copy.widgets.chatOpen}
      >
        <MessageCircle size={26} />
      </a>
    </div>
  );
}
