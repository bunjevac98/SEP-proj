"use client";

import { Popconfirm } from "antd";
import styles from "./removeOrderButton.module.css";
import { completeOrder, deleteOrder } from "lib/lib/actions";
import { useRouter } from "next/navigation";

const RemoveOrderButton = ({
  orderId,
  done,
}: {
  orderId: string;
  done?: boolean;
}) => {
    const router = useRouter();
  const handleDeleteOrder = async () => {
    const response = await deleteOrder(orderId);
    if (response.status === 200) {
      alert("Porudžbina je uspešno obrisana!");
      window.location.replace('/account');
    } else {
      alert("Desila se greška, porudžbina nije mogla biti obrisana!");
    }
  };

  const handleFinishOrder = async () => {
    const response = await completeOrder(orderId);
    if (response.status === 200) {
      alert("Porudžbina je uspešno završena!");
      router.refresh();
    } else {
      alert("Desila se greška, porudžbina nije mogla biti završena!");
    }
  };

  return (
    <div className={styles.button_container}>
      {!done && (
        <button
          className={styles.finish_button}
          onClick={() => handleFinishOrder()}
        >
          Označi kao završeno
        </button>
      )}
      <Popconfirm
        title="Da li sigurno želite da obrišete ovu porudžbinu?"
        onConfirm={() => {
          handleDeleteOrder();
        }}
      >
        <button className={styles.delete_button}>Obriši porudžbinu</button>
      </Popconfirm>
    </div>
  );
};

export default RemoveOrderButton;
