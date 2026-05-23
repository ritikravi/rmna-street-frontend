import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';
import Logo from '../common/Logo';

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Logo variant="light" size="md" showTagline className="mb-4" />
          <p className="text-sm leading-relaxed">Premium men's streetwear. Crafted for the streets, built to last.</p>
          <div className="flex gap-4 mt-4">
            <a href="https://www.instagram.com/rmnastreet/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Follow us on Instagram"><FiInstagram size={18} /></a>
            <a href="#" className="hover:text-white transition-colors"><FiTwitter size={18} /></a>
            <a href="#" className="hover:text-white transition-colors"><FiFacebook size={18} /></a>
          </div>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link to="/products?fitType=straight" className="hover:text-white transition-colors">Straight Fit</Link></li>
            <li><Link to="/products?fitType=baggy" className="hover:text-white transition-colors">Baggy Fit</Link></li>
            <li><Link to="/products?featured=true" className="hover:text-white transition-colors">Featured</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/orders" className="hover:text-white transition-colors">Track Order</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
            <li><Link to="/feedback" className="hover:text-white transition-colors">Give Feedback</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>ritikravi7724@gmail.com</li>
            <li>nirmalrathore598@gmail.com</li>
            <li>harivanshimayank@gmail.com</li>
            <li>24 hrs open</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-800 py-4 text-center text-xs text-zinc-600">
        © 2026 RMNA Street. All rights reserved. | Built by Ritik, Mayank, Nirmal & Ankit
      </div>
    </footer>
  );
}
