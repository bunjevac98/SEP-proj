"use client"

import { signIn } from "next-auth/react";
import styles from "./loginForms.module.css";
import { useRouter } from "next/navigation";
import { hideLoader, showLoader } from "lib/lib/actions";

const LoginForm = () => {
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;


    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    hideLoader();
    if(result?.ok){
      router.replace('/account');
    }
    if (result?.error) {
      if(result.status === 401)
      // alert("Niste registrovani ili niste uneli tačnu lozinku");
      (document.getElementById('error_message')as HTMLSpanElement).textContent = 'Niste registrovani ili niste uneli tačnu lozinku';
      console.error(result.error);
    }
  };


  return (
    <form id="login_form" className={styles.login_form} onSubmit={handleSubmit}>
      <h1>PRIJAVA</h1>
      <label htmlFor="email" style={{marginTop:"auto"}}>
        Email:
      </label>
      <input type="email" id="email" name="email" required />
      <label htmlFor="password">Lozinka:</label>
      <input type="password" id="password" name="password" required />
      <span id="error_message" className={styles.error_message}></span>
      <button type="submit" className={styles.login_button}>
        Prijavi se
      </button>
    </form>
  );
};

export default LoginForm;
