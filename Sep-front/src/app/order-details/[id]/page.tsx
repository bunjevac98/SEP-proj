import { formatNumber, getOrderDetails } from "lib/lib/actions";
import styles from "./page.module.css";
import { Product } from "lib/lib/objects";
import Image from "next/image";
import { Popconfirm } from "antd";
import RemoveOrderButton from "../../../components/removeEditOrder/removeOrderButton";
import { redirect } from "next/navigation";

const OrderDetailsPage = async ({ params }: { params: { id: string } }) => {
  const orderDetails = await getOrderDetails(params.id);
  const isCompleted = orderDetails.status === "Delivered";

  if (
    !orderDetails ||
    !(orderDetails.customer_id || orderDetails.customer) ||
    !orderDetails.orderedProducts
  ) {
    redirect("/account");
  }

  return (
    <>
      <title>Detalji porudžbine | Stopak Ambalaža</title>
      <main className={styles.order_details_page}>
        <h1>
          Detalji porudžbine {orderDetails.orderNumber}{" "}
          {isCompleted && "(IZVRŠENO)"}
        </h1>

        <div className={styles.customer_details_container}>
          <h2>Podaci o kupcu:</h2>
          <p>
            Ime: {orderDetails?.customer_id?.firstName || orderDetails.customer?.firstName}{" "}
            {orderDetails?.customer_id?.lastName || orderDetails.customer?.lastName}
          </p>
          <p>Adresa: {orderDetails?.customer_id?.address || orderDetails?.customer?.address}</p>
          <p>Email: {orderDetails?.customer_id?.email || orderDetails?.customer?.email}</p>
          <p>Broj telefona: {orderDetails?.customer_id?.phone[0] || orderDetails?.customer?.phone[0]}</p>
          <p>
            Vrsta kupca:{" "}
            {((orderDetails?.customer_id?.companyName &&
            orderDetails?.customer_id?.PIB) || orderDetails?.customer?.companyName)
              ? "Firma"
              : "Fizičko lice"}
          </p>
          {((orderDetails?.customer_id?.companyName &&
            orderDetails?.customer_id?.PIB) || orderDetails?.customer?.companyName) && (
              <>
                <p>Naziv firme: {orderDetails?.customer_id?.companyName || orderDetails?.customer?.companyName}</p>
                <p>PIB: {orderDetails?.customer_id?.PIB || orderDetails?.customer?.PIB}</p>
              </>
            )}
          <h3>
            Ukupna cena:{" "}
            <span>{formatNumber(parseFloat(orderDetails.totalPrice))} RSD</span>
          </h3>
          <RemoveOrderButton orderId={params.id} done={isCompleted} />
        </div>
        <div className={styles.item_list_container}>
          <h2>Poručeni proizvodi</h2>
          {orderDetails.orderedProducts.map((item: any) => (
            <div key={item._id} className={styles.order_item}>
              <Image
                src={item.productId?.featureImage?.url || "/images/logos/StoPak - logo.png"}
                alt="product image"
                width={75}
                height={75}
              />
              <div>
                <p>{item.productId?.title || "NEDOSTUPNO"}</p>
                <p>Količina: {item?.quantity || "NEDOSTUPNO"}</p>
                <p>
                  Cena: {item?.quantity && item?.productId?.price ? (item?.quantity * item?.productId?.price).toFixed(2) : "NEDOSTUPNO"} rsd
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default OrderDetailsPage;
