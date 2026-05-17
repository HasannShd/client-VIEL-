import './Blog.css';
import './Blog.desktop.css';
import './Blog.mobile.css';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../../context/languageStore.js';

export default function BlogArticle() {
  const { id } = useParams();
  const { copy } = useLanguage();
  const blog = copy.blog;
  const article = blog.articles[id];

  if (!article) {
    return (
      <main className="blog-page">
        <section className="blog-hero">
          <div className="container">
            <h1>{blog.notFound}</h1>
            <a href="/blog" className="viel-button">{blog.back}</a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="blog-page">
      <article className="article-page">
        <header className="article-page__hero">
          <img src={article.image} alt={article.title} />
          <div className="article-page__shade" />
          <div className="container">
            <a href="/blog" className="article-page__back"><ArrowLeft size={17} /> {blog.back}</a>
            <span className="section-eyebrow">{article.category}</span>
            <h1>{article.title}</h1>
            <p>{article.date} · {article.author}</p>
          </div>
        </header>
        <div className="container article-page__body">
          {article.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="article-page__cta">
            <h2>{blog.articleCtaTitle}</h2>
            <p>{blog.ctaText}</p>
            <a href="/#kontakt" className="viel-button dark">{blog.articleCtaButton}</a>
          </div>
        </div>
      </article>
    </main>
  );
}
