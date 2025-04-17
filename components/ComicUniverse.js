import { useMemo } from 'react';
import ComicTile3D from './ComicTile3D';

function sphericalPosition(i, total, radius = 80) {
  const phi = Math.acos(-1 + (2 * i) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;

  return {
    x: radius * Math.cos(theta) * Math.sin(phi),
    y: radius * Math.sin(theta) * Math.sin(phi),
    z: radius * Math.cos(phi),
  };
}

export default function ComicUniverse({ comics }) {
  const tiles = useMemo(() => {
    return comics.map((comic, i) => {
      const pos = sphericalPosition(i, comics.length);
      return { ...comic, position: pos };
    });
  }, [comics]);

  return (
    <>
      {tiles.map((comic) => (
        <ComicTile3D key={comic.id} comic={comic} position={comic.position} />
      ))}
    </>
  );
}
