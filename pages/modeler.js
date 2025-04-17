import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useState } from 'react';
import ComicTile3D from '../components/ComicTile3D';


export default function ModelerPage() {
  const [comics, setComics] = useState([]);

  useEffect(() => {
    // fetch or pass in your comics array
    const savedComics = JSON.parse(localStorage.getItem('myComics')) || [];
    setComics(savedComics);
  }, []);

  const spacingX = 14;
  const spacingY = 22;
  const cols = 5;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 60], fov: 60 }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />

        {comics.map((comic, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          const pos = { x: col * spacingX, y: -row * spacingY, z: 0 };
          return <ComicTile3D key={comic.id} comic={comic} position={pos} />;
        })}
      </Canvas>
    </div>
  );
}
