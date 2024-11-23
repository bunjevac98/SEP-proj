import ProductCard from 'lib/components/productCard/productCard';
import { getSearchResults } from 'lib/lib/actions';
import { Product } from 'lib/lib/objects';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import Link from 'next/link';

interface SearchPageProps {
    searchParams: { [key: string]: string | undefined };
}

const SearchPage = async ({ searchParams, params }: { searchParams: { [key: string]: string | undefined }, params: { term: string } }) => {
    const SearchParams = Array.isArray(searchParams.terms) ? searchParams.terms[0] : searchParams.terms || '';
    const SearchTerm = params.term;
    const SearchPage = searchParams.page;

    const SearchResults = await getSearchResults(SearchTerm, SearchPage);
    const SearchProducts = SearchResults?.data?.paginatedData as Product[];
    const availablePages = SearchResults?.data?.totalPages;

    const pages = [];
    for (let i = 1; i <= availablePages; i++) {
        pages.push(i);
    }

    const title = `${SearchTerm} | Stopak Ambalaža`;
    const description = `Otkrijte vrhunska rešenja za ${SearchTerm} na Stopak Ambalaži! Istražite naš širok asortiman proizvoda za ${SearchTerm}, uključujući ekološke opcije za preduzeća svih veličina. Pronađite savršena rešenja za ambalažu koja odgovaraju vašim potrebama.`;
    const keywords = 'ambalaža, rešenja za ambalažu, ekološka ambalaža, visokokvalitetna ambalaža, pakovanje proizvoda, ambalaža za preduzeća, prodaja ambalaže, pakovanje za transport, ambalažni proizvodi, ekološki prihvatljiva ambalaža, karton i papirna ambalaža, plastična ambalaža, fleksibilna ambalaža, prilagođena ambalaža, ambalaža na veliko';
    const url = 'https://stopakambalaza.com/';
    const ogImage = '/images/logos/StoPak - logo.svg';
    const ogType = 'website';
    const themeColor = '#ffffff';

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
            <main className={styles.search_page}>
                {SearchProducts && SearchProducts.length > 0 ?<h1>Rezultati pretrage za {SearchTerm}</h1>:<h1>Žao nam je, nismo pronašli porizvode za pretragu &quot;{SearchTerm}&quot;</h1>}
                <div className={styles.products_container}>
                    {SearchProducts && SearchProducts.length > 0 && SearchProducts.map((searchResult: Product, index) => (

                        <div key={index}>
                            <ProductCard product={searchResult} />
                        </div>
                    ))}
                </div>
                <nav className={styles.pages_container}>
                    {pages && pages.map((page: number, index) => (
                        <Link href={`/pretraga/${SearchTerm}?page=${page}`} key={index} className={`${page.toString() === SearchPage ? styles.active : ''}`}>{page}</Link>
                    ))}
                </nav>
            </main>
        </>
    );
};

export default SearchPage;
