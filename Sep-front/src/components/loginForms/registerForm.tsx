"use client";

import { FormEvent, useState } from "react";
import styles from "./loginForms.module.css";
import { registerUser } from "lib/lib/actions";

const RegisterForm = ({ type }: { type: string }) => {
  const [isCompany, setIsCompany] = useState(false);

  const handleRegister = async (e: FormEvent) => {

    e.preventDefault();
    const password = (document.getElementById('form_password') as HTMLInputElement).value;
    const rePassword = (document.getElementById('repeat-password') as HTMLInputElement).value;
    const registerForm = (document.getElementById('register_form') as HTMLFormElement);

    if (password !== rePassword) {
      alert("Lozinke se ne podudaraju");
      return;
    }

    const registerData = {
      email: (document.getElementById('form_email') as HTMLInputElement).value,
      password: password,
      firstName: (document.getElementById('first_name') as HTMLInputElement).value,
      lastName: (document.getElementById('last_name') as HTMLInputElement).value,
      role: "customer",
      phone: (document.getElementById('form_phone') as HTMLInputElement).value,
      userType: isCompany?"company":"customer",
      authType: "basic",
      address: (document.getElementById('form-address') as HTMLInputElement).value,
      PIB: (document.getElementById('company_PIB') as HTMLInputElement).value,
      companyName: (document.getElementById('company_name') as HTMLInputElement).value
    }

    const response = await registerUser(registerData);
    if (response.status === 201){
      registerForm.reset();
    }
    alert(response.message);
  };

  return (
    <form id="register_form" className={styles.register_form} onSubmit={(e) => handleRegister(e)}>
      <h2>REGISTRACIJA</h2>
      <div
        className={`${styles.company_details}`}
      >
        <label htmlFor="first_name">Ime</label>
        <input
          type="text"
          id="first_name"
          name="first name"
          required
        />
        <label htmlFor="last_name">Prezime</label>
        <input
          type="text"
          id="last_name"
          name="last name"
          required
        />
        <label htmlFor="form-address">Adresa</label>
        <input
          type="text"
          id="form-address"
          name="address"
          required
        />
      </div>
      <label htmlFor="company_phone">Telefon</label>
        <input
          type="text"
          id="form_phone"
          name="phone"
          required
        />
      <label htmlFor="form_email">Email</label>
      <input type="email" id="form_email" name="email" required />
      <label htmlFor="form_password">Lozinka</label>
      <input type="password" id="form_password" name="password" required />
      <label htmlFor="repeat-password">Potvrdi lozinku</label>
      <input
        type="password"
        id="repeat-password"
        name="repeat-password"
        required
      />
      <div
        className={`${styles.company_details} ${!isCompany && styles.hidden}`}
      >
        <label htmlFor="company_name">Naziv kompanije</label>
        <input
          type="text"
          id="company_name"
          name="company_name"
          required={isCompany ? true : false}
        />
        {/* <label htmlFor="company_address">Adresa kompanije</label>
        <input
          type="tel"
          id="company_address"
          name="address"
          required={isCompany ? true : false}
        /> */}
        {/* <label htmlFor="company_phone">Telefon kompanije</label>
        <input
          type="text"
          id="company_phone"
          name="phone"
          required={isCompany ? true : false}
        /> */}
        <label htmlFor="company_PIB">PIB</label>
        <input
          type="text"
          id="company_PIB"
          name="PIB"
          required={isCompany ? true : false}
        />
      </div>
      <span id="error_message" className={styles.error_message}></span>
      <button type="submit" className={styles.login_button}>
        Registruj se
      </button>
      <button
        type="button"
        className={styles.login_button}
        onClick={() => setIsCompany(!isCompany)}
      >
        {!isCompany ? "Registruj se kao firma" : "Registruj se kao fizičko lice"}
      </button>
    </form>
  );
};

export default RegisterForm;
