import ComicHunt from '../components/comichunt';
import Header from '../components/Header';
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <ComicHunt />
      <Header /> {/* fix search not opening the new page instead of opening inside the inded */}

      <main>
        <div className="home-intro">
          {/*this will allow for lazy loading so its not as slow when the api will run for issues too*/}
        <Image src="/images/comichunt.png" alt="ComicHunt logo" width={200} height={80} />
        <h1>Welcome to ComicHunt </h1>
          <p>A Visual Archive For All Your Comcis</p>
        </div>
        <div className= "issue-adv">
            <h1> Store your comics</h1>
            <h3> Our passion for comics drives us all!Log all your comics using our easy to use comic database, or help build our community by adding in your own issues!</h3>
            <h3> We understand that comic collecting is a real world hobby, so we’ve made it so that you can have a log representative of your real collection. Tag series’ into various different groups, marking what short or long boxes they're stored in, or even mark a pesky issue that you might have missed...</h3>
        </div>

        <div className= "new-issues">
            <h1> This weeks new issues</h1>

        </div>
      </main>
    </div>
  );
}
