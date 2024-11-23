"use client";

import { useCart } from "lib/context/cartContext";
import styles from "./page.module.css";
import CartItem from "lib/components/cart/cartItem/cartItem";
import { cartItem } from "lib/lib/objects";
import { useSession } from "next-auth/react";
import { FormEvent, FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { hideLoader, showLoader, signedOrder, unsignedOrder } from "lib/lib/actions";

const CheckoutPage = () => {
  const { state, clearCart } = useCart();
  const user = useSession().data?.user;
  const router = useRouter();
  const [isCompany, setIsCompany] = useState(false);
  const [loading, setLoading] = useState(false);

  if (state.items.length === 0) {
    router.replace("/");
  }

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const note = (document.getElementById("order_note") as HTMLTextAreaElement)
      .value;
    setLoading(true);
    showLoader();

    if (user) {
      const response = await signedOrder(user.id, note, state.items);
      setLoading(false);
      hideLoader();
      if (response.status === 201) {
        alert("Porudzbina uspesna. Proverite svoj mejl!");
        clearCart();
        router.replace("/");
      } else {
        alert("Desila se greška, Vaša porudžbina nije kreirana!");
      }
    } else {
      let response, tempUser;
      const address = (
        document.getElementById("form-address") as HTMLInputElement
      ).value;
      const firstName = (
        document.getElementById("first_name") as HTMLInputElement
      ).value;
      const lastName = (
        document.getElementById("last_name") as HTMLInputElement
      ).value;
      const email = (document.getElementById("form_email") as HTMLInputElement)
        .value;
      const PIB = (document.getElementById("company_PIB") as HTMLInputElement)
        .value;
      const companyName = (
        document.getElementById("company_name") as HTMLInputElement
      ).value;
      const phone = (document.getElementById("phone") as HTMLInputElement)
        .value;

      if (isCompany) {
        tempUser = {
          email: email,
          firstName: firstName,
          lastName: lastName,
          address: address,

          companyName: companyName,
          phone: [phone],
          PIB: PIB,
        };
        response = await unsignedOrder(note, state.items, tempUser, isCompany);
      } else {
        tempUser = {
          email: email,
          firstName: firstName,
          lastName: lastName,
          address: address,
          phone: [phone],
        };

        response = await unsignedOrder(note, state.items, tempUser, isCompany);
      }
      setLoading(false);
      hideLoader();
      if (response.status === 201) {
        alert("Porudzbina uspesna. Proverite svoj mejl!");
        clearCart();
        router.replace("/");
      } else {
        alert("Desila se greška, Vaša porudžbina nije kreirana!");
      }
    }
  };

  return (
    <>
      <title>Poručivanje | Stopak Ambalaža</title>
      <main id="checkout-page" className={styles.checkout_page_container}>
        <h1>Poručivanje</h1>
        <div className={styles.checkout_page}>
          <div className={styles.left_checkout_container}>
            <h2>Vaša korpa</h2>
            <div className={styles.left_cart_items_container}>
              {state.items.map((cartItem: cartItem) => (
                <CartItem item={cartItem} key={cartItem.id} />
              ))}
            </div>
          </div>
          <form
            className={styles.right_checkout_container}
            onSubmit={handleCheckout}
          >
            {!user ? (
              <>
                <h2>Vaše informacije</h2>

                <label htmlFor="first_name">Ime</label>
                <input type="text" id="first_name" name="first name" required />
                <label htmlFor="last_name">Prezime</label>
                <input type="text" id="last_name" name="last name" required />
                <label htmlFor="form-address">Adresa</label>
                <input type="text" id="form-address" name="address" required />
                <label htmlFor="phone">Telefon</label>
                <input type="text" id="phone" name="phone" />
                <label htmlFor="form_email">Email:</label>
                <input type="email" id="form_email" name="email" required />
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    id="as_company_switch"
                    style={{ margin: "0 6px 0 0" }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setIsCompany(e.target.checked);
                    }}
                  />
                  <label htmlFor="as_company_switch">
                    <strong>Poručujem kao firma</strong>
                  </label>
                </div>
                <p>Za firme:</p>
                <label htmlFor="company_name">Naziv kompanije</label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  disabled={!isCompany}
                />
                {/* <label htmlFor="company_address">Adresa kompanije</label>
                <input
                  type="tel"
                  id="company_address"
                  name="address"
                /> */}
                {/* <label htmlFor="company_phone">Telefon kompanije</label>
                <input
                  type="text"
                  id="company_phone"
                  name="phone"
                /> */}
                <label htmlFor="company_PIB">PIB</label>
                <input
                  type="text"
                  id="company_PIB"
                  name="PIB"
                  disabled={!isCompany}
                />
                <label htmlFor="order_note">Napomena</label>
                <textarea id="order_note" />
                <button type="submit" className={styles.submit_button}>
                  PORUČI
                </button>
              </>
            ) : (
              <>
                <h3>Podaci sa vašeg profila će biti iskorišteni</h3>
                <label htmlFor="order_note">Napomena</label>
                <textarea id="order_note" />
                <button
                  type="submit"
                  disabled={
                    state.items?.length === 0 || state.totalPrice < 2000
                  }
                  style={{
                    cursor:
                      state.items?.length === 0 || state.totalPrice < 2000
                        ? "not-allowed"
                        : "pointer",
                  }}
                  className={styles.submit_button}
                >
                  {loading ? (
                    <div className={styles.loader}></div>
                  ) : state.items?.length === 0 || state.totalPrice < 2000 ? (
                    "MINIMUM 2000 rsd"
                  ) : (
                    "PORUČI"
                  )}
                </button>
              </>
            )}
          </form>
        </div>
      </main>
    </>
  );
};

export default CheckoutPage;
