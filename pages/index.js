import ComicHunt from '../components/comichunt';
import Header from '../components/Header';

export default function Home() {
  return (
    <div>
      <ComicHunt />
      <Header /> {/* fix search not opening the new page instead of opening inside the inded */}

      <main>
        <div className="home-intro">
          <h1>Welcome to ComicHunt </h1>
          <p>A Visual Archive For All Your Comcis</p>
        </div>

        <div className= "new-issues">
            <h1> This weeks new issues</h1>

        </div>
      </main>
    </div>
  );
}
