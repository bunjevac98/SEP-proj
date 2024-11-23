"use client";

import { Product } from "lib/lib/objects";
import styles from "./createProductModule.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProduct } from "lib/lib/actions";
import { useSession } from "next-auth/react";

const CreateProductModule = ({ categories }: { categories: any }) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [hasSizes, setHasSizes] = useState(false);
  const [numberOfSizes, setNumberOfSizes] = useState(0);

  const router = useRouter();
  const token = useSession().data?.user.token || "";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (selectedImages.length + files.length <= 5) {
        setSelectedImages([...selectedImages, ...files]);
      } else {
        alert("Možete dodati najviše 5 slika.");
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (selectedImages.length + files.length <= 5) {
      setSelectedImages([...selectedImages, ...files]);
    } else {
      alert("Možete dodati najviše 5 slika.");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async () => {
    const formData = new FormData();

    formData.append(
      "title",
      (document.getElementById("input-title") as HTMLInputElement).value
    );
    formData.append(
      "description",
      (document.getElementById("input-description") as HTMLTextAreaElement)
        .value
    );
    formData.append(
      "price",
      parseFloat(
        (document.getElementById("input-price") as HTMLInputElement)?.value || '0'
      )
        .toFixed(2)
        .toString()
    );
    formData.append(
      "isPopular",
      (
        document.getElementById("input-is-popular") as HTMLInputElement
      ).checked.toString()
    );
    formData.append("format", "prodaja");
    formData.append(
      "quantity",
      parseFloat(
        (document.getElementById("input-quantity") as HTMLInputElement).value
      ).toString()
    );
    formData.append(
      "category",
      (document.getElementById("select-category") as HTMLSelectElement).value
    );

    if (selectedImages.length > 0) {
      selectedImages.forEach((image, index) => {
        formData.append(`images`, image);
      });
    } else {
      alert("Morate dodati barem jednu sliku");
      return;
    }

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
        formData.append("sizes", JSON.stringify(sizes));
        formData.append('hasSizes', JSON.stringify(true));
      }else{
        formData.append("sizes", JSON.stringify([]));
        formData.append('hasSizes', JSON.stringify(false));
      }

    const response: any = await createProduct(formData, token);
    if (response.status === 200) {
      alert("Proizvod uspešno kreiran");
      window.location.href = "/account";
    }
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
      <h1>{"Novi proizvod"}</h1>

      <div className={styles.LabelInput}>
        <label htmlFor="input-title">Naziv</label>
        <input
          type="text"
          id="input-title"
          className={styles.inputText}
          placeholder="Naziv"
        />
      </div>

      {/* <div className={styles.LabelInput}>
                <label htmlFor="input-product-number">Broj proizvoda (šifra)</label>
                <input type="text" id="input-product-number" className={styles.inputText}  placeholder="Broj proizvoda (šifra)" />
            </div> */}

      <div className={styles.LabelInput}>
        <label htmlFor="input-description">Opis</label>
        <textarea
          className={styles.textArea}
          id="input-description"
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
              Sačuvaćemo samo veličine koje imaju i naziv i cenu ukoliko želite
              da obrišete veličinu, samo ostavite prazna polja.
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
                    <label htmlFor="input-sizes">Veličina {i + 1}</label>
                    <input
                      type="text"
                      id={`size-text-${i}`}
                      className={styles.inputText}
                      placeholder="Veličina"
                    />
                    <input
                      type="number"
                      min={1}
                      id={`size-price-${i}`}
                      placeholder="Cena"
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
              return <div className={styles.sizesContainer}>{divs}</div>;
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
          placeholder="Minimum proizvoda"
          onChange={(e) => {
            if (e.target.value === "0") {
              e.target.value = "1";
            }
          }}
        />
      </div>

      <div className={styles.LabelInput} style={{ flexDirection: "row" }}>
        <label htmlFor="input-is-popular">
          Popularan
          <br />
          <span style={{ fontSize: "12px" }}>
            (max. 9 proizvoda koji će se prikazati na početnoj stranici)
          </span>
        </label>
        <input
          type="checkbox"
          id="input-is-popular"
          style={{ width: "fit-content" }}
        />
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

      {/* IMAGE UPLOAD */}

      <div className={`${styles.LabelInput} ${styles.image_input_container}`}>
        <label>Fotografije (max 5)</label>
        <div
          className={styles.imageDropZone}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <p>Prevucite slike ovde ili kliknite da biste ih dodali</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className={styles.inputFile}
          />
          <div className={styles.imagePreviewContainer}>
            {selectedImages.map((image, index) => (
              <div key={index} className={styles.imagePreview}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`selected ${index}`}
                />
                <button onClick={() => removeImage(index)}>Ukloni</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        className={styles.submitButton}
        type="button"
        disabled={!categories}
        onClick={() => handleFormSubmit()}
      >
        SAČUVAJ
      </button>
    </div>
  );
};

export default CreateProductModule;
