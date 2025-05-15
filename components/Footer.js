import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} ComicHunt. All rights reserved.</p>
      <p>
        Built with ComicVine API, to source all comic metadata. https://comicvine.gamespot.com/api/
      </p>
      <p>
        Built By Ria Kumar
      </p>
      <p>
        Icons from Icons8, Agatha Harkness character images sourced from Marvel Studios, 2024.
      </p>
      <p>
        Nightwing character images sourced from Detective Comics, 2025.
      </p>
      <P>
        Comic hunt was built as a part of this students final year project, all materials used are used for the purpose of eduction only.
      </P>

      <p>
        https://hype4.academy/tools/glassmorphism-generator
        https://github.com/vasturiano/3d-force-graph?tab=MIT-1-ov-file
      </p>

    </footer>
  );
}
