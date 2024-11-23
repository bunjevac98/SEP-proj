"use client"

import type { Product, User } from "lib/lib/objects"
import styles from "./adminProductCard.module.css"
import Image from "next/image"
import { formatNumber, handleDeleteProduct } from "lib/lib/actions"
import Link from "next/link"
import { Popconfirm } from "antd"

const AdminProductCard = ({ product, user }: { product: Product, user:User }) => {

    const deleteProduct = (id:string) => {
        handleDeleteProduct(id, user.token);
        window.location.reload();
    }

    const productSizePrices = [Infinity];
    if (product.hasSizes && product.sizes) {
        product.sizes.forEach((size) => {
            productSizePrices.push(size.price);
        });
    }
    const minimumPrice = Math.min(...productSizePrices);

    return (
        <div className={styles.adminProductCard}>
            <Image src={(product?.featureImage && product.featureImage?.url) ? product?.featureImage.url : "/images/logos/StoPak - logo.svg"} width={100} height={100} alt="product image" />
            <div className={styles.productInfoContainer}>
                <p className={styles.productName}>{product.numOfArticle} - {product?.title}</p>
                <p className={styles.productPrice}>{product.hasSizes ? `OD ${formatNumber(minimumPrice)}` : formatNumber(product?.price)} RSD</p>
            </div>
            <div className={styles.actionsContainer}>
                <Link href={`/account/edit-product/${product._id}`}><Image src="\images\icons\edit-icon.svg" width={30} height={30} alt="edit icon" /></Link>
                <Popconfirm title="Da li sigurno želite da obrišete ovaj proizvod" onConfirm={() => deleteProduct(product._id)}>
                    <Image src="\images\icons\trash-icon.svg" width={30} height={30} alt="delete icon" />

                </Popconfirm>

            </div>
        </div>
    )
}

export default AdminProductCard;