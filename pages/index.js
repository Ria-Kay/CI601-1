import { useState } from 'react';
import Header from '../components/Header';
import ComicHunt from '../components/comichunt';
import ComicTile from '../components/comictile';

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
            const response = await fetch(`/api/proxy?query=${encodeURIComponent(query)}&limit=80`);
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
                            <comictile key={index} comic={item} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export async function getServerSideProps() {
    return { props: {} };
}
