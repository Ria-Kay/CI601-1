import { useState, useEffect, useRef } from 'react';
import { TextureLoader } from 'three';
import ComicTile from './ComicTile';
import { Html } from '@react-three/drei';

export default function ComicTile3D({ comic, position }) {
  const [showUI, setShowUI] = useState(false);
  const [texture, setTexture] = useState(null);
  const meshRef = useRef();

  const imageUrl =
    comic.firebaseImage ||
    comic.preferredCover ||
    comic.image?.original_url ||
    comic.image?.small_url ||
    comic.image?.thumb_url;

  useEffect(() => {
    const fetchTexture = async () => {
      if (!imageUrl || !imageUrl.startsWith('http')) return;

      try {
        const proxyUrl = `/api/proxy-image?imageUrl=${encodeURIComponent(imageUrl)}`;
        const response = await fetch(proxyUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const loader = new TextureLoader();
        const loadedTexture = await loader.loadAsync(blobUrl);
        setTexture(loadedTexture);
      } catch (err) {
        console.error('Failed to load texture:', err);
      }
    };

    fetchTexture();
  }, [imageUrl]);

  if (!texture) return null;

  return (
    <>
      <mesh
        ref={meshRef}
        position={[position.x, position.y, position.z]}
        onClick={(e) => {
          e.stopPropagation();
          setShowUI((prev) => !prev);
        }}
      >
        <planeGeometry args={[12, 18]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {showUI && (
        <Html
          position={[position.x, position.y + 10, position.z + 1]}
          zIndexRange={[10, 0]}
          distanceFactor={20}
          transform
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '10px',
              padding: '1rem',
              boxShadow: '0 0 20px rgba(0,0,0,0.5)',
              maxWidth: '300px',
            }}
          >
            <ComicTile comic={comic} />
            <button
              onClick={() => setShowUI(false)}
              style={{
                marginTop: '0.5rem',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              ✖ Close
            </button>
          </div>
        </Html>
      )}
    </>
  );
}
