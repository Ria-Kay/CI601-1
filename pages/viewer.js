import { useState } from 'react';
import BarChart from '../components/barchart';
import ComicHunt from '../components/comichunt';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ViewerPage() {
  const [savedAs, setSavedAs] = useState('all');
  const [groupBy, setGroupBy] = useState('year');

  const filterProps = {
    ...(savedAs !== 'all' && { field: 'savedAs', value: savedAs }),
    groupBy,
  };

  return (
    <main>
      <div>
      <ComicHunt />
      <Header />
      </div>
      <h1>Comic Viewer</h1>

      {/* Filter dropdowns */}
   
        <div className='variables'>
        <select onChange={(e) => setSavedAs(e.target.value)} value={savedAs}>
          <option value="all">All Comics</option>
          <option value="favourite">Favourites</option>
          <option value="read">Read</option>
          <option value="to-read">To-Read</option>
        </select>

        <select onChange={(e) => setGroupBy(e.target.value)} value={groupBy}>
          <option value="year">Group by Year</option>
          <option value="series">Group by Series</option>
          <option value="author">Group by Author</option>
        </select>
      </div>

      {/* Chart */}
      <BarChart filterBy={filterProps} />

    

    </main>
  );
}
