import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function SaveButton({ comic, status }) {
  const user = auth.currentUser;

  const handleSave = async () => {
    if (!user) return alert('Please log in to save comics.');

    let firebaseImageUrl = comic.firebaseImage;
    const imageToUpload =
      comic.preferredCover ||
      comic.image?.original_url ||
      comic.image?.small_url ||
      comic.image?.thumb_url;

    if (!firebaseImageUrl && imageToUpload) {
      try {
        console.log(`📤 Uploading image via proxy for comic ID ${comic.id}`);

        // 👇👇👇 USE THE PROXY
        const proxyUrl = `/api/proxy-image?imageUrl=${encodeURIComponent(imageToUpload)}`;
        const res = await fetch(proxyUrl);

        if (!res.ok) {
          throw new Error(`Proxy fetch failed: ${res.status}`);
        }

        const blob = await res.blob();

        const storage = getStorage();
        const fileRef = ref(storage, `covers/${comic.id}.jpg`);
        await uploadBytes(fileRef, blob);

        firebaseImageUrl = await getDownloadURL(fileRef);
        console.log(`✅ Firebase image uploaded: ${firebaseImageUrl}`);
      } catch (err) {
        console.error(`🔥 Failed to upload image for comic ${comic.id}`, err);
      }
    }

    const docRef = doc(db, 'users', user.uid, 'savedComics', comic.id.toString());

    await setDoc(docRef, {
      ...comic,
      preferredCover: imageToUpload,
      firebaseImage: firebaseImageUrl || null,
      savedAs: status,
      savedAt: new Date().toISOString(),
    });

    alert(`Saved to ${status}`);
  };

  return (
    <button onClick={handleSave}>
      {status === 'favourite' && 'Favourite'}
      {status === 'read' && 'Read'}
      {status === 'to-read' && 'To-Read'}
    </button>
  );
}
