import { useState } from 'react';
import Image from 'next/image';
import Header from '../components/Header';
import PieChartVisualizer from '../components/piechart';
import ComicHunt from '../components/comichunt';
import ComicTile from '../components/ComicTile';
import ComicTilePopup from '../components/comictilepop';
import LatestComics from '../components/latestcomics';
import Footer from '../components/Footer';
import PublisherCarousel from '../components/publishercarousel';
import Spotlight from '../components/writerspotlight';

function ExplorePage() {
    return(

    <div>
        <ComicHunt />
         <Header />

        <main>
        <section className="home-section intro-section">
           <h1 className='exploreH'>
            Explore Our Comics
           </h1>

           </section>

             <section className="home-section left">
                     <div className="sectionBox">
                       
                       <div className="section-text">
                        
                         <LatestComics />
                       </div>
                     </div>
                   </section>



                   <section className="home-section right">
                     <div className="sectionBox">
                       
                       <div className="section-text">
                        <h1> Spotlights On!</h1>
                        <h3>
                          This weeks featured authour is...
                        </h3>
                        <div>
                          <Spotlight />
                        </div>

                         
                       </div>
                     </div>
                   </section>

                   <section className="home-section left">
                     <div className="sectionBox">
                       
                       <div className="section-text">
                        <h1>
                          Search Publishers
                        </h1>
                        <div>
                          <PublisherCarousel />
                        </div>


                       </div>
                     </div>
                   </section>

                   

            <div>
              <Footer />
            </div>
       

        </main>


    </div>

    );
}

export default ExplorePage;
