import { getCategoryDescription, getCategoryId, getCategoryProducts } from "lib/lib/actions";
import styles from "./page.module.css";
import { redirect } from "next/navigation";
import ProductCard from "lib/components/productCard/productCard";
import { Product } from "lib/lib/objects";
import Link from "next/link";

const CategoryPage = async ({ searchParams, params }: { searchParams: { [key: string]: string | undefined }, params: { c_name: string } }) => {

    const SearchPage = searchParams.page;

    ////// najlonske kese
    // treger kese
    // ukrasne kese
    // zamrzivač kese
    // džakovi za smeće


    const categoriesToFind = (() => {
        switch (decodeURI(params.c_name)) {
            case "najlonske kese":
                return ["najlonske kese", "treger kese", "zamrzivač kese", "džakovi za smeće"];
            case "plastična ambalaža":
                return ["plastična ambalaža", "pet ambalaža", "pp ambalaža"];
            case "vakum kese":
                return ["vakum kese", "glatke vakum kese", "reljefne vakum kese"];
            default:
                return [decodeURI(params.c_name)];
        }
    })();

    const showPagesList = categoriesToFind.length === 1;


    // const categoryId = await getCategoryId(decodeURI(params.c_name));

    const categoryIds = await Promise.all(
        categoriesToFind.map(async (categoryName) => {
            return await getCategoryId(categoryName);
        })
    );

    const categoryDescriptionResponse = await getCategoryDescription(categoryIds[0]);
    const categoryDescription = categoryDescriptionResponse?.desc || undefined;


    // Realno nije potrebno ali neka ostane tu mozda zatreba
    if (false) {

        const title = `Nepoznata kategorija | Stopak Ambalaža`;
        const description = `Nismo pronašli ovu kategoriju ali možete da pogledate ostale proizvode na Stopak Ambalaži, uključujući ekološke opcije za preduzeća svih veličina. Pronađite savršena rešenja za ambalažu koja odgovaraju vašim potrebama.`;
        const keywords = 'ambalaža, rešenja za ambalažu, ekološka ambalaža, visokokvalitetna ambalaža, pakovanje proizvoda, ambalaža za preduzeća, prodaja ambalaže, pakovanje za transport, ambalažni proizvodi, ekološki prihvatljiva ambalaža, karton i papirna ambalaža, plastična ambalaža, fleksibilna ambalaža, prilagođena ambalaža, ambalaža na veliko';
        const url = 'https://stopakambalaza.com/';
        const ogImage = '/images/logos/StoPak - logo.svg';
        const ogType = 'website';
        const themeColor = '#ffffff';

        return (
            <main className={styles.search_page}>
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
                <h1>Žao nam je ali nismo pronašli ovu kategoriju</h1>

            </main>)
    }

    // const categoryProducts = await getCategoryProducts(categoryId);

    const tempCategoryProducts = await Promise.all(
        categoryIds.map(async (categoryId) => {
            if (SearchPage) {
                return await getCategoryProducts(categoryId, parseFloat(SearchPage), 25);
            } else {
                return await getCategoryProducts(categoryId, 1, showPagesList ? 25 : 999);
            }
        })
    );

    let categoryProducts;

    if (tempCategoryProducts.length > 1) {
        categoryProducts = tempCategoryProducts.filter((product) => !product.status);
    } else {
        categoryProducts = tempCategoryProducts;
    }

    const title = `${decodeURI(params.c_name).substring(0, 1).toUpperCase()}${decodeURI(params.c_name).substring(1)} | Stopak Ambalaža`;
    const description = `Otkrijte vrhunska rešenja iz kategorije ${decodeURI(params.c_name)} na Stopak Ambalaži! Istražite naš širok asortiman proizvoda za "${decodeURI(params.c_name)}", uključujući ekološke opcije za preduzeća svih veličina. Pronađite savršena rešenja za ambalažu koja odgovaraju vašim potrebama.`;
    const keywords = 'ambalaža, rešenja za ambalažu, ekološka ambalaža, visokokvalitetna ambalaža, pakovanje proizvoda, ambalaža za preduzeća, prodaja ambalaže, pakovanje za transport, ambalažni proizvodi, ekološki prihvatljiva ambalaža, karton i papirna ambalaža, plastična ambalaža, fleksibilna ambalaža, prilagođena ambalaža, ambalaža na veliko';
    const url = 'https://stopakambalaza.com/';
    const ogImage = '/images/logos/StoPak - logo.svg';
    const ogType = 'website';
    const themeColor = '#ffffff';

    if (categoryProducts.length > 0 && categoryProducts[0].status !== 404) {

        const availablePages = categoryProducts[0].totalPages;

        const pages = [];
        for (let i = 1; i <= availablePages; i++) {
            pages.push(i);
        }

        return (
            <main className={styles.search_page}>
                <title>{title}</title>
                <meta name="description" content={categoryDescription || description} />
                <meta name="keywords" content={keywords} />
                <meta name="theme-color" content={themeColor} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content={ogType} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={categoryDescription || description} />
                <meta property="og:url" content={url} />
                <meta property="og:image" content={ogImage} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={categoryDescription || description} />
                <meta name="twitter:image" content={ogImage} />
                <div className={styles.category_description_container}>
                    <p>{categoryDescription || description}</p>
                </div>
                <h1>Proizvodi iz kategorije {decodeURI(params.c_name)}</h1>
                <div className={styles.products_container}>

                    {categoryProducts && categoryProducts.map((category: any, index) => (
                        category.paginatedData && category.paginatedData.length > 0 && category.paginatedData.map((searchResult: Product, index: any) => (

                            <div key={index}>
                                <ProductCard product={searchResult} />
                            </div>
                        ))
                    ))}

                    {/* {categoryProducts && categoryProducts[0].paginatedData.length > 0 && categoryProducts[0].paginatedData.map((searchResult: Product, index: any) => (

                        <div key={index}>
                            <ProductCard product={searchResult} />
                        </div>
                    ))} */}
                </div>
                <nav className={styles.pages_container}>
                    {pages && showPagesList && pages.map((page: number, index) => (
                        <Link href={`/kategorije/${params.c_name}?page=${page}`} key={index} className={`${page.toString() === SearchPage ? styles.active : ''}`}>{page}</Link>
                    ))}
                </nav>
            </main>

        );
    }

    return (

        <main className={styles.search_page}>
            <title>{title}</title>
            <meta name="description" content={categoryDescription || description} />
            <meta name="keywords" content={keywords} />
            <meta name="theme-color" content={themeColor} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={categoryDescription || description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={categoryDescription || description} />
            <meta name="twitter:image" content={ogImage} />
            <div className={styles.category_description_container}>
                <p>{categoryDescription || description}</p>
            </div>
            <h1>Žao nam je ali nismo pronašli proizvode u ovoj kategoriji</h1>

        </main>);
};

export default CategoryPage;