"use client"

import Link from "next/link";
import styles from "./page.module.css";
import { handleLogin } from "../../lib/actions";

export default function Home() {
  const login = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('merchant_id');
    const username = formData.get('username');
    const password = formData.get('password');
    const response = await handleLogin({ email: email, username: username, password: password });

    if (response.status === 200) {

    } else {
      alert("Desila se greška, nalog nije mogao biti pronadjen.");
    }
  }
  return (
    <div className={styles.page}>
      <h1>Dobrodošli</h1>
      <div className={styles.forms_container}>
        <form className={styles.formForm} onSubmit={handleLogin}>
          <h2>Ulogujte se</h2>
          <p>Pristupite svom korisničkom portalu.</p>
          <div className={`${styles.formContainer} ${styles.left}`}>
            <div>
              <label htmlFor="merchant_id">ID Prodavca (Merchant ID)</label>
              <input id="merchand_id" type="text" name="merchant_id" required />
            </div>
            <div>
              <label htmlFor="username">Korisničko ime (username)</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div>
              <label htmlFor="password">Lozinka (password)</label>
              <input type="password" name="password" required />
            </div>
            <button type="submit">PRIJAVI SE</button>
          </div>
        </form>
        <div className={styles.formForm}>
          <h2>Registrujte nalog</h2>
          <p>Kreirajte svoj administrativni nalog i pristupite našem asortimanu usluga.</p>
          <div className={`${styles.formContainer} ${styles.rightBottom}`}>
            <Link href="/registration">
              <button>REGISTRUJ SE</button>
            </Link>
          </div>
        </div>
      </div>
    </div >
  );
}
