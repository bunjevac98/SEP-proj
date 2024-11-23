import { cartItem } from "lib/lib/objects";
import styles from "./cartItem.module.css";
import Image from "next/image";
import { formatNumber } from "lib/lib/actions";
import { useCart } from "lib/context/cartContext";

const CartItem = ({ item }: { item: cartItem }) => {
  const { removeItem, updateQuantity } = useCart();

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  }

  return (
    <div className={styles.cart_item}>
      <Image
        src={item.image}
        className={styles.cart_item_photo}
        alt="product image"
        width={75}
        height={75}
      />
      <div className={styles.cart_item_details}>
        <div className={styles.cart_item_details_name}>
          <p>{item.title}{item.hasSize&&item?.size&&` (${item?.size.size})`}</p>
          <Image
            src="/images/icons/trash-icon.svg"
            alt="Trash"
            title="Obriši sve"
            className={styles.cart_removeAll}
            width={25}
            height={25}
            onClick={() => handleRemoveItem(item.id)}
          />
        </div>
        <div className={styles.cart_item_details_price}>
          <div className={styles.cart_item_quantity_manipulation}>
            <span className={styles.cart_minus_icon} onClick={() => { (item.quantity - item.increment) > 0 ? updateQuantity(item.id, (item.quantity - item.increment)) : removeItem(item.id) }}>-</span>
            <span className={styles.cart_item_quantity}>{item.quantity}</span>
            <span className={styles.cart_plus_icon} onClick={() => { updateQuantity(item.id, (item.quantity + item.increment)) }}>+</span>
          </div>
          <p className={styles.cart_item_price}>
            {formatNumber(item.price * item.quantity)} <span>RSD</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
