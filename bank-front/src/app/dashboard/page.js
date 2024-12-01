"use client"
import Link from "next/link";
import styles from "./styles.module.css";
import Image from "next/image";
import { copyToClipboard } from "../../../lib/actions";

const MerchantDashboard = () => {

    const mechantData = {
        merchantId: 23987492384,
        merchantName: "John Doe",
        merchantEmail: "f6q8z@example.com",
    }



    return (
        <main id="merchant_dashboard" className={styles.container}>
            <div id="mechant_dashboard_content" className={styles.content}>
                <h1>Dobrodošli na svoju kontrolnu tablu</h1>
                <div className={styles.cards_container}>

                    <div className={styles.left_container}>
                        <h2>Vaše informacije</h2>
                        <div>
                            <p>Merchant ID: <span>{mechantData.merchantId}</span></p><Image src="/copy.svg" alt="copy icon" width={24} height={24} onClick={() => { copyToClipboard(mechantData.merchantId) }} />
                        </div>

                        <p>Ime prodavca: <span>{mechantData.merchantName}</span></p>
                        <p>Email prodavca: <span>{mechantData.merchantEmail}</span></p>
                    </div>

                    <div className={styles.right_container}>
                        <h2>Transakcije</h2>
                        <p>Broj transakcija: <span>12</span></p>
                        <Link href="/dashboard/transactions">Prikaz transakcija</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default MerchantDashboard;