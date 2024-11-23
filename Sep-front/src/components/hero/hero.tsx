"use client";

import Link from "next/link";
import styles from "./hero.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";

const Hero = () => {
  const slideCount = 5;
  const ctaLinkList = [
    `/kategorije/${encodeURIComponent('najlonske kese')}`, 
    `/kategorije/${encodeURIComponent('plastična ambalaža')}`, 
    `/kategorije/${encodeURIComponent('stiropor ambalaža')}`, 
    `/kategorije/${encodeURIComponent('papirne kese')}`, 
    `/kategorije/${encodeURIComponent('vakum kese')}`, 
  ]
  const [CtaLink, setCtaLink] = useState(ctaLinkList[0]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = () => {
      if (currentSlide >= slideCount - 1) {
          setCurrentSlide(0);
          setCtaLink(ctaLinkList[0]);
        } else {
            setCurrentSlide(currentSlide + 1);
          setCtaLink(ctaLinkList[currentSlide + 1]);
        }
    };

    const handlePreviousSlide = () => {
        if (currentSlide <= 0) {
          setCurrentSlide(slideCount - 1);
          setCtaLink(ctaLinkList[slideCount - 1]);
        } else {
          setCurrentSlide(currentSlide - 1);
          setCtaLink(ctaLinkList[currentSlide - 1]);
        }
      };
      
    
    const handleSlideChange = () => {
        const heroImages = document.querySelectorAll(`.${styles.hero_photo}`);
        const heroText = document.querySelectorAll(`.${styles.hero_text}`);
        
        Array.from(heroImages).forEach((image, index) => {
      if (index === currentSlide) {
        image.classList.add(styles.active);
      } else {
        image.classList.remove(styles.active);
      }
    });

    Array.from(heroText).forEach((text, index) => {
      if (index === currentSlide) {
        text.classList.add(styles.active);
      } else {
        text.classList.remove(styles.active);
      }
    });
  };

  useEffect(() => {
    handleSlideChange();
  }, [currentSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSlide]);


  return (
    <section id="hero_section" className={styles.hero_section}>
      <Image
        id={styles.hero_photo_1}
        className={styles.hero_photo}
        src="/images/baners/plastic-bag.jpg"
        alt="plastic bags baner"
        width={1920}
        height={1080}
        quality={100}
      />
      <Image
        id={styles.hero_photo_2}
        className={styles.hero_photo}
        src="/images/baners/plasticne-ambalaze.jpg"
        alt="plastic bags baner"
        width={1920}
        height={1080}
        quality={100}
      />
      <Image
        id={styles.hero_photo_3}
        className={styles.hero_photo}
        src="/images/baners/stiropor-ambalaze.jpg"
        alt="plastic bags baner"
        width={1920}
        height={1080}
        quality={100}
      />
      <Image
        id={styles.hero_photo_4}
        className={styles.hero_photo}
        src="/images/baners/papirne-kese.jpg"
        alt="plastic bags baner"
        width={1920}
        height={1080}
        quality={100}
      />
      <Image
        id={styles.hero_photo_5}
        className={styles.hero_photo}
        src="/images/baners/vakum-kese.jpeg"
        alt="plastic bags baner"
        width={1920}
        height={1080}
        quality={100}
      />
      <div className={styles.hero_text_container}>
        <h1 className={styles.page_header}>STOPAK AMBALAŽA</h1>
        <div className={styles.hero_category_container}>
          <h2
            id="hero_text_1"
            className={`${styles.hero_text} ${styles.active}`}
          >
            NAJLONSKE KESE
          </h2>
          <h2 id="hero_text_2" className={styles.hero_text}>
            PLASTIČNA AMBALAŽA
          </h2>
          <h2 id="hero_text_3" className={styles.hero_text}>
            STIROPOR AMBALAŽA
          </h2>
          <h2 id="hero_text_4" className={styles.hero_text}>
            PAPIRNE KESE
          </h2>
          <h2 id="hero_text_5" className={styles.hero_text}>
            VAKUM KESE
          </h2>
        </div>
        <Link href={CtaLink} className={styles.cta_link}>
          POGLEDAJ KATEGORIJU
        </Link>
      </div>

      <Image
        src="/images/icons/right-arrow-white.svg"
        alt="Switch arrow"
        width={50}
        height={75}
        className={styles.left_arrow}
        onClick={handlePreviousSlide}
      />
      <Image
        src="/images/icons/right-arrow-white.svg"
        alt="Switch arrow"
        width={50}
        height={75}
        className={styles.right_arrow}
        onClick={handleNextSlide}
      />
    </section>
  );
};

export default Hero;
