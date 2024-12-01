"use client"
import { useState } from "react";
import { handleRegister } from "../../../lib/actions";
import styles from "../page.module.css";
const RegistrationPage = () => {
    const [userData, setUserData] = useState({});

    const register = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const email = formData.get('email');
        const username = formData.get('username');
        const password = formData.get('password');
        const response = await handleRegister({ email: email, username: username, password: password });

        if (response.status === 200) {
            alert("Vaš nalog je kreiran, sačuvajte podatke sa ekrana i prijavite se koristeći ih.");
            document.getElementById("user_response_data").style.maxWidth = "300px";
            document.getElementById("user_response_data").style.padding = "12px";
            setUserData(response.data);
        } else {
            alert("Desila se greška, nalog nije mogao biti kreiran.");
        }
    };
    return (
        <div className={styles.page}>
            <div className={styles.forms_container}>
                <form className={styles.formForm} style={{ border: "none", maxWidth: "300px" }} onSubmit={register}>
                    <h2>REGISTRACIJA</h2>
                    <br />
                    <p>Unesite potrebne podatke i kreirajte svoj administrativni nalog kako bi pristupili našem asortimanu usluga.</p>
                    <br />
                    <div className={`${styles.formContainer} ${styles.left}`}>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" name="email" required />
                        </div>
                        <div>
                            <label htmlFor="username">Korisničko ime (username)</label>
                            <input type="text" id="username" name="username" required />
                        </div>
                        <div>
                            <label htmlFor="password">Lozinka (password)</label>
                            <input type="password" name="password" required />
                        </div>
                        <button type="submit">REGISTRUJ SE</button>
                    </div>
                </form>
                <div id="user_response_data" className={styles.formForm} style={{ justifyContent: "center", maxWidth: "0", overflow: "hidden", padding: "0", transition: "all 0.5s ease-in-out" }}>
                    <div className={`${styles.formContainer}`}>
                        <p>Merchant ID: {userData?.merchantId}</p>
                        <p>Username: {userData?.username}</p>
                        <p>Password: {userData?.password}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegistrationPage;