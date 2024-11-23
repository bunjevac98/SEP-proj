import {
  formatNumber,
  getCategoryName,
  getProductDetails,
} from "lib/lib/actions";
import styles from "./page.module.css";
import Link from "next/link";
import Gallery from "lib/components/gallery/gallery";
import Image from "next/image";
import BuyButton from "lib/components/buyButton/buyButton";
import { Product, ProductImage } from "lib/lib/objects";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const ProductPage = async ({ params }: { params: { id: string } }) => {
  const productInfo: Product | null =
    (await getProductDetails(params.id)) || null;

  if (productInfo === null) {
    redirect("/");
  }

  const categoryName =
    typeof productInfo?.category === "string"
      ? productInfo.category
      : productInfo?.category?.name || "";

  const thisCat = await getCategoryName(categoryName);

  if (
    (!productInfo?.images || productInfo.images?.length === 0) &&
    productInfo.featureImage === undefined
  ) {
    productInfo.images = [
      {
        _id: "id_0",
        type: "image",
        localPath: "/images/logos/StoPak - logo.png",
        url: "/images/logos/StoPak - logo.png",
        originalname: "StoPak-logo-0.png",
        forMobile: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      },
      {
        _id: "id_1",
        type: "image",
        localPath: "/images/logos/StoPak - logo.png",
        url: "/images/logos/StoPak - logo.png",
        originalname: "StoPak-logo-1.png",
        forMobile: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      },
      {
        _id: "id_2",
        type: "image",
        localPath: "/images/logos/StoPak - logo.png",
        url: "/images/logos/StoPak - logo.png",
        originalname: "StoPak-logo-2.png",
        forMobile: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
      },
    ];
  }

  let images: ProductImage[] = productInfo.images || [];
  if (productInfo.featureImage) {
    images = [productInfo.featureImage, ...(productInfo.images || [])];
  }

  const title = `${
    (productInfo?.title && productInfo?.title.toUpperCase()) || ""
  } | Stopak Ambalaža`;
  const description = productInfo?.description;
  const keywords =
    "ambalaža, rešenja za ambalažu, ekološka ambalaža, visokokvalitetna ambalaža, pakovanje proizvoda, ambalaža za preduzeća, prodaja ambalaže, pakovanje za transport, ambalažni proizvodi, ekološki prihvatljiva ambalaža, karton i papirna ambalaža, plastična ambalaža, fleksibilna ambalaža, prilagođena ambalaža, ambalaža na veliko";
  const url = "https://stopakambalaza.com/";
  const ogImage =
    (images && images[0].url) || "/images/logos/StoPak - logo.svg";
  const ogType = "website";
  const themeColor = "#ffffff";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="theme-color" content={themeColor} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <main className={styles.product_page_container}>
        <div className={styles.product_page}>
          <div className={styles.category_strip}>
            <Link href="/">POČETNA</Link>
            <span>/</span>
            <Link href={`/kategorije/${encodeURIComponent(thisCat)}`}>
              {thisCat?.toUpperCase()}
            </Link>
            <span>/</span>
            <p>
              {(productInfo?.title && productInfo?.title.toUpperCase()) || ""}
            </p>
          </div>
          <div className={styles.product_info}>
            <Gallery images={images} />
            <div className={styles.product_basic_info}>
              <h1>{productInfo?.title}</h1>
              <h2 className={styles.product_id}>
                Šifra artikla: <span>{productInfo?.numOfArticle}</span>
              </h2>
              {/* <Link href="#description">OPIS PROIZVODA</Link> */}
              <div className={styles.product_description} id="description">
                <h2 id={styles.page_description_title}>OPIS PROIZVODA</h2>
                {productInfo?.description && (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: productInfo?.description,
                    }}
                  />
                )}
              </div>
              <div className={styles.product_price}>
                {productInfo.hasSizes && productInfo?.sizes ? (
                  <>
                    <span>BEZ PDV</span>
                    <table id="price_table1" className={styles.price_table}>
                      <thead>
                        <tr>
                          <th>VELIČINA</th>
                          <th>CENA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productInfo?.sizes.map((size, index) => (
                          <tr key={index+"no_pdv"}>
                            <td>{size.size}</td>
                            <td>{formatNumber(size.price)} RSD</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <>{formatNumber(productInfo?.price)}RSD + PDV</>
                )}
                <br />
                <br />

                {productInfo.hasSizes && productInfo?.sizes ? (
                  <>
                    <span>SA PDV</span>
                    <table id="price_table1" className={styles.price_table}>
                      <thead>
                        <tr>
                          <th>VELIČINA</th>
                          <th>CENA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productInfo?.sizes.map((size, index) => (
                          <tr key={index+"with_pdv"}>
                            <td>{size.size}</td>
                            <td>
                              {formatNumber(size.price + size.price * 0.2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <span>
                    {formatNumber(productInfo.price + productInfo.price * 0.2)}{" "}
                    RSD
                  </span>
                )}
              </div>
              <BuyButton productInfo={productInfo} image={images[0].url} />
              <span id="quantity_notice">{`* Ovaj proizvod se prodaje samo u pakovanjima od: ${productInfo?.quantity}`}</span>
            </div>
          </div>

          <div className={styles.similar_container}>
            <h2>SLIČNI PROIZVODI</h2>
            <div className={styles.similar_products}></div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductPage;
