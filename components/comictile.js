import styles from '../styles/ComicTile.module.css';

export default function ComicTile({ comic }) {
    const {
        image,
        name,
        volume,
        issue_number,
        site_detail_url,
        description
    } = comic;

    const title = name || `${volume?.name || 'Unknown'} #${issue_number || 'Unknown'}`;
    const cover = image?.small_url;
    const date = comic.cover_date || 'Unknown';

    const handleSave = () => {
        alert(`Comic saved: ${title}`); // need to add in an acutal sace soon, connect to DB
    };

    return (
        <div className={styles.tile}>
            {cover && (
                <img
                    className={styles.cover}
                    src={cover}
                    alt={title}
                />
            )}

            <div className={styles.preview}>
                <div className={styles.info}>
                    <h3>{title}</h3>
                    <p>Issue #{issue_number || '?'}</p>
                    <p>{date}</p>
                    <a
                        href={site_detail_url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        View on ComicVine
                    </a>
                </div>
                <button className={styles.saveBtn} onClick={handleSave}>
                    Save 📥
                </button>
            </div>
        </div>
    );
}
