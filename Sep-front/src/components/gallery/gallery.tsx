"use client";

import { useEffect, useState } from "react";
import styles from "./gallery.module.css";
import Image from "next/image";
import type { ProductImage, ProductImages } from "lib/lib/objects";

const Gallery = ({ images }: { images: ProductImages }) => {
  const [mainPhotoIndex, setMainPhotoIndex] = useState<number>(0);


  const handleImageClick = () => {
    const zoomedContainer = document.getElementById('zoomed_photo_container');
    if(zoomedContainer?.classList.contains(`${styles.active}`)){
        zoomedContainer.classList.remove(`${styles.active}`);
    }else{
        zoomedContainer?.classList.add(`${styles.active}`);
    }
  };

  const handleNext = () => {
    setMainPhotoIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setMainPhotoIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };


  return (
    <div className={styles.gallery_container}>
      <Image
        src={images[mainPhotoIndex].url}
        alt="Gallery main photo"
        className={styles.gallery_main_photo}
        width={800}
        height={500}
        onClick={()=> handleImageClick()}
      />
      {images.length > 1 && (
        <div className={styles.gallery_other_photos_container}>
          {images.map((image: ProductImage, index) => (
            <Image
              key={index}
              src={image.url}
              className={`${styles.other_photos_photo} ${index === mainPhotoIndex? styles.active :""}`}
              alt={`Gallery photo ${index}`}
              width={100}
              height={100}
              onClick={() => setMainPhotoIndex(index)}
            />
          ))}
        </div>
      )}
      <div className={styles.zoomed_photo_container} id="zoomed_photo_container">
        {images.length === 1 ? (
          <Image
            src={images[0].url}
            alt={`Zoomed photo`}
            className={`${styles.zoomed_photo} ${styles.active}`}
            width={800}
            height={800}
            onClick={() => handleImageClick()}
          />
        ) : (
          <>
            <Image
              src="\images\icons\right-arrow-white.svg"
              alt="left arrow"
              width={50}
              height={75}
              style={{ transform: "rotate(180deg)" }}
              id={styles.zoomed_photo_left_arrow}
              onClick={()=> handlePrev()}
            />
            {images.map((image: ProductImage, index) => (
              <Image
                key={index}
                src={image.url}
                className={`${styles.zoomed_photo} ${index === mainPhotoIndex? styles.active :""}`}
                alt={`Zoomed photo ${index + 1}`}
                width={800}
                height={800}
                onClick={() => handleImageClick()}
              />
            ))}
            <Image
              src="\images\icons\right-arrow-white.svg"
              alt="left arrow"
              width={50}
              height={75}
              id={styles.zoomed_photo_right_arrow}
              onClick={()=> handleNext()}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;
