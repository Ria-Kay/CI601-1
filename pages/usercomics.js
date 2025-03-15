import { useState } from 'react';
// import Header from '../components/Header';
// import global.css from (fix this import)

function UserComicsPage() {
  const [comics, setComics] = useState([]);

  return (
    <div>
      <h1>User Comics</h1>
      {comics.length > 0 ? (
        comics.map((comic, index) => <p key={index}>{comic}</p>)
      ) : (
        <p>No comics found.</p>
      )}
    </div>
  );
}

export default UserComicsPage;
export async function getServerSideProps() {
  return { props: {} };
}