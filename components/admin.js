// pages/admin/retroUpload.jsx or in a tool component
import { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

export default function RetroUpload() {
  const [status, setStatus] = useState('');
  const [completed, setCompleted] = useState(0);

  const uploadCoverImage = async (imageUrl, comicId) => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();

      const storage = getStorage();
      const fileRef = ref(storage, `covers/${comicId}.jpg`);
      await uploadBytes(fileRef, blob);

      const downloadUrl = await getDownloadURL(fileRef);
      return downloadUrl;
    } catch (err) {
      console.error(`❌ Failed upload for ${comicId}:`, err);
      return null;
    }
  };

  const handleRunFix = async () => {
    const user = auth.currentUser;
    if (!user) {
      setStatus('❌ User not logged in');
      return;
    }

    setStatus('Fetching saved comics...');

    const colRef = collection(db, 'users', user.uid, 'savedComics');
    const snapshot = await getDocs(colRef);
    const docs = snapshot.docs;

    let updated = 0;

    for (const docSnap of docs) {
      const comic = docSnap.data();

      if (!comic.firebaseImage) {
        const imageUrl =
          comic.preferredCover ||
          comic.image?.original_url ||
          comic.image?.small_url ||
          comic.image?.thumb_url;

        if (!imageUrl) {
          console.warn(`⚠️ Skipping ${comic.id}: No valid image`);
          continue;
        }

        const firebaseUrl = await uploadCoverImage(imageUrl, comic.id);

        if (firebaseUrl) {
          await updateDoc(doc(db, 'users', user.uid, 'savedComics', comic.id.toString()), {
            firebaseImage: firebaseUrl
          });
          updated++;
          setCompleted(updated);
        }
      }
    }

    setStatus(`✅ Done! Updated ${updated} comic(s).`);
  };

  return (
    <div style={{ padding: '2em' }}>
      <h2>🛠 Retroactive Cover Upload Tool</h2>
      <button onClick={handleRunFix}>Run Fix</button>
      <p>{status}</p>
      {completed > 0 && <p>Updated {completed} cover images!</p>}
    </div>
  );
}
