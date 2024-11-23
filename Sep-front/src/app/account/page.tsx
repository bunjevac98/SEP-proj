import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "lib/lib/authOptions";
import {
  getAllCategories,
  getAllOrders,
  getAllProducts,
  getCustomerOrders,
} from "lib/lib/actions";
import AdminPage from "lib/components/accountPage/adminPage";
import styles from "./account.module.css";
import Link from "next/link";
import CustomerOrderItem from "lib/components/customerOrderItem/customerOrderItem";
import LogoutButton from "lib/components/accountPage/logoutButton";

const AccountPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "admin") {
    const products = await getAllProducts(999, 1);
    const categories = await getAllCategories();
    const allOrders = await getAllOrders();
    return (
      <>
          <title>Moj nalog | Stopak Ambalaža</title>

        <main className={styles.accountPage}>
          <LogoutButton user={session.user} />
          <AdminPage
            user={session?.user}
            products={products || []}
            categories={categories}
            allOrders={allOrders}
          />
        </main>
      </>
    );
  }

  const customerOrders = await getCustomerOrders(session.user.id);
  return (
    <>
        <title>Moj nalog | Stopak Ambalaža</title>
      <main className={styles.accountPage}>
        <div className={styles.customer_top_bar}>
          <h1>Dobrodošli</h1>
          <LogoutButton user={session.user} />
        </div>
        {/* <Link className={styles.home_button} href="/">POČETNA STRANICA</Link> */}
        <h2>Vaše prethodne kupovine</h2>
        <div className={styles.customer_middle_section}>
          {customerOrders.status === 404 ? (
            <h3>Još uvek niste kupovali kod nas.</h3>
          ) : (
            <div className={styles.customer_orders}>
              {customerOrders &&
                customerOrders?.data &&
                customerOrders.data?.paginatedData &&
                customerOrders.data.paginatedData?.map(
                  (order: any, index: any) => (
                    <div
                      className={styles.customer_order_container}
                      key={index}
                    >
                      <p>
                        Broj porudžbine: <span>{order.orderNumber}</span>
                      </p>
                      <p>
                        Cena: <span>{order.totalPrice}</span>RSD (bez PDV)
                      </p>
                      <p>
                        Napomena: <span>{order.description}</span>
                      </p>
                      <p>Prozvodi: </p>
                      <div className={styles.orders_container}>
                        {order.orderedProducts.map(
                          (product: any, index: any) => (
                            <CustomerOrderItem order={product} key={index} />
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default AccountPage;
