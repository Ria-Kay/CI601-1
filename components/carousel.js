import React from 'react';
import styles from '../styles/carousel.module.css';
 // keep the styling doe all the carosels the same when i call them
 //mext will only allow componetn specificc css if its called module ??

export default function Carousel({ children }) {
  return (
    <div className={styles.carousel}>
      <div className={styles.carouselTrack}>
        {children}
      </div>
    </div>
  );
}
