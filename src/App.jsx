import './App.css';
import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigationType } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import TopBar from './components/TopBar/TopBar.jsx';
import Footer from './components/Footer/Footer.jsx';
import BackToTop from './components/Widgets/BackToTop.jsx';
import CookieConsent from './components/Widgets/CookieConsent.jsx';
import ChatWidget from './components/Widgets/ChatWidget.jsx';
import Seo from './components/Seo/Seo.jsx';

const Home = lazy(() => import('./pages/Home/Home.jsx'));
const Blog = lazy(() => import('./pages/Blog/Blog.jsx'));
const BlogArticle = lazy(() => import('./pages/Blog/BlogArticle.jsx'));
const Privacy = lazy(() => import('./pages/Legal/Privacy.jsx'));
const Impressum = lazy(() => import('./pages/Legal/Impressum.jsx'));
const SecuGuard = lazy(() => import('./pages/SecuGuard/SecuGuard.jsx'));
const Winterdienst = lazy(() => import('./pages/Winterdienst/Winterdienst.jsx'));

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
      <CookieConsent />
      <ChatWidget />
      <BackToTop />
    </div>
  );
}
