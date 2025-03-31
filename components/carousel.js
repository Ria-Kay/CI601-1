import React from 'react';
import styles from './carousel.css'; // keep the styling doe all the carosels the same when i call them

export default function Carousel({ children }) {
  return (
    <div className={styles.carousel}>
      <div className={styles.carouselTrack}>
        {children}
      </div>
    </div>
  );
}
