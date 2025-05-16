import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const Header = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.query.value.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setMenuOpen(false); // Close menu after search
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header>
      <div className="headerbox">
        <div className="mobileToggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <nav className={`navigation ${menuOpen ? 'open' : ''}`}>
          <Link href="/">Home</Link>
          <Link href="/explore">Explore</Link>
          <Link href="/modeler">Comic Modeler</Link>
          {user && <Link href="/viewer">Comic Viewer</Link>}

          {user ? (
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'blue' }}
            >
              Logout
            </button>
          ) : (
            <Link href="/userlogin">Login / Signup</Link>
          )}
        </nav>

        <div className="lookup">
          <form id="form" onSubmit={handleSearch} className="searchbar">
            <input type="search" name="query" placeholder="Search for Comic Data..." />
            <button type="submit" className="search-button">
              <img src="/images/searchicon.svg" alt="Search" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
