import Image from "next/image";
import styles from "./page.module.css";
import { getPopularProducts, getRandomProducts } from "lib/lib/actions";
import ProductCard from "lib/components/productCard/productCard";
import Link from "next/link";
import Hero from "lib/components/hero/hero";
import { getServerSession } from "next-auth";
import Head from "next/head";

export default async function Home() {
  const session = await getServerSession();

  const title = "Početna | Stopak Ambalaža";
  const description =
    "Dobrodošli na zvanični web shop Stopak Ambalaže! Istražite naš široki asortiman visokokvalitetnih rešenja za ambalažu, uključujući ekološke opcije za preduzeća svih veličina. Pregledajte naše kategorije i pronađite savršene proizvode za ambalažu koji odgovaraju vašim potrebama.";
  const keywords =
    "stopak, ambalaža, rešenja za ambalažu, ekološka ambalaža, visokokvalitetna ambalaža, pakovanje proizvoda, ambalaža za preduzeća, prodaja ambalaže, pakovanje za transport, ambalažni proizvodi, ekološki prihvatljiva ambalaža, karton i papirna ambalaža, plastična ambalaža, fleksibilna ambalaža, prilagođena ambalaža, ambalaža na veliko";
  const url = "https://stopakambalaza.com/";
  const ogImage = "/images/logos/StoPak - logo.svg";
  const ogType = "website";
  const themeColor = "#ffffff";

  const randomProducts = await getPopularProducts();
  return (
    <>
      {/* Primary Meta Tags */}
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
      <main className={styles.main}>
        <Hero />
        <section id="o_nama_sekcija" className={styles.about_us}>
          <h2>O NAMA</h2>
          <p>
            Nakon dugogodisnjeg poslovanja u oblasti distribucije hdpe i ldpe
            folija STOPAK ambalaža širi svoj asortiman i uvodimo sve vrste
            ambalaže u našu ponudu. Cilj nase firme je da kupcima obezbedimo
            kvalitetne proizvode po pristupačnoj ceni, koja će u ugovorenom roku
            biti dostavljena na Vašu adresu, sto do sada pokazuje mnostvo
            zadovoljnih kupaca kako na teritoriji Novog Sada i Vršca tako i na
            teritoriji cele Srbije.<br/> Vršimo besplatnu dostavu proizvoda iz našeg
            asortimana na teritoriji Vršca i Novog Sada, a ostalim gradovima
            Srbije saljemo brzom postom. Naš tim u kontinuitetu prati tržište,
            ponude inovativnih proizvoda za Vaše potrebe i spreman je da
            pronadje rešenje za svaki Vaš problem.
          </p>
        </section>
        <section className={styles.products_section}>
          <h2>IZDVAJAMO IZ PONUDE</h2>
          <div className={styles.products_container}>
            {randomProducts &&
              randomProducts.length > 0 &&
              randomProducts.map((product, index) => (
                <ProductCard product={product} key={"product" + index} />
              ))}
          </div>
        </section>
      </main>
    </>
  );
}
