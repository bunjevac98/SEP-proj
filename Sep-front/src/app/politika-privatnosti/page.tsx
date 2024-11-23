import styles from './politika.module.css';


const PrivacyPolicy = () => {
    const title = 'Politika privatnosti | Stopak Ambalaža';
  const description = 'Dobrodošli, pročitajte našu politiku privatnosti. Pregledajte naše kategorije i pronađite savršene proizvode za ambalažu koji odgovaraju vašim potrebama.';
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
        <main id="politika-privatnosti" className={styles.page_container}>
            <h1>POLITIKA PRIVATNOSTI</h1>
            <h2>UVOD</h2>
            <p>Zaštita i privatnost vaših podataka predstavljaju ključni prioritet za STOPAK ambalažu, i
                tretiramo ih s najvećom pažnjom. Cilj ovog teksta je da vas upoznamo s načinom na koji
                koristimo i štitimo vaše lične podatke prikupljene tokom vaših aktivnosti na našoj internet
                prodavnici. Svesni smo koliko vam je zaštita podataka važna, stoga neprestano unapređujemo
                naše poslovanje i pratimo najnovije standarde kako bismo osigurali bezbednost i pouzdanost
                naše online trgovine.
            </p>
            <h2>KOJE PODATKE PRIKUPLJAMO?</h2>
            <p>
                Kada kupujete preko našeg sajta, kreirate nalog ili se prijavljujete na email listu, mogu nam biti
                potrebni sledeći podaci:
            </p>
            <ul>
                <li>Vaši kontakt podaci: ime, prezime, adresa, email adresa, korisničko ime i lozinka, podaci
                    za plaćanje, podaci za isporuku i broj telefona, čak i ako ne dovršite kupovinu;</li>
                <li>Informacije o narudžbinama koje obavite putem naše internet prodavnice, uključujući
                    podatke o isporuci proizvoda;</li>
                <li>Podaci o vašim posetama našem sajtu, uključujući sadržaje koje pregledate i IP adrese
                    vaših uređaja.</li>
            </ul>
            <p>
                Prikupljanje ovih podataka vrši se isključivo radi boljeg razumevanja vaših potreba, kao i
                sprovođenja odgovarajućih sigurnosnih mera za bezbedniju i udobniju online trgovinu.
            </p>

            <h2>KAKO KORISTIMO PRIKUPLJENE PODATKE?</h2>

            <p>Vaši podaci mogu biti korišćeni u zavisnosti od vrste saradnje sa nama:</p>

            <ul>
                <li>Za obradu narudžbina, naplatu, organizaciju isporuke i druge usluge vezane za kupovinu;</li>
                <li>Za internu analizu podataka sa ciljem poboljšanja poslovanja i unapređenja naših usluga;</li>
                <li>Za poziv na učešće u anketama ili davanje povratnih informacija koje nam pomažu da
                    unapredimo rad internet prodavnice i našu saradnju;</li>
                <li>Za ažuriranje statusa vaše narudžbine i pružanje potrebne korisničke podrške;</li>
                <li>Za slanje promotivnih email sadržaja vezanih za proizvode i usluge koje bi vas mogle
                    zanimati, uz vaše odobrenje.</li>
            </ul>

            <h2>KAKO DELIMO PODATKE?</h2>
            <p>STOPAK ambalaža neće deliti vaše podatke s trećim stranama osim kada to zahteva priroda
                saradnje ili zakonska obaveza. Vaši podaci mogu biti prosleđeni državnim organima i drugim
                pravnim licima u skladu s važećim propisima. STOPAK ambalaža ne iznajmljuje niti prodaje
                lične podatke. Email liste koje kreiramo, sa podacima poput imena i email adresa, mogu biti
                prosleđene partnerima koji se bave direktnim marketingom, uz poštovanje svih relevantnih
                zakona i standarda. STOPAK ambalaža ne deli email adrese trećim licima za slanje njihovih
                promotivnih materijala.</p>

            <h2>KOLAČIĆI I NEPERSONALIZOVANI PODACI</h2>

            <p>STOPAK ambalaža koristi kolačiće za prikupljanje nepersonalizovanih podataka. Kolačići su
                mali tekstualni fajlovi koje naš sajt smešta na vaš uređaj putem internet pregledača, a koji
                prikupljaju informacije o vrsti pregledača, operativnom sistemu, nazivu domena sa kojeg
                dolazite, prosečnom vremenu zadržavanja na sajtu i slično. Kolačići nam omogućavaju
                identifikaciju posetilaca, potvrdu njihovog identiteta, i aktivaciju važnih funkcija internet
                prodavnice.</p>

            <p>Ukoliko ne želite da koristite kolačiće, možete izvršiti odgovarajuća podešavanja na svom
                pregledaču, ali imajte na umu da određeni delovi sajta možda neće funkcionisati ispravno.</p>

        </main>
        </>
    )
};

export default PrivacyPolicy;