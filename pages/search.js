import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import ComicHunt from '../components/comichunt';
import ComicTile from '../components/ComicTile';
import styles from '../styles/ComicTile.module.css';

const PAGE_SIZE = 50;

export default function Search() {
  const router = useRouter();
  const { q, page: pageQuery } = router.query;

  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const page = parseInt(pageQuery || '1', 10); // ComicVine search uses 1-indexing

  useEffect(() => {
    if (!q) return;

    const fetchComics = async () => {
      setLoading(true);
      setError(false);
      setNotFound(false);

      try {
        const res = await fetch(
          `/api/proxy?resource=search&query=${encodeURIComponent(q)}&limit=${PAGE_SIZE}&page=${page}`
        );
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
          setNotFound(true);
        } else {
          const filtered = data.results.filter(
            (comic) =>
              comic.issue_number &&
              comic.image?.original_url &&
              !comic.image.original_url.includes('blank') &&
              !/volume|tpb|hardcover|graphic/i.test(comic.name || '')
          );
          setResults(filtered);
          setTotalResults(data.number_of_total_results || 0);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [q, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.query.value.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}&page=1`);
    }
  };

  const handlePageChange = (newPage) => {
    router.push(`/search?q=${encodeURIComponent(q)}&page=${newPage}`);
  };

  const totalPages = Math.ceil(totalResults / PAGE_SIZE);

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

        {results.length > 0 && (
          <>
            <section id="srchtarget">
              <div className="grid-container">
                {results.map((item) => (
                  <ComicTile key={item.id} comic={item} />
                ))}
              </div>
            </section>

            <div style={{ textAlign: 'center', margin: '2rem' }}>
              <button onClick={() => handlePageChange(1)} disabled={page === 1}>
                ⏮ First
              </button>

              <button onClick={() => handlePageChange(Math.max(1, page - 1))} disabled={page === 1}>
                ◀ Prev
              </button>

              <span style={{ margin: '0 1rem' }}>
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
              >
                Next ▶
              </button>

              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={page >= totalPages}
              >
                Last ⏭
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
