import { useState } from 'react';
import Header from '../components/Header';
import ComicHunt from '../components/comichunt'; // Import the ComicHunt logo component :D

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const q = e.target.query.value.trim();

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
            const response = await fetch(`/api/proxy?query=${encodeURIComponent(query)}&limit=80`); // Fetch up to 80 results
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
            <ComicHunt />
            <Header handleSearch={handleSearch} />

            <main>
                <div id="imgselected" style={{ display: 'none' }}>
                    <button id="back">X</button>
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
                                {/* Display comic cover */}
                                {item.image?.small_url && (
                                    <img
                                        src={item.image.small_url}
                                        alt={
                                            item.name ||
                                            `${item.volume?.name || 'Unknown Series'} #${item.issue_number || 'Unknown'}`
                                        }
                                    />
                                )}

                                {/* Display fallback */}
                                <h2>
                                    <a
                                        href={item.site_detail_url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {item.name
                                            ? item.name
                                            : `${item.volume?.name || 'Unknown Series'} #${item.issue_number || 'Unknown'}`}
                                    </a>
                                </h2>

                                {/* Display description */}
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
