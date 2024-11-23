"use client"

import Image from 'next/image';
import styles from './mobileMenu.module.css';

const MobileMenuOpener = () => {

    const handleMobileMenuOpen = () => {
        const MobileMenu = document.getElementById('mobile_menu');
        const MobileMenuOpener = document.getElementById('mobile_menu_opener');

        if(MobileMenu){
            if(MobileMenu.classList.contains(styles.open)){
                MobileMenuOpener?.classList.remove(styles.flipped);
                MobileMenu.classList.remove(styles.open);
            }else{
                MobileMenuOpener?.classList.add(styles.flipped);
                MobileMenu.classList.add(styles.open);
            }
        }
    };


    return (
        <Image src="\images\icons\mobile-menu-open.svg" id="mobile_menu_opener" className={styles.mobile_menu_opener} width={35} height={35} alt="open mobile menu" onClick={()=>{handleMobileMenuOpen();}}/>
    );
};

export default MobileMenuOpener;