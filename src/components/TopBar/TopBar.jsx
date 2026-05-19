import './TopBar.css';
import { Linkedin, Mail, Phone } from 'lucide-react';
import React from 'react';

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar__inner">
        <div className="top-bar__contact">
          <a href="tel:03021467832" className="top-bar__item">
            <Phone size={13} />
            030 21467832
          </a>
          <a href="mailto:Info@viel-gs.de" className="top-bar__item">
            <Mail size={13} />
            Info@viel-gs.de
          </a>
        </div>
        <div className="top-bar__social">
          <a href="#" className="top-bar__item" aria-label="LinkedIn">
            <Linkedin size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
