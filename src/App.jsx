import './App.css';
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import TopBar from './components/TopBar/TopBar.jsx';
import Footer from './components/Footer/Footer.jsx';
import Seo from './components/Seo/Seo.jsx';
import { initAnalytics } from './services/analytics.js';

const Home = lazy(() => import('./pages/Home/Home.jsx'));
const Blog = lazy(() => import('./pages/Blog/Blog.jsx'));
const BlogArticle = lazy(() => import('./pages/Blog/BlogArticle.jsx'));
const Privacy = lazy(() => import('./pages/Legal/Privacy.jsx'));
const Impressum = lazy(() => import('./pages/Legal/Impressum.jsx'));
const SecuGuard = lazy(() => import('./pages/SecuGuard/SecuGuard.jsx'));
const Winterdienst = lazy(() => import('./pages/Winterdienst/Winterdienst.jsx'));
const BackToTop = lazy(() => import('./components/Widgets/BackToTop.jsx'));
const CookieConsent = lazy(() => import('./components/Widgets/CookieConsent.jsx'));
const ChatWidget = lazy(() => import('./components/Widgets/ChatWidget.jsx'));

const ScrollReset = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if (navType === 'PUSH') {
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }));
    }
  }, [pathname, navType]);

  return null;
};

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'auto';
}

export default function App() {
  const [loadWidgets, setLoadWidgets] = useState(false);

  useEffect(() => {
    const load = () => setLoadWidgets(true);

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => {
        initAnalytics();
        load();
      }, { timeout: 2600 });
      return () => window.cancelIdleCallback(id);
    }

    const timeout = window.setTimeout(() => {
      initAnalytics();
      load();
    }, 1600);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div className="app">
      <Seo />
      <ScrollReset />
      <TopBar />
      <Navbar />
      <Suspense fallback={null}>
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
      </Suspense>
      <Footer />
      {loadWidgets ? (
        <Suspense fallback={null}>
          <CookieConsent />
          <ChatWidget />
          <BackToTop />
        </Suspense>
      ) : null}
    </div>
  );
}
