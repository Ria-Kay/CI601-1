import { useState } from 'react';
import Header from '../components/Header';
import PieChartVisualizer from '../components/piechart';


function VisualiserPage() {
    return(

    <div>
         <Header />

        <main>
           <h1 style={{paddingTop:"3em"}}>
            Welcome to the Basic Satistics Visualiser Page! :D
           </h1>
           <div>
                <PieChartVisualizer />
            </div>



        </main>


    </div>

    );
}

export default VisualiserPage;