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

    return (
        <div className="grid-item">
            {cover && (
                <img
                    src={cover}
                    alt={title}
                />
            )}

            <h2>
                <a href={site_detail_url || '#'} target="_blank" rel="noopener noreferrer">
                    {title}
                </a>
            </h2>

            {description ? (
                <div
                    className="description"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            ) : (
                <p>No description available.</p>
            )}

            {/* when i majke a llog in and and can save plzzzzzzzzzzzz */}
        </div>
    );
}