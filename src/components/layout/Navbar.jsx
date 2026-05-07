import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingBag, FiHeart, FiUser, FiMenu, FiX, FiSearch, FiChevronDown } from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import Logo from '../common/Logo';

const WOMEN_LINKS = [
  { to: '/women-accessories', label: 'All Accessories' },
  { to: '/women-accessories?subcategory=earrings', label: 'Earrings' },
  { to: '/women-accessories?subcategory=nose-rings', label: 'Nose Rings' },
  { to: '/women-accessories?subcategory=rings', label: 'Rings' },
  { to: '/women-accessories?subcategory=bracelets', label: 'Bracelets' },
  { to: '/women-accessories?subcategory=minimal-jewellery', label: 'Minimal Jewellery' },
];

const GIRLS_LINKS = [
  { to: '/girls-jeans', label: 'Girls Jeans' },
  { to: '/girls-kurti', label: 'Girls Kurti' },
];

const MENS_LINKS = [
  { to: '/products', label: "Men's Jeans" },
  { to: '/mens-shirts', label: "Men's Shirts" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [womenOpen, setWomenOpen] = useState(false);
  const [girlsOpen, setGirlsOpen] = useState(false);
  const [mensOpen, setMensOpen] = useState(false);
  const dropdownRef = useRef(null);
  const womenRef = useRef(null);
  const girlsRef = useRef(null);
  const mensRef = useRef(null);

  const { user, token } = useSelector((s) => s.auth);
  const { items, guestItems } = useSelector((s) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allItems = token ? items : guestItems;
  const cartCount = allItems.reduce((acc, i) => acc + i.quantity, 0);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (womenRef.current && !womenRef.current.contains(e.target)) {
        setWomenOpen(false);
      }
      if (girlsRef.current && !girlsRef.current.contains(e.target)) {
        setGirlsOpen(false);
      }
      if (mensRef.current && !mensRef.current.contains(e.target)) {
        setMensOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo variant="dark" size="md" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Men's Dropdown */}
            <div className="relative" ref={mensRef}>
              <button onClick={() => setMensOpen(!mensOpen)}
                className="flex items-center gap-1 text-sm font-medium tracking-wider uppercase hover:text-accent transition-colors">
                Men
                <FiChevronDown size={14} className={`transition-transform ${mensOpen ? 'rotate-180' : ''}`} />
              </button>
              {mensOpen && (
                <div className="absolute left-0 top-8 w-44 bg-white border border-zinc-200 shadow-xl z-50">
                  {MENS_LINKS.map((link) => (
                    <Link key={link.to} to={link.to} onClick={() => setMensOpen(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-zinc-50 transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Jewellery Dropdown */}
            <div className="relative" ref={womenRef}>
              <button
                onClick={() => setWomenOpen(!womenOpen)}
                className="flex items-center gap-1 text-sm font-medium tracking-wider uppercase hover:text-accent transition-colors"
              >
                Jewellery
                <FiChevronDown size={14} className={`transition-transform ${womenOpen ? 'rotate-180' : ''}`} />
              </button>
              {womenOpen && (
                <div className="absolute left-0 top-8 w-48 bg-white border border-zinc-200 shadow-xl z-50">
                  {WOMEN_LINKS.map((link) => (
                    <Link key={link.to} to={link.to} onClick={() => setWomenOpen(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-zinc-50 transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Girls Dropdown */}
            <div className="relative" ref={girlsRef}>
              <button
                onClick={() => setGirlsOpen(!girlsOpen)}
                className="flex items-center gap-1 text-sm font-medium tracking-wider uppercase hover:text-accent transition-colors"
              >
                Girls
                <FiChevronDown size={14} className={`transition-transform ${girlsOpen ? 'rotate-180' : ''}`} />
              </button>
              {girlsOpen && (
                <div className="absolute left-0 top-8 w-44 bg-white border border-zinc-200 shadow-xl z-50">
                  {GIRLS_LINKS.map((link) => (
                    <Link key={link.to} to={link.to} onClick={() => setGirlsOpen(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-zinc-50 transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-1 hover:text-accent transition-colors">
              <FiSearch size={20} />
            </button>

            <Link to="/wishlist" className="p-1 hover:text-accent transition-colors">
              <FiHeart size={20} />
            </Link>

            <Link to="/cart" className="p-1 hover:text-accent transition-colors relative">
              <FiShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 p-1 hover:text-accent transition-colors"
                >
                  <FiUser size={20} />
                  <FiChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-10 w-48 bg-white border border-zinc-200 shadow-xl z-50">
                    <div className="px-4 py-2 border-b border-zinc-100">
                      <p className="text-xs text-zinc-500">Signed in as</p>
                      <p className="text-sm font-medium truncate">{user.name}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-zinc-50 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-zinc-50 transition-colors"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-zinc-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-1 hover:text-accent transition-colors">
                <FiUser size={20} />
              </Link>
            )}

            <button className="md:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-3">
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jeans, fits..."
              className="w-full border-b border-zinc-300 py-2 text-sm focus:outline-none focus:border-zinc-900"
            />
          </form>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-3">
            <Link to="/products" onClick={() => setMenuOpen(false)} className="text-sm font-medium tracking-wider uppercase">Shop All</Link>
            <Link to="/mens-shirts" onClick={() => setMenuOpen(false)} className="text-sm font-medium tracking-wider uppercase">Men's Shirts</Link>
            <Link to="/products?fitType=straight" onClick={() => setMenuOpen(false)} className="text-sm font-medium tracking-wider uppercase">Straight Fit</Link>
            <Link to="/products?fitType=baggy" onClick={() => setMenuOpen(false)} className="text-sm font-medium tracking-wider uppercase">Baggy Fit</Link>
            {/* Jewellery mobile links */}
            <p className="text-xs text-zinc-400 tracking-widest uppercase pt-1">Jewellery</p>
            {WOMEN_LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="text-sm font-medium tracking-wider uppercase pl-2">
                {link.label}
              </Link>
            ))}
            <p className="text-xs text-zinc-400 tracking-widest uppercase pt-1">Girls</p>
            {GIRLS_LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)} className="text-sm font-medium tracking-wider uppercase pl-2">
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-sm font-medium tracking-wider uppercase">My Orders</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-sm font-medium tracking-wider uppercase">Profile</Link>
                <button onClick={handleLogout} className="text-left text-sm font-medium tracking-wider uppercase text-red-600">Logout</button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
