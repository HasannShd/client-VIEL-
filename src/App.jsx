import './App.css';
import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx';
import BackToTop from './components/Widgets/BackToTop.jsx';
import CookieConsent from './components/Widgets/CookieConsent.jsx';
import ChatWidget from './components/Widgets/ChatWidget.jsx';
import Home from './pages/Home/Home.jsx';
import Blog from './pages/Blog/Blog.jsx';
import BlogArticle from './pages/Blog/BlogArticle.jsx';
import Privacy from './pages/Legal/Privacy.jsx';
import Impressum from './pages/Legal/Impressum.jsx';
import SecuGuard from './pages/SecuGuard/SecuGuard.jsx';
import Winterdienst from './pages/Winterdienst/Winterdienst.jsx';

const ScrollReset = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }));
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <div className="app">
      <ScrollReset />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogArticle />} />
        <Route path="/winterdienst" element={<Winterdienst />} />
        <Route path="/secuguard" element={<SecuGuard />} />
        <Route path="/datenschutz" element={<Privacy />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
      <CookieConsent />
      <ChatWidget />
      <BackToTop />
    </div>
  );
}
