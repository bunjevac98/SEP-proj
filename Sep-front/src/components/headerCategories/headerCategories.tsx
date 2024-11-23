"use client";

import Link from "next/link";
import styles from "./headerCategories.module.css";
import Image from "next/image";
import { useEffect } from "react";

const HeaderCategories = () => {
    useEffect(() => {
    
        const topLinks = document.querySelectorAll(`.${styles.top_category}`);
        const categoriesContainers = document.querySelectorAll(`.${styles.sub_category_container}`);
    
        const handleMouseEnter = (event:any) => {
          const container = event.currentTarget.nextElementSibling;
          if (container && container.classList.contains(styles.sub_category_container)) {
            container.classList.add(styles.active_category);
          }
        };
    
        const handleMouseLeave = (event:any) => {
          const container = event.currentTarget.nextElementSibling;
          if (container && container.classList.contains(styles.sub_category_container)) {
            container.classList.remove(styles.active_category);
          }
        };
    
        topLinks.forEach((link) => {
          link.addEventListener('mouseenter', handleMouseEnter);
          link.addEventListener('mouseleave', handleMouseLeave);
        });
    
        categoriesContainers.forEach((container) => {
          container.addEventListener('mouseenter', () => {
            container.classList.add(styles.active_category);
          });
          container.addEventListener('mouseleave', () => {
            container.classList.remove(styles.active_category);
          });
        });
    
        // Cleanup event listeners on component unmount
        return () => {
          topLinks.forEach((link) => {
            link.removeEventListener('mouseenter', handleMouseEnter);
            link.removeEventListener('mouseleave', handleMouseLeave);
          });
          categoriesContainers.forEach((container) => {
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
          });
        };
      }, []);
  return (
    <>
      <nav className={styles.header_categories}>
        <div className={styles.category_container}>
          <Link href={"/kategorije/"+encodeURIComponent("najlonske kese")} className={styles.top_category}>
            Najlonske kese
          </Link>
          {/* <Image src="\images\icons\right-arrow.svg" alt="down arrow" className={styles.drop_arrow} width={25} height={25}/> */}
          <div className={styles.sub_category_container}>
            <Link href={"/kategorije/"+encodeURIComponent("treger kese")} className={styles.sub_category}>
              Treger kese
            </Link>
            <Link href={"/kategorije/"+encodeURIComponent("ukrasne kese")} className={styles.sub_category}>
              Ukrasne kese
            </Link>
            <Link href={"/kategorije/"+encodeURIComponent("zamrzivač kese")} className={styles.sub_category}>
              Zamrzivač kese
            </Link>
            <Link href={"/kategorije/"+encodeURIComponent("džakovi za smeće")} className={styles.sub_category}>
              Džakovi za smeće
            </Link>
          </div>
        </div>

        <div className={styles.category_container}>
          <Link href={"/kategorije/"+encodeURIComponent("plastična ambalaža")} className={styles.top_category}>
            Plastična ambalaža
          </Link>
          <div className={styles.sub_category_container}>
            <Link href={"/kategorije/"+encodeURIComponent("pet ambalaža")} className={styles.sub_category}>
              PET Ambalaža (do 60 &deg;C)
            </Link>
            <Link href={"/kategorije/"+encodeURIComponent("pp ambalaža")} className={styles.sub_category}>
              PP Ambalaža (do 120 &deg;C)
            </Link>
          </div>
        </div>

        <div className={styles.category_container}>
          <Link href={"/kategorije/"+encodeURIComponent("stiropor ambalaža")} className={styles.top_category}>
            Stiropor ambalaža
          </Link>
        </div>

        <div className={styles.category_container}>
          <Link href={"/kategorije/"+encodeURIComponent("papirne kese")} className={styles.top_category}>
            Papirne kese
          </Link>
        </div>

        <div className={styles.category_container}>
          <Link href={"/kategorije/"+encodeURIComponent("vakum kese")} className={styles.top_category}>
            Vakum kese
          </Link>
          <div className={styles.sub_category_container}>
            <Link href={"/kategorije/"+encodeURIComponent("glatke vakum kese")} className={styles.sub_category}>
              Glatke vakum kese
            </Link>
            <Link href={"/kategorije/"+encodeURIComponent("reljefne vakum kese")} className={styles.sub_category}>
              Reljefne vakum kese
            </Link>
          </div>
        </div>

        <div className={styles.category_container}>
          <Link href={"/kategorije/"+encodeURIComponent("ostalo")} className={styles.top_category}>
            Ostalo
          </Link>
        </div>
      </nav>
    </>
  );
};
export default HeaderCategories;
