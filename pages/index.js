import ComicHunt from '../components/comichunt';
import Header from '../components/Header';

export default function Home() {
  return (
    <div>
      <ComicHunt />
      <Header /> {/* fix search not opening the new page instead of opening inside the inded */}

      <main>
        <div className="home-intro">
          <h1>Welcome to ComicHunt 🦸‍♀️</h1>
          <p>Search for comics by name, volume, or issue number!</p>
        </div>
      </main>
    </div>
  );
}
