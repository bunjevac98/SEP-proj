"use client";

import Link from "next/link";
import Searchbar from "../searchBar/searchBar";
import styles from "./mobileMenu.module.css";
import Image from "next/image";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const MobileMenu = () => {
  const pathname = usePathname();

  const handleMobileMenuOpen = () => {
    const MobileMenu = document.getElementById("mobile_menu");
    const MobileMenuOpener = document.getElementById("mobile_menu_opener");

    if (MobileMenu) {
      if (MobileMenu.classList.contains(styles.open)) {
        MobileMenuOpener?.classList.remove(styles.flipped);
        MobileMenu.classList.remove(styles.open);
      }
      // else {
      //     MobileMenuOpener?.classList.add(styles.flipped);
      //     MobileMenu.classList.add(styles.open);
      // }
    }
  };

  useEffect(() => {
    handleMobileMenuOpen();
  }, [pathname]);
  return (
    <div id="mobile_menu" className={styles.mobile_menu}>
      <div className={styles.phone_account_container}>
      <div className={styles.phone_container}>
          <Image
            src="\images\icons\phone-icon.svg"
            alt="phone icon"
            quality={100}
            width={30}
            height={30}
          />
          <div>
            <a href="tel:+38169610199">
              <span>Novi Sad: 069610199</span>
            </a>
            <a href="tel:+381695620121">
              <span>Vršac: 0695620121</span>
            </a>
          </div>
        </div>

        <Link href="/login" className={styles.account_container}>
          <Image
            src="\images\icons\user-icon.svg"
            alt="user icon"
            quality={100}
            width={30}
            height={30}
          />
        </Link>
      </div>

      <Searchbar />

      <nav className={styles.header_categories}>
        <div className={styles.category_container}>
          <Link
            href={"/kategorije/" + encodeURIComponent("najlonske kese")}
            className={styles.top_category}
          >
            Najlonske kese
          </Link>
          {/* <Image src="\images\icons\right-arrow.svg" alt="down arrow" className={styles.drop_arrow} width={25} height={25}/> */}
          <div className={styles.sub_category_container}>
            <Link
              href={"/kategorije/" + encodeURIComponent("treger kese")}
              className={styles.sub_category}
            >
              Treger kese
            </Link>
            <Link
              href={"/kategorije/" + encodeURIComponent("ukrasne kese")}
              className={styles.sub_category}
            >
              Ukrasne kese
            </Link>
            <Link
              href={"/kategorije/" + encodeURIComponent("zamrzivač kese")}
              className={styles.sub_category}
            >
              Zamrzivač kese
            </Link>
            <Link
              href={"/kategorije/" + encodeURIComponent("džakovi za smeće")}
              className={styles.sub_category}
            >
              Džakovi za smeće
            </Link>
          </div>
        </div>

        <div className={styles.category_container}>
          <Link
            href={"/kategorije/" + encodeURIComponent("plastična ambalaža")}
            className={styles.top_category}
          >
            Plastična ambalaža
          </Link>
          <div className={styles.sub_category_container}>
            <Link
              href={"/kategorije/" + encodeURIComponent("pet ambalaža")}
              className={styles.sub_category}
            >
              PET Ambalaža (do 60 &deg;C)
            </Link>
            <Link
              href={"/kategorije/" + encodeURIComponent("pp ambalaža")}
              className={styles.sub_category}
            >
              PP Ambalaža (do 120 &deg;C)
            </Link>
          </div>
        </div>

        <div className={styles.category_container}>
          <Link
            href={"/kategorije/" + encodeURIComponent("stiropor ambalaža")}
            className={styles.top_category}
          >
            Stiropor ambalaža
          </Link>
        </div>

        <div className={styles.category_container}>
          <Link
            href={"/kategorije/" + encodeURIComponent("papirne kese")}
            className={styles.top_category}
          >
            Papirne kese
          </Link>
        </div>

        <div className={styles.category_container}>
          <Link
            href={"/kategorije/" + encodeURIComponent("vakum kese")}
            className={styles.top_category}
          >
            Vakum kese
          </Link>
          <div className={styles.sub_category_container}>
            <Link
              href={"/kategorije/" + encodeURIComponent("glatke vakum kese")}
              className={styles.sub_category}
            >
              Glatke vakum kese
            </Link>
            <Link
              href={"/kategorije/" + encodeURIComponent("reljefne vakum kese")}
              className={styles.sub_category}
            >
              Reljefne vakum kese
            </Link>
          </div>
        </div>

        <div className={styles.category_container}>
          <Link
            href={"/kategorije/" + encodeURIComponent("Ostalo")}
            className={styles.top_category}
          >
            Ostalo
          </Link>
        </div>

      </nav>
    </div>
  );
};

export default MobileMenu;
