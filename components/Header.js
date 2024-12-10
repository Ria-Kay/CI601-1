import Link from 'next/link';

const Header = ({ handleSearch = () => {} }) => {
    const userLoggedIn = false; // Replace with real login check

    return (
        <header>
            {/* Navigation links */}
            <div className="navigation">
                <Link href="/">Home</Link>
                <Link href="/explore">Explore</Link>
                <Link href="/useromics">Your Comics</Link>
                {userLoggedIn ? (
                    <>
                        <Link href="/profile">Profile</Link>
                        <Link href="/includes/logout-inc">Logout</Link>
                    </>
                ) : (
                    <>
                        <Link href="/login">Login</Link>
                        <Link href="/signup">Sign Up</Link>
                    </>
                )}
            </div>

            {/* Search bar */}
            <div className="searchbar">
            <form id="form" onSubmit={handleSearch}>
                    <input
                        type="search"
                        className="search"
                        name="query"
                        placeholder="Search for Comic Data..."
                    />
                    <button type="submit" className="search-button">
                        <img src="/images/search-svgrepo-com(1)" alt="Search" />
                    </button>
                </form>
            </div>
        </header>
    );
};

export default Header;
