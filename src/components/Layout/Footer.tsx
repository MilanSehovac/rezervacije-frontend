import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white text-center p-4 mt-8">
      &copy; {new Date().getFullYear()} Rezervacije. Pokreće <Link to="https://www.codevolt.ba"  target='_blank'>CodeVolt</Link>
    </footer>
  );
};

export default Footer;