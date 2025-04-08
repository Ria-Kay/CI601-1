import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function SaveButton({ comic, status }) {
  const user = auth.currentUser;

  const handleSave = async () => {
    if (!user) return alert('Please log in to save comics.');

    const docRef = doc(db, 'users', user.uid, 'savedComics', comic.id.toString());

    await setDoc(docRef, {
      ...comic,
      savedAs: status,
      savedAt: new Date().toISOString()
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
