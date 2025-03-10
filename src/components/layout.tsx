import React from 'react';
import Starfield from './starfield';
import './layout.css'; // Optional, for additional styling

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Starfield />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Layout;