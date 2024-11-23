"use client";

import { Product, User } from "lib/lib/objects";
import styles from "./editProductModule.module.css";
import { updateProduct } from "lib/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EditProductModule = ({
  product,
  categories,
  user,
}: {
  product?: Product;
  categories: any;
  user: User;
}) => {
  const router = useRouter();
  const [hasSizes, setHasSizes] = useState(product?.hasSizes);
  const [numberOfSizes, setNumberOfSizes] = useState(
    product?.sizes?.length || 0
  );

  const handleUpdateProduct = async () => {
    const data: any = {
      _id: product?._id || "",
      title: (document.getElementById("input-title") as HTMLInputElement).value,
      description: (
        document.getElementById("input-description") as HTMLTextAreaElement
      ).value,
      price: parseFloat(
        (document.getElementById("input-price") as HTMLInputElement)?.value || '0'
      ).toFixed(2),
      isPopular: (
        document.getElementById("input-is-popular") as HTMLInputElement
      ).checked,
      format: "prodaja",
      quantity: parseFloat(
        (document.getElementById("input-quantity") as HTMLInputElement).value
      ),
      category: (
        document.getElementById("select-category") as HTMLSelectElement
      ).value.toString(),
    };
    if (hasSizes) {
      const sizes = [];
      const numberOfInstances = document.querySelectorAll(
        `.${styles.sizeInputInstance}`
      ).length;

      for (let i = 0; i < numberOfInstances; i++) {
        const sizeText = (
          document.getElementById(`size-text-${i}`) as HTMLInputElement
        ).value;

        const sizePrice = (
          document.getElementById(`size-price-${i}`) as HTMLInputElement
        ).value;
        if (sizeText !== "" && sizePrice !== "") {
          sizes.push({
            size: sizeText,
            price: parseFloat(sizePrice),
          });
        }
      }
      if(sizes.length === 0){
        alert("Morate uneti bar jednu velicinu ukoliko naznačite da je proizvod dostupan u veličinama!");
        return;
      }
      data.sizes = sizes;
      data.hasSizes = true;
    }else{
      data.hasSizes=false;
      data.sizes=[];
    }

    await updateProduct(data, user.token).then((result) => {
      if (result === true) {
        alert("Proizvod je uspešno izmenjen");
        // router.refresh();
        window.location.href=("/account");
      } else {
        alert("Proizvod nije izmenjen!");
      }
    });
  };

  const handleAddSizeInput = () => {
    if (numberOfSizes === 0) {
      setNumberOfSizes(numberOfSizes + 1);
      return;
    }
    const numberOfInstances = document.querySelectorAll(
      `.${styles.sizeInputInstance}`
    ).length;

    if (
      (
        document.getElementById(
          `size-text-${numberOfInstances - 1}`
        ) as HTMLInputElement
      ).value == "" ||
      (
        document.getElementById(
          `size-price-${numberOfInstances - 1}`
        ) as HTMLInputElement
      ).value == ""
    ) {
      alert(
        "Morate uneti tekst i cenu za poslednju veličinu pre nego što možete dodati novu"
      );
      return;
    }
    setNumberOfSizes(numberOfSizes + 1);
  };

  return (
    <div className={styles.productModule}>
      <h1>{product?.title || "Novi proizvod"}</h1>

      <div className={styles.LabelInput}>
        <label htmlFor="input-title">Naziv</label>
        <input
          type="text"
          id="input-title"
          className={styles.inputText}
          defaultValue={product?.title}
          placeholder="Naziv"
        />
      </div>

      <div className={styles.LabelInput}>
        <label htmlFor="input-description">Opis</label>
        <textarea
          className={styles.textArea}
          id="input-description"
          defaultValue={product?.description}
          placeholder="Opis"
        ></textarea>
      </div>

      <div className={styles.LabelInput} style={{ flexDirection: "row" }}>
        <input
          type="checkbox"
          id="input-has-sizes"
          style={{ width: "fit-content" }}
          defaultChecked={hasSizes}
          onChange={(e) => setHasSizes(e.target.checked)}
        />
        <label htmlFor="input-has-sizes">Dostupno u veličinama?</label>
      </div>

      {!hasSizes && (
        <div className={styles.LabelInput}>
          <label htmlFor="input-price">
            Cena BEZ PDV. <br />
          </label>
          <input
            type="text"
            id="input-price"
            className={styles.inputText}
            placeholder="Cena"
            defaultValue={product?.price}
          />
        </div>
      )}

      {hasSizes && (
        <div className={styles.LabelInput}>
          <div className={styles.sizesInputContainer}>
            <button
              className={styles.submitButton}
              onClick={() => {
                handleAddSizeInput();
              }}
            >
              Dodaj veličinu
            </button>
            <span className={styles.descriptionSpan}>
              Sačuvaćemo samo veličine koje imaju i naziv i cenu ukoliko želite da obrišete veličinu, samo ostavite prazna polja.
            </span>

            {(() => {
              const divs = [];
              for (let i = 0; i < numberOfSizes; i++) {
                divs.push(
                  <div
                    className={`${styles.LabelInput} ${styles.sizeInputInstance}`}
                    key={`size-${i}`}
                    id={`size-${i}`}
                  >
                    <label htmlFor="input-sizes">Veličina {i+1}</label>
                    <input
                      type="text"
                      id={`size-text-${i}`}
                      className={styles.inputText}
                      placeholder="Veličina"
                      defaultValue={
                        (product?.sizes && product?.sizes[i]?.size) || ""
                      }
                    />
                    <input
                      type="number"
                      min={1}
                      id={`size-price-${i}`}
                      placeholder="Cena"
                      defaultValue={
                        (product?.sizes && product?.sizes[i]?.price) || ""
                      }
                    />
                    <button
                      className={styles.submitButton}
                      onClick={() => {
                        (
                          document.getElementById(
                            `size-text-${i}`
                          ) as HTMLInputElement
                        ).value = "";
                        (
                          document.getElementById(
                            `size-price-${i}`
                          ) as HTMLInputElement
                        ).value = "";
                      }}
                    >
                      Reset
                    </button>
                  </div>
                );
              }
              return (<div className={styles.sizesContainer}>{divs}</div>);
            })()}
          </div>
        </div>
      )}

      <div className={styles.LabelInput}>
        <label htmlFor="input-quantity">Minimum proizvoda</label>
        <input
          type="number"
          min={1}
          className={styles.inputText}
          id="input-quantity"
          defaultValue={product?.quantity}
          placeholder="Minimum proizvoda"
          onChange={(e) => {
            if (e.target.value === "0") {
              e.target.value = "1";
            }
          }}
        />
      </div>

      <div className={styles.LabelInput} style={{ flexDirection: "row" }}>
        <input
          type="checkbox"
          id="input-is-popular"
          style={{ width: "fit-content" }}
          defaultChecked={product?.isPopular}
        />
        <label htmlFor="input-is-popular">Popularan</label>
      </div>

      <div className={styles.LabelInput}>
        <label htmlFor="select-category">Kategorija</label>
        <select id="select-category">
          {categories ? (
            categories.map((category: any) => (
              <option value={category._id} key={`${category._id}`}>
                {`${category.name
                  .toString()
                  .charAt(0)
                  .toUpperCase()}${category.name.slice(1)}`}
              </option>
            ))
          ) : (
            <option disabled>NEMA KATEGORIJA</option>
          )}
        </select>
      </div>

      <button
        className={styles.submitButton}
        disabled={!categories}
        onClick={() => handleUpdateProduct()}
      >
        SAČUVAJ
      </button>
    </div>
  );
};

export default EditProductModule;
