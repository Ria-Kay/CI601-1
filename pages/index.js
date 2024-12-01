import { useState } from 'react';

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const query = e.target.query.value.trim();

        setLoading(true);
        setError(false);
        setNotFound(false);
        setResults([]);

        if (!query) {
            setLoading(false);
            setNotFound(true);
            return;
        }

        try {
            const response = await fetch(`/api/proxy?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            if (!data.results || data.results.length === 0) {
                setNotFound(true);
            } else {
                setResults(data.results);
            }
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <header>
                <h1>Search for Comics</h1>
            </header>

            <main>
                <div id="imgselected" style={{ display: 'none' }}>
                    <button id="back">X</button>
                </div>

                <div className="searchbar">
                    <form id="form" onSubmit={handleSearch}>
                        <input
                            type="search"
                            className="search"
                            name="query"
                            placeholder="Search for Comic Data..."
                        />
                        <input
                            type="submit"
                            className="submit"
                            id="submit"
                            value="Search"
                        />
                    </form>
                </div>

                {loading && (
                    <div id="loading">
                        <img src="/images/Ellipsis-1.3s-248px.gif" alt="loading" />
                    </div>
                )}

                {notFound && (
                    <div id="nofounderror">
                        <img src="/images/200w.jpg" alt="not found" />
                        <h1>There was nothing found.</h1>
                    </div>
                )}

                {error && (
                    <div id="error">
                        <img src="/images/200w.jpg" alt="error" />
                        <h1>There was a technical error.</h1>
                    </div>
                )}

                <section id="srchtarget">
                    <div className="grid-container">
                        {results.map((item, index) => (
                            <div key={index} className="grid-item">
                                {item.image?.small_url && (
                                    <img
                                        src={item.image.small_url}
                                        alt={item.name || 'Comic Image'}
                                    />
                                )}
                                <h2>{item.name || 'Unknown Title'}</h2>
                                {item.description ? (
                                    <div
                                        className="description"
                                        dangerouslySetInnerHTML={{ __html: item.description }}
                                    ></div>
                                ) : (
                                    <p>No description available.</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
