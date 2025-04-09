import { useState } from 'react';
import Image from 'next/image';

import Header from '../components/Header';
import PieChartVisualizer from '../components/piechart';
import ComicHunt from '../components/comichunt';
import ComicTile from '../components/comictile';
import ComicTilePopup from '../components/comictilepop';
import LatestComics from '../components/latestcomics';


function ExplorePage() {
    return(

    <div>
        <ComicHunt />
         <Header />

        <main>
        <section className="home-section intro-section">
           <h1 className='exploreH'>
            Welcome to the Explore Page
           </h1>

           </section>

             <section className="home-section left">
                     <div className="sectionBox">
                       
                       <div className="section-text">
                         <h1>View our lates comics!</h1>
                         <LatestComics />
                       </div>
                     </div>
                   </section>



            
       

        </main>


    </div>

    );
}

export default ExplorePage;
