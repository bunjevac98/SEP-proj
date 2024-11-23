"use client";
import { Product } from "lib/lib/objects";
import styles from "../../app/proizvodi/[id]/page.module.css";
import Image from "next/image";
import { useCart } from "lib/context/cartContext";
import { handleCartClose, handleCartOpen } from "lib/lib/actions";
import { useState } from "react";

const BuyButton = ({
  productInfo,
  image,
}: {
  productInfo: Product | null;
  image: string;
}) => {
  const { addItem } = useCart();

  // Osiguraj da je useState van svih uslova
  const initialPrice =
    productInfo?.hasSizes && productInfo?.sizes
      ? productInfo.sizes[0].price * 1.2
      : productInfo?.price
      ? productInfo.price * 1.2
      : 0;

  const [selectedPrice, setSelectedPrice] = useState(initialPrice);

  // Proveri da li postoji productInfo odmah na početku i vrati praznu komponentu ako ne postoji
  if (!productInfo) return <></>;

  const addToCart = () => {
    const selectedSizeText =
      (document.getElementById("quantity_select") as HTMLSelectElement)
        ?.selectedOptions[0]?.textContent || "";

    addItem({
      id: productInfo._id + "++" + selectedSizeText,
      quantity: parseInt(
        (document.getElementById("quantity_input") as HTMLInputElement)?.value
      ),
      title: productInfo.title,
      price: selectedPrice,
      image: image || "/images/logos/StoPak - logo.png",
      increment: productInfo.quantity || 1,
      hasSize: productInfo.hasSizes,
      size: {
        price: selectedPrice,
        size: selectedSizeText,
      },
    });

    handleCartOpen();
    setTimeout(() => {
      handleCartClose();
    }, 2000);
  };

  return (
    <div className={styles.product_buy_container}>
      {productInfo.hasSizes && productInfo?.sizes && (
        <select
          id="quantity_select"
          className={styles.size_select}
          onChange={(e) => {
            setSelectedPrice(
              parseFloat(e.target.value) + parseFloat(e.target.value) * 0.2
            );
          }}
        >
          <>
            <option value="" disabled>
              Veličina
            </option>
            {productInfo?.sizes?.map((size) => (
              <option key={size.size} value={size.price}>
                {size.size}
              </option>
            ))}
          </>
        </select>
      )}
      <input
        type="number"
        className={styles.buy_quantity}
        defaultValue={productInfo?.quantity || 0}
        min={productInfo?.quantity || 0}
        step={productInfo?.quantity || 1}
        id="quantity_input"
        onChange={(e) => {
          const value: any = e.target.value;
          if (productInfo.quantity && value % productInfo.quantity !== 0) {
            (
              document.getElementById("kupi_dugme") as HTMLButtonElement
            ).disabled = true;
            (
              document.getElementById("quantity_notice") as HTMLSpanElement
            ).style.opacity = "1";
          } else {
            (
              document.getElementById("kupi_dugme") as HTMLButtonElement
            ).disabled = false;
            (
              document.getElementById("quantity_notice") as HTMLSpanElement
            ).style.opacity = "0";
          }
        }}
      />
      <button
        className={styles.buy_button}
        id="kupi_dugme"
        onClick={() => addToCart()}
      >
        <Image
          src="\images\icons\cart-icon-white.svg"
          alt="cart icon"
          quality={100}
          width={30}
          height={30}
        />
        DODAJ U KORPU
      </button>
    </div>
  );
};

export default BuyButton;
