import Image from "next/image";
import styles from "./productCard.module.css";
import type { Product, ProductCard } from "lib/lib/objects";
import Link from "next/link";
import { formatNumber } from "lib/lib/actions";

const ProductCard = ({
  product,
  theKey,
}: {
  product: Product;
  theKey?: string;
}) => {

  const productSizePrices = [Infinity];
  if (product.hasSizes && product.sizes) {
      product.sizes.forEach((size) => {
          productSizePrices.push(size.price);
      });
  }
  const minimumPrice = Math.min(...productSizePrices);

  return (
    <Link href={`/proizvodi/${product._id}`} className={styles.product_card}>
      <Image
        className={styles.product_image}
        src={product?.featureImage && product?.featureImage?.url ? product?.featureImage.url : "/images/logos/StoPak - logo.svg"}
        alt="Product Image"
        width={250}
        height={250}
      />
      <h3 className={styles.product_title}>{product.title}</h3>
      <p className={styles.product_basePrice}>{product.hasSizes ? `OD ${formatNumber(minimumPrice)}` : formatNumber(product.price)} RSD + PDV</p>
      <p className={styles.product_totalPrice}>{product.hasSizes ? (`OD ${formatNumber(minimumPrice + minimumPrice * 0.20)}`) : (formatNumber(product.price + (product.price * 0.20)))} RSD</p>
      {/* <p className={styles.product_totalPrice}>{product.totalPrice} RSD</p> */}
      <button className={styles.link_button}>
        <Image
          src="/images/icons/eye-icon.svg"
          alt="Look icon"
          width={25}
          height={25}
        />
        <p>VIŠE INFORMACIJA</p>
      </button>
    </Link>
  );
};

export default ProductCard;
