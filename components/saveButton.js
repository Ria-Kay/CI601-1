import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function SaveButton({ comic, status }) {
  const user = auth.currentUser;

  const handleSave = async () => {
    if (!user) return alert('Please log in to save comics.');

    // fethc detail
    let detailedData = {};
    try {
      const detailUrl = comic.api_detail_url;
      const res = await fetch(`/api/proxy?api_detail_url=${encodeURIComponent(detailUrl)}`);
      const data = await res.json();
      detailedData = data.results || {};
    } catch (err) {
      console.error("⚠️ Failed to fetch detailed comic info:", err);
    }

    // fetch publisher
    let publisher = "";
    try {
      if (detailedData.volume?.api_detail_url) {
        const volRes = await fetch(`/api/proxy?api_detail_url=${encodeURIComponent(detailedData.volume.api_detail_url)}`);
        const volData = await volRes.json();
        publisher = volData.results?.publisher?.name || "";
      }
    } catch (err) {
      console.warn("📦 Failed to fetch volume publisher:", err);
    }

    // get credits
    const characters = detailedData.character_credits?.map((char) => char.name) || [];
    const authors = detailedData.person_credits
      ?.filter((p) => /writer|author/i.test(p.role || ""))
      .map((p) => p.name) || [];

    // send image to Firebase if needed
    let firebaseImageUrl = comic.firebaseImage;
    const imageToUpload =
      comic.preferredCover ||
      comic.image?.original_url ||
      comic.image?.small_url ||
      comic.image?.thumb_url;

    if (!firebaseImageUrl && imageToUpload) {
      try {
        const proxyUrl = `/api/proxy-image?imageUrl=${encodeURIComponent(imageToUpload)}`;
        const res = await fetch(proxyUrl);
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
      publisher: publisher || comic.publisher || "",
      characters,
      authors,
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
