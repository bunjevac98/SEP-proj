"use client";

import { useState } from "react";
import styles from "./styles.module.css";

const PaymentPage = (props) => {
    const { id } = props.params;

    const [formData, setFormData] = useState({
        cardHolder: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        // Card number validation (16 digits, optional spaces)
        const cardNumberPattern = /^\d{4} \d{4} \d{4} \d{4}$/; // Updated to match space-separated format
        if (!cardNumberPattern.test(formData.cardNumber)) {
            newErrors.cardNumber = "Neispravan broj kartice.";
        }

        // Expiry date validation (MM/YY and valid future date)
        const expiryPattern = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryPattern.test(formData.expiryDate)) {
            newErrors.expiryDate = "Neispravan format datuma. Potrebam je MM/YY format.";
        } else {
            const [month, year] = formData.expiryDate.split("/").map(Number);
            const currentDate = new Date();
            const expiryDate = new Date(
                `20${year}`,
                month - 1,
                1
            );
            if (expiryDate < currentDate) {
                newErrors.expiryDate = "Datum isteka kartice mora biti u budućnosti.";
            }
        }

        // CVV validation (3-4 digits)
        const cvvPattern = /^\d{3,4}$/;
        if (!cvvPattern.test(formData.cvv)) {
            newErrors.cvv = "CVV Mora biti 3 ili 4 cifre.";
        }

        setErrors(newErrors);

        // Return whether form is valid
        return Object.keys(newErrors).length === 0;
    };

    const formatCardNumber = (value) => {
        // Remove all non-digit characters and group as "#### #### #### ####"
        return value
            .replace(/\D/g, "") // Remove non-digits
            .replace(/(\d{4})(?=\d)/g, "$1 ") // Add spaces every 4 digits
            .trim(); // Remove trailing space
    };

    const formatExpiryDate = (value) => {
        // Remove all non-digit characters and format as "MM/YY"
        return value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d{1,2})/, "$1/$2")
            .slice(0, 5); // Ensure max length of 5
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if (name === "cardNumber") {
            formattedValue = formatCardNumber(value);
        } else if (name === "expiryDate") {
            formattedValue = formatExpiryDate(value);
        }

        setFormData({ ...formData, [name]: formattedValue });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form submitted:", formData);
        } else {
            console.log("Validation errors:", errors);
        }
    };

    return (
        <main id="payment_page" className={styles.pageContainer}>
        <div id="payment_form" className={styles.container}>
            <div className={styles.transactionDetails}>
                <h2>Transakcija #{id}</h2>
                <p>Ukupno: 1000 RSD</p>
            </div>
            <h1 className={styles.title}>Unesite podatke sa kartice</h1>
            <div className={styles.cardPreview}>
                <div className={styles.card}>
                    <div className={styles.cardNumber}>{formData.cardNumber || "**** **** **** ****"}</div>
                    <div className={styles.cardDetails}>
                        <div className={styles.cardHolder}>{formData.cardHolder || "CARDHOLDER NAME"}</div>
                        <div className={styles.expiryDate}>{formData.expiryDate || "MM/YY"}</div>
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="cardHolder" className={styles.label}>Cardholder Name</label>
                    <input
                        type="text"
                        id="cardHolder"
                        name="cardHolder"
                        value={formData.cardHolder}
                        onChange={handleChange}
                        className={styles.input}
                    />
                    {errors.cardHolder && <p className={styles.error}>{errors.cardHolder}</p>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="cardNumber" className={styles.label}>Card Number</label>
                    <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        maxLength="19" // 16 digits + 3 spaces
                    />
                    {errors.cardNumber && <p className={styles.error}>{errors.cardNumber}</p>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="expiryDate" className={styles.label}>Expiry Date (MM/YY)</label>
                    <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        maxLength="5"
                    />
                    {errors.expiryDate && <p className={styles.error}>{errors.expiryDate}</p>}
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="cvv" className={styles.label}>CVV</label>
                    <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        maxLength="4"
                    />
                    {errors.cvv && <p className={styles.error}>{errors.cvv}</p>}
                </div>
                <button type="submit" className={styles.button}>Submit Payment</button>
            </form>
            </div>
        </main>
    );
};

export default PaymentPage;
