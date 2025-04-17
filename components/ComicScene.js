// ComicScene.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ComicUniverse from './ComicUniverse';

export default function ComicScene({ comics }) {
  return (
    <Canvas camera={{ position: [0, 0, 150], fov: 75 }}>
      <ambientLight />
      <pointLight position={[100, 100, 100]} />
      <OrbitControls enablePan enableZoom enableRotate />
      <ComicUniverse comics={comics} />
    </Canvas>
  );
}
