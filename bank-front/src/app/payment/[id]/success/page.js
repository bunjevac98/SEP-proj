"use client"
import Link from "next/link";
import { formatToDecimal } from "../../../../../lib/actions";
import styles from "../styles.module.css";

const SuccessPage = (props) => {

    const { id } = props.params || "";

    const transactionDate = new Date();
    const transactionAmount = 5000;

    return (
        <main id="SuccessPage" className={styles.pageContainer}>
            <div className={styles.successContainer}>
                <h1>Uspešna transakcija!</h1>
                <p>Broj trasakcije: {id}</p>
                <p>Datum transakcije: {transactionDate.toLocaleDateString()}</p>
                <p>Iznos transakcije: {formatToDecimal(transactionAmount)}rsd</p>
                <Link href="/" className={styles.button}>Završi porudžbinu</Link>
            </div>
        </main>
    )
}

export default SuccessPage;