import './Widgets.css';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/languageStore.js';

export default function CookieConsent() {
  const { copy } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem('viel-cookie-consent') !== 'accepted');
  }, []);

  if (!visible) {
    return null;
  }

  const accept = () => {
    localStorage.setItem('viel-cookie-consent', 'accepted');
    setVisible(false);
  };

  return (
    <div className="cookie-consent">
      <div>
        <h3>{copy.widgets.cookieTitle}</h3>
        <p>{copy.widgets.cookieText}</p>
        {details ? (
          <div className="cookie-consent__details">
            <label><input type="checkbox" checked readOnly /> {copy.widgets.necessary}</label>
            <label><input type="checkbox" /> Analytics</label>
            <label><input type="checkbox" /> Marketing</label>
          </div>
        ) : null}
      </div>
      <div className="cookie-consent__actions">
        <button type="button" onClick={() => setDetails((value) => !value)}>{copy.widgets.settings}</button>
        <button type="button" onClick={accept}>{copy.widgets.accept}</button>
      </div>
    </div>
  );
}
