import './Legal.css';
import './Legal.desktop.css';
import './Legal.mobile.css';
import React from 'react';
import { useLanguage } from '../../context/languageStore.js';

export default function Privacy() {
  const { copy } = useLanguage();

  return (
    <main className="legal-page">
      <div className="container legal-page__inner">
        <h1>{copy.legal.privacyTitle}</h1>
        {copy.legal.sections.map(([title, text]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{text.split('\n').map((line) => <React.Fragment key={line}>{line}<br /></React.Fragment>)}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
