"use client";
import { useCart } from "lib/context/cartContext";
import styles from "./cart.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { handleCartClose } from "lib/lib/actions";
import CartItem from "./cartItem/cartItem";
import { cartItem } from "lib/lib/objects";
import { formatNumber } from "lib/lib/actions";

const Cart = () => {
  const { state, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  

  const handleCartClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div id="website_cart_container" className={styles.cart_container} onClick={() => handleCartClose()}>
      <div id="website_cart" className={styles.cart} onClick={handleCartClick}>
        <div className={styles.cart_top}>
          <h3>Vaša korpa</h3>
          <button title="Zatvori" onClick={() => handleCartClose()}>&#10005;</button>
        </div>
        <div className={styles.cart_item_list}>
          {state.items.map((item:cartItem) => (
            <CartItem item={item} key={`cart-item-${item.id}`}/>
          ))}
        </div>
        <div className={styles.cart_bottom}>
          <div className={styles.cart_total}>
            <span>Ukupno:</span>
            <span>{formatNumber(state.totalPrice)} RSD</span>
          </div>
          <Image src="/images/icons/trash-icon.svg" alt="Trash" title="Obriši sve" className={styles.cart_removeAll} width={25} height={25} onClick={() => clearCart()}/>
        </div>
        <button disabled={(state.items?.length === 0 || state.totalPrice<2000)} style={{cursor: (state.items?.length === 0 || state.totalPrice<2000)?'not-allowed':'pointer'}} className={styles.order_button} onClick={()=>{router.push('/checkout')}}>{(state.items?.length === 0 || state.totalPrice<2000)?"Minimum 2000 RSD":'PORUČI'}</button>
      </div>
    </div>
  );
};

export default Cart;
