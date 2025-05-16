import React from 'react';

export default function Footer() {
  return (
    <footer className="footer" style={{ textAlign: 'center', padding: '2rem', fontSize: '0.9rem' }}>
      <p>© {new Date().getFullYear()} ComicHunt. All rights reserved.</p>

      <p>
        Built using the <a href="https://comicvine.gamespot.com/api/" target="_blank" rel="noopener noreferrer">ComicVine API</a> for comic metadata.
      </p>

      <p>
        Developed by Ria Kumar as part of a final-year university project.
      </p>

      <p>
        All images and materials are used for educational purposes only.
      </p>

      <div style={{ marginTop: '1rem' }}>
        <strong>Credits:</strong>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li>Icons from <a href="https://icons8.com" target="_blank" rel="noopener noreferrer">Icons8</a></li>
          <li>Agatha Harkness images © Marvel Studios, 2024</li>
          <li>Nightwing images © Detective Comics, 2025</li>
        </ul>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <strong>Resources:</strong>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li>
            <a href="https://hype4.academy/tools/glassmorphism-generator" target="_blank" rel="noopener noreferrer">
              Glassmorphism Generator
            </a>
          </li>
          <li>
            <a href="https://github.com/vasturiano/3d-force-graph" target="_blank" rel="noopener noreferrer">
              3D Force Graph by Vasturiano
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
