import UserForm from '../components/userforms';
import ComicHunt from '../components/comichunt';
import Header from '../components/Header';
import RetroUpload from '../components/admin';


export default function AdminPage() {
  return (
    <div>
    <Header />

     
     <main>
      <div >
        <RetroUpload/>
      </div>
    </main>
    </div>
  );
}
