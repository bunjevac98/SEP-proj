import Image from 'next/image';
import styles from './customerOrderItem.module.css';
import { formatNumber } from 'lib/lib/actions';

interface Product {
    _id: string;
    title: string;
    numOfArticle: string;
    price: number;
    description: string;
    format: string;
    url: string;
    featureImage: string;
    images: string[];
    quantity: number;
    isPopular: boolean;
    status: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface OrderedProduct {
    productId: Product;
    quantity: number;
    _id: string;
}

interface OrderProps {
    _id: string;
    customer_id: string;
    orderNumber: string;
    address: string;
    totalPrice: string;
    status: string;
    orderedProducts: OrderedProduct[];
    description: string;
    __v: number;
}


const CustomerOrderItem: React.FC<{ order: OrderedProduct }> = ({ order }) =>{
    return(<div className={styles.customer_order}>
        {/* <Image width={40} height={40} alt='product image' src={order.productId.featureImage}/> */}
        <p>Naziv: <span>{order.productId.title}</span></p>
        <p>Sifra artikla: <span>{order.productId.numOfArticle}</span></p>
        <p>Količina: <span>{formatNumber(order.quantity)}</span></p>

    </div>)
};

export default CustomerOrderItem;