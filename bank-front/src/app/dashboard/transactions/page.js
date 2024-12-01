"use client";

import { useState } from "react";
import styles from "./styles.module.css";
import { copyToClipboard } from "../../../../lib/actions";
import Image from "next/image";


const TransactionsPage = () => {

    const transactionHistory = [
        {
            "transaction_id": "txn_001",
            "outcome": "success",
            "date": "2024-11-25T10:15:00Z",
            "amount": 49.99,
            "currency": "USD",
            "card_type": "VISA",
            "card_last_four": "1234",
            "location": "New York, USA",
            "customer_id": "cust_001"
        },
        {
            "transaction_id": "txn_002",
            "outcome": "failure",
            "date": "2024-11-25T11:30:00Z",
            "amount": 150.75,
            "currency": "USD",
            "card_type": "MasterCard",
            "card_last_four": "5678",
            "location": "Los Angeles, USA",
            "customer_id": "cust_002"
        },
        {
            "transaction_id": "txn_003",
            "outcome": "success",
            "date": "2024-11-25T12:45:00Z",
            "amount": 299.99,
            "currency": "USD",
            "card_type": "AMEX",
            "card_last_four": "9876",
            "location": "Chicago, USA",
            "customer_id": "cust_003"
        },
        {
            "transaction_id": "txn_004",
            "outcome": "pending",
            "date": "2024-11-25T14:00:00Z",
            "amount": 120.50,
            "currency": "USD",
            "card_type": "Discover",
            "card_last_four": "4321",
            "location": "San Francisco, USA",
            "customer_id": "cust_004"
        },
        {
            "transaction_id": "txn_005",
            "outcome": "success",
            "date": "2024-11-25T15:30:00Z",
            "amount": 59.99,
            "currency": "USD",
            "card_type": "VISA",
            "card_last_four": "1122",
            "location": "Miami, USA",
            "customer_id": "cust_005"
        },
        {
            "transaction_id": "txn_006",
            "outcome": "success",
            "date": "2024-11-25T16:00:00Z",
            "amount": 75.00,
            "currency": "USD",
            "card_type": "MasterCard",
            "card_last_four": "3344",
            "location": "Seattle, USA",
            "customer_id": "cust_006"
        },
        {
            "transaction_id": "txn_007",
            "outcome": "failure",
            "date": "2024-11-25T17:15:00Z",
            "amount": 200.00,
            "currency": "USD",
            "card_type": "VISA",
            "card_last_four": "5566",
            "location": "Austin, USA",
            "customer_id": "cust_007"
        },
        {
            "transaction_id": "txn_008",
            "outcome": "success",
            "date": "2024-11-25T18:00:00Z",
            "amount": 250.00,
            "currency": "USD",
            "card_type": "AMEX",
            "card_last_four": "2233",
            "location": "Portland, USA",
            "customer_id": "cust_008"
        },
        {
            "transaction_id": "txn_009",
            "outcome": "pending",
            "date": "2024-11-25T19:30:00Z",
            "amount": 65.80,
            "currency": "USD",
            "card_type": "Discover",
            "card_last_four": "7788",
            "location": "Boston, USA",
            "customer_id": "cust_009"
        },
        {
            "transaction_id": "txn_010",
            "outcome": "success",
            "date": "2024-11-25T20:45:00Z",
            "amount": 120.00,
            "currency": "USD",
            "card_type": "MasterCard",
            "card_last_four": "9999",
            "location": "Atlanta, USA",
            "customer_id": "cust_010"
        }
    ]

    const [allTransactions, setAllTransactions] = useState(transactionHistory);


    return (
        <main id="transaction_history_page" className={styles.container}>
            <div id="mechant_dashboard_content" className={styles.content}>
                <h1>Istorija transakcija</h1>
                <div className={styles.table_container}>
                    <table className={styles.transaction_table}>
                        <thead>
                            <tr>
                                <th>Trans. ID</th>
                                <th>Ishod</th>
                                <th>Datum</th>
                                <th>Iznos</th>
                                <th>Valuta</th>
                                <th>Tip Kartice</th>
                                <th>Posl. 4 cifre kartice</th>
                                <th>Lokacija</th>
                                <th>Id korisnika</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTransactions?.length > 0 ? allTransactions.map((transaction, index) => (
                                <tr key={index}>
                                    {Object.entries(transaction).map(([key, value], idx) => (
                                        <td key={idx}>{value}{key === "transaction_id" && <Image src="/copy.svg" alt="copy icon" width={18} height={18} className={styles.copy_icon} onClick={() => { copyToClipboard(value) }} />}</td>
                                    ))}
                                </tr>
                            )) : <tr aria-colspan={8}><td>Nema prethodnih transakcija</td></tr>}
                        </tbody>
                    </table>

                </div>
            </div>
        </main>
    )
};

export default TransactionsPage;