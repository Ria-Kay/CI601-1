import UserForm from '../components/userforms';
import ComicHunt from '../components/comichunt';
import Header from '../components/Header';

export default function PeoplePage() {
  return (
    <div>
    <Header />

     
     <main>
      <div className='loginform'>
        <UserForm />
      </div>
    </main>
    </div>
  );
}
