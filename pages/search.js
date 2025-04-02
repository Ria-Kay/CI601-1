import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import ComicHunt from '../components/comichunt';
import ComicTile from '../components/comictile'; // Uppercase C is critical in imports!
import styles from '../styles/ComicTile.module.css';

export default function Search() {
    const router = useRouter();
    const { q } = router.query;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!q) return;

        const fetchComics = async () => {
            setLoading(true);
            setError(false);
            setNotFound(false);
            setResults([]);

            try {
                const response = await fetch(`/api/proxy?query=${encodeURIComponent(q)}&limit=80`);
                if (!response.ok) throw new Error('Failed to fetch');
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

        fetchComics();
    }, [q]);

    const handleSearch = (e) => {
        e.preventDefault();
        const query = e.target.query.value.trim();
        if (query) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div>
            <ComicHunt />
            <Header handleSearch={handleSearch} />

            <main>
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
                            <ComicTile key={index} comic={item} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
