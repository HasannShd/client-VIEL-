import './Blog.css';
import './Blog.desktop.css';
import './Blog.mobile.css';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useLanguage } from '../../context/languageStore.js';

export default function Blog() {
  const { copy } = useLanguage();
  const blog = copy.blog;

  return (
    <main className="blog-page">
      <section className="blog-hero">
        <div className="container">
          <span className="section-eyebrow">{blog.heroEyebrow}</span>
          <h1>{blog.heroTitle}</h1>
          <p>{blog.heroText}</p>
        </div>
      </section>
      <section className="blog-list">
        <div className="container blog-list__grid">
          {blog.posts.map((post) => (
            <a href={`/blog/${post.id}`} className="blog-card" key={post.id}>
              <img src={post.image} alt={post.title} />
              <div>
                <span>{post.category}</span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <small>{post.date} · {post.author}</small>
                <strong>{blog.readMore} <ArrowRight size={16} /></strong>
              </div>
            </a>
          ))}
        </div>
      </section>
      <section className="blog-cta">
        <div className="container">
          <h2>{blog.ctaTitle}</h2>
          <p>{blog.ctaText}</p>
          <a href="/#kontakt" className="viel-button">{blog.ctaButton}</a>
        </div>
      </section>
    </main>
  );
}
