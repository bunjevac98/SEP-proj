"use client"

import Image from "next/image";
import styles from "./header.module.css";
import cartStyles from "../cart/cart.module.css";
import { formatNumber, handleCartOpen } from "lib/lib/actions";
import { useCart } from "lib/context/cartContext";

const CartOpenButton = () =>{

  const {state} = useCart();
    

    return(
        <div className={styles.cart_container} onClick={()=>handleCartOpen()}>
          <Image
            src="\images\icons\cart-icon.svg"
            alt="cart icon"
            quality={100}
            width={30}
            height={30}
          />
          <div className={styles.cart_container_middle}>
            {state.items.length === 0 && <span>Korpa je prazna</span>}
            <span>{formatNumber(state.totalPrice)} RSD</span>
          </div>
          <Image
            src="\images\icons\right-arrow.svg"
            alt="arrow"
            quality={100}
            width={30}
            height={30}
          />
        </div>
    )
}


export default CartOpenButton;