"use client";

import { useState } from "react";
import AdminProductCard from "../adminProductCard/adminProductCard";
import styles from "./adminPage.module.css";
import { Product, User } from "lib/lib/objects";
import Image from "next/image";
import { Popconfirm } from "antd";
import {
  createCategory,
  deleteCategory,
  formatNumber,
  updateCategory,
} from "lib/lib/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AdminPage = ({
  user,
  products,
  categories,
  allOrders,
}: {
  user: User;
  products: Product[];
  categories: any;
  allOrders: any;
}) => {
  const router = useRouter();
  const [allProducts, setAllProducts] = useState(products);
  const [allCategories, setAllCategories] = useState(categories);
  const [allMadeOrders, setAllMadeOrders] = useState(allOrders);
  const [viewing, setViewing] = useState("products");
  const [status, setStatus] = useState("");

  const handleCategoryChange = async (action: string, category_id: string) => {
    if (action === "edit") {
      const newName = (
        document.getElementById(`cateogry-${category_id}`) as HTMLInputElement
      ).value;
      const newDesc = (
        document.getElementById(`cateogry-desc-${category_id}`) as HTMLTextAreaElement
      ).value;

      const response = await updateCategory(category_id, newName, newDesc);
      if (response.status === 200) {
        alert("USPEŠNO POSTAVLJENO IME: " + newName +"\n"+"UZ OPIS: " + newDesc);
        router.refresh();
      } else {
        alert("Nismo uspeli da izmenimo naziv kategorije");
      }
    } else if (action === "delete") {
      const response = await deleteCategory(category_id);
      if (response.status === 200) {
        alert("Uspesno ste obrisali kategoriju!");
        router.refresh();
      } else {
        alert("Ketagorija nije mogla biti izbrisana!");
      }
    }
  };

  const handleViewSwitch = () => {
    const viewingProd = (
      document.getElementById("products_switch") as HTMLInputElement
    ).checked;
    if (viewingProd) {
      setViewing("products");
    } else {
      setViewing("categories");
    }
  };

  const handleProductSearch = () => {
    const searchTerm = (
      document.getElementById("product_search") as HTMLInputElement
    ).value;
    if (searchTerm !== "") {
      const filteredProducts = products.filter((e: Product) =>
        e.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setAllProducts(filteredProducts);
    } else {
      setAllProducts(products);
    }
  };

  const handleCategorySearch = () => {
    const searchTerm = (
      document.getElementById("categories_search") as HTMLInputElement
    ).value;
    if (searchTerm !== "") {
      const filteredCategories = categories.filter((e: any) =>
        e.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setAllCategories(filteredCategories);
    } else {
      setAllCategories(categories);
    }
  };

  const handleCategoryCreate = async () => {
    const searchTerm = (
      document.getElementById("categories_search") as HTMLInputElement
    ).value;

    const categoryExists =
      categories?.length > 0
        ? categories.some(
          (category: any) =>
            category.name.toLowerCase() === searchTerm.toLowerCase()
        )
        : false;

    if (categoryExists) {
      alert("Kategorija sa ovim imenom već postoji!");
      return; // Prevent further execution if the category exists
    }

    if ((await createCategory(searchTerm)) === 200) {
      alert("Uspesno kreirana kategorija: " + searchTerm);
      window.location.reload();
    } else {
      alert("Kategorija nije kreirana, probajte da pretrazite!");
    }
  };

  return (
    <>
      <h1>ADMIN PANEL</h1>
      <div className={styles.cat_prod_switch}>
        <div>
          <label
            htmlFor="products_switch"
            className={`${styles.switch_label} ${viewing === "products" ? styles.active : ""
              }`}
          >
            Proizvodi
            <input
              type="radio"
              id="products_switch"
              name="prod_cat"
              onChange={() => handleViewSwitch()}
              defaultChecked
            />
          </label>
        </div>
        <div>
          <label
            htmlFor="cat_switch"
            className={`${styles.switch_label} ${viewing === "categories" ? styles.active : ""
              }`}
          >
            Kategorije
            <input
              type="radio"
              id="cat_switch"
              name="prod_cat"
              onChange={() => handleViewSwitch()}
            />
          </label>
        </div>
      </div>
      <div
        className={`${styles.productsContainer} ${viewing === "products" ? styles.active : ""
          }`}
      >
        <h2>Proizvodi</h2>
        <div className={styles.search_container}>
          <input
            type="text"
            id="product_search"
            className={styles.search_field}
            placeholder="Pretražite proizvode"
          />
          <button
            type="button"
            className={styles.search_button}
            onClick={() => {
              handleProductSearch();
            }}
          >
            PRETRAŽI
          </button>
          <Link
            className={styles.search_button}
            href={`/account/create-product`}
          >
            KREIRAJ
          </Link>
        </div>
        {allProducts?.length > 0 ? (
          allProducts.map((product) => (
            <div key={product._id}>
              <AdminProductCard product={product} user={user} />
            </div>
          ))
        ) : (
          <h2>NEMATE PROIZVODA</h2>
        )}
      </div>
      <div
        className={`${styles.categoriesContainer} ${viewing === "categories" ? styles.active : ""
          }`}
      >
        <h2>Kategorije</h2>
        <div className={styles.search_container}>
          <input
            type="text"
            id="categories_search"
            className={styles.search_field}
            placeholder="Pretražite kategorije"
          />
          <button
            type="button"
            className={styles.search_button}
            onClick={() => {
              handleCategorySearch();
            }}
          >
            PRETRAŽI
          </button>
          <button
            type="button"
            className={styles.search_button}
            title="Klikom na ovo dugme se kreira kategorija koja je upisana u polje"
            onClick={() => {
              handleCategoryCreate();
            }}
          >
            KREIRAJ
          </button>
        </div>

        {allCategories?.length > 0 ? (
          <table className={styles.categoriesTable}>
            <thead>
              <tr>
                <th>Redni br.</th>
                <th>Kategorija</th>
                <th>Radnje</th>
              </tr>
            </thead>
            <tbody className={styles.category_table}>
              {allCategories.map((category: any, index: number) => (
                <tr key={category._id}>
                  <td>{index + 1}</td>
                  <td className={styles.category_info}>
                    <input
                      type="text"
                      defaultValue={category?.name || "Nismo nasli ime"}
                      id={`cateogry-${category?._id}`}
                    />
                    <textarea
                      id={`cateogry-desc-${category?._id}`}
                      defaultValue={category?.description || ""}
                    />

                  </td>
                  <td>
                    <Popconfirm
                      title="Da li želite da sačuvate novo ime i opis ove kategorije?"
                      onConfirm={() =>
                        handleCategoryChange("edit", category._id)
                      }
                    >
                      <Image
                        src="\images\icons\edit-icon.svg"
                        alt="Edit"
                        width={30}
                        height={30}
                      />
                    </Popconfirm>

                    <Popconfirm
                      title="Da li sigurno želite da obrišete ovu kategoriju? Molimo pobrinite se da nemate ni jedan proizvod u ovoj kategoriji kako ne bi doslo do neočekivanih ishoda."
                      onConfirm={() => {
                        handleCategoryChange("delete", category._id);
                      }}
                    >
                      <Image
                        src="\images\icons\trash-icon.svg"
                        width={30}
                        height={30}
                        alt="delete icon"
                      />
                    </Popconfirm>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h2>NEMATE KATEGORIJA</h2>
        )}
      </div>
      <div className={styles.all_orders_container}>
        <h2>PORUDŽBINE</h2>
        {/* <div className={styles.all_orders}> */}
        {allMadeOrders && allMadeOrders.length > 0 && (
          <>
            {/* Map over other orders */}
            <h3>Porudzbine na cekanju</h3>
            <div className={styles.all_orders}>
              {allMadeOrders
                .filter((order: any) => order.status !== "Delivered")
                .map((order: any, index: number) => (
                  <div
                    className={styles.orderCard}
                    key={`other_order_${index}`}
                  >
                    <p>Broj porudžbine: {order.orderNumber}</p>
                    <p>Status porudžbine: {order.status}</p>
                    <p>
                      {order.orderedProducts?.length} poručeni(h) proizvod(a)
                    </p>
                    <p>
                      Ukupna cena: {formatNumber(parseInt(order.totalPrice))}
                    </p>
                    <Link href={`/order-details/${order._id}`}>
                      Saznaj više
                    </Link>
                  </div>
                ))}
            </div>
            {/* Map over Delivered orders */}
            <h3>Izvrsene proudzbine</h3>
            <div className={styles.all_orders}>
              {allMadeOrders
                .filter((order: any) => order.status === "Delivered")
                .map((order: any, index: number) => (
                  <div
                    className={styles.orderCard}
                    key={`delivered_order_${index}`}
                  >
                    <p>Broj porudžbine: {order.orderNumber}</p>
                    <p>Status porudžbine: {order.status}</p>
                    <p>
                      {order.orderedProducts?.length} poručeni(h) proizvod(a)
                    </p>
                    <p>
                      Ukupna cena: {formatNumber(parseInt(order.totalPrice))}
                    </p>
                    <Link href={`/order-details/${order._id}`}>
                      Saznaj više
                    </Link>
                  </div>
                ))}
            </div>
          </>
        )}
        {/* </div> */}
      </div>
    </>
  );
};

export default AdminPage;
