import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BannerMentionLegales from './BannerMentionLegales';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <BannerMentionLegales />
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;