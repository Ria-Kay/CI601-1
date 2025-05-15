import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../components/AuthContext'; // Adjust path if needed
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

const Header = () => {
  const router = useRouter();
  const { user } = useAuth(); // Real login check from context

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.query.value.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/'); // Optional: redirect after logout
  };

  return (
    <header>
      <div className="headerbox">
        <div className="navigation">
          <Link href="/">Home</Link>
          <Link href="/explore">Explore</Link>
          <Link href="/modeler">Comic Modeler</Link>

          {user && (
            <Link href="/usercomics">Your Comics</Link>
          )}

          {user ? (
            <>
              
              <Link href="/viewer">Comic Viewer</Link>
              <Link href="/profile">Profile</Link>

              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'blue' }}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/userlogin">Login / Signup</Link>
          )}
        </div>

        <div className="lookup">
          <div className="searchbar">
            <form id="form" onSubmit={handleSearch}>
              <input
                type="search"
                className="search"
                name="query"
                placeholder="Search for Comic Data..."
              />
              <button type="submit" className="search-button">
                <img src="/images/searchicon.svg" alt="Search" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
