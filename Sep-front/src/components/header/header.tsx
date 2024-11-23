import Image from "next/image";
import styles from "./header.module.css";
import Searchbar from "../searchBar/searchBar";
import Link from "next/link";
import HeaderCategories from "../headerCategories/headerCategories";
import Cart from "../cart/cart";
import CartOpenButton from "./cartOpenButton";
import MobileMenuOpener from "../mobileMenu/opener";
import MobileMenu from "../mobileMenu/menu";

const Header = () => {
  return (
    <header id="page_header" className={styles.header}>
      <MobileMenuOpener />
      <MobileMenu />
      <Link href="/">
        <Image
          src="\images\logos\StoPak - logo.svg"
          alt="Logo"
          width={150}
          height={50}
          quality={100}
        />
      </Link>
      <div className={styles.search_bar_wrapper}>
        <Searchbar />
      </div>

      <div className={styles.phone_account_container}>
        <Link href="/login" className={styles.account_container}>
          <Image
            src="\images\icons\user-icon.svg"
            alt="user icon"
            quality={100}
            width={30}
            height={30}
          />
        </Link>

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

        <CartOpenButton />
      </div>
      <HeaderCategories />
      <Cart />
    </header>
  );
};

export default Header;
