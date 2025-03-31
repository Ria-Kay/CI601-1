import Link from 'next/link';
import { useRouter } from 'next/router';
//fixing the searching comeing up in index and ocvering the home design
const Header = () => {
    const router = useRouter();
    const userLoggedIn = false; // Replace with real login check

    const handleSearch = (e) => {
        e.preventDefault();
        const query = e.target.query.value.trim();
        if (query) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <header>
            <div className='headerbox'>
                <div className="navigation">
                    <Link href="/home">Home</Link>
                    <Link href="/explore">Explore</Link>
                    <Link href="/usercomics">Your Comics</Link>
                    {userLoggedIn ? (
                        <>
                            <Link href="/profile">Profile</Link>
                            <Link href="/includes/logout-inc">Logout</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/login">Login</Link>
                            <Link href="/userlogin">Sign Up</Link>
                        </>
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
