import styles from './politika.module.css';


const TermsOfService = () => {
    const title = 'Uslovi korišćenja | Stopak Ambalaža';
  const description = 'Dobrodošli, pročitajte naše uslove korišćenja. Pregledajte naše kategorije i pronađite savršene proizvode za ambalažu koji odgovaraju vašim potrebama.';
  const keywords = 'ambalaža, rešenja za ambalažu, ekološka ambalaža, visokokvalitetna ambalaža, pakovanje proizvoda, ambalaža za preduzeća, prodaja ambalaže, pakovanje za transport, ambalažni proizvodi, ekološki prihvatljiva ambalaža, karton i papirna ambalaža, plastična ambalaža, fleksibilna ambalaža, prilagođena ambalaža, ambalaža na veliko';
  const url = 'https://stopakambalaza.com/';
  const ogImage = '/images/logos/StoPak - logo.svg';
  const ogType = 'website';
  const themeColor = '#ffffff';
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
        <main id="politika-privatnosti" className={styles.page_container}>
            <h1>USLOVI KORIŠĆENJA</h1>
            <p>
                Ova stranica sadrži uslove pod kojima nudimo proizvode putem naše online prodavnice. Molimo
                vas da pažljivo pročitate ove uslove pre nego što obavite kupovinu i označite polje „Slažem se sa
                uslovima korišćenja“. Ukoliko ne označite ovo polje, nećete biti u mogućnosti da izvršite
                narudžbinu.
            </p>
            <p>
                Informacije dostupne na našoj internet prodavnici služe isključivo u informativne svrhe i ne
                mogu zameniti pravni ili stručni savet. Ukoliko imate bilo kakva pitanja ili nedoumice u vezi sa
                ovim informacijama, molimo vas da nas kontaktirate.
            </p>

            <h2>NAŠI PODACI</h2>
            <ul>
                <li>VUKAN STOKUĆA PR NESPECIJALIZOVANA TRGOVINA NA VELIKO STOPAK AMBALAŽA VRŠAC</li>
                <li>Sindjelićeva 62</li>
                <li>Srbija</li>
                <li><a href="tel:069/610-199">069/610-199</a></li>
                <li><a href="mailto:stopak.ambalaza@gmail.com">stopak.ambalaza@gmail.com</a></li>
                <li>PIB: 114345258</li>
                <li>MB: 67503333</li>
            </ul>

            <h2>PRIHVATANJE USLOVA KORIŠĆENJA</h2>

            <p>U ovom dokumentu, svaki posetilac naše internet prodavnice smatra se korisnikom, bilo da je reč
                o registrovanom korisniku ili posetiocu-gostu. Svaka poseta, korišćenje ili kupovina u našoj
                prodavnici podrazumeva da ste pročitali i da se slažete sa uslovima korišćenja. STOPAK
                ambalaža zadržava pravo da u bilo kom trenutku promeni ove uslove objavljivanjem revidirane
                verzije na sajtu.</p>

            <h2>OPŠTE ODREDBE O KORISNICIMA</h2>

            <p>Korisnici našeg sajta imaju pravo da koriste njegove sadržaje isključivo za lične i interne svrhe.
                Slažete se da nećete kopirati, distribuirati ili na bilo koji način koristiti sadržaje zaštićene
                autorskim pravima ili intelektualnom svojinom, uključujući tekstove, slike, audio materijale,
                virtuelne proizvode ili baze podataka dostupne na našoj internet prodavnici.</p>

            <p>Ako koristite našu uslugu, odgovorni ste za očuvanje poverljivosti svog naloga i lozinke, kao i za
                ograničavanje pristupa svom računaru. Prihvatate punu odgovornost za sve aktivnosti koje se
                odvijaju pod vašim nalogom ili lozinkom. STOPAK ambalaža zadržava pravo da ograniči,
                onemogući ili promeni pristup sajtu i njegovom sadržaju za različite korisnike, kao i da unese
                nove sadržaje bez prethodnog obaveštenja. Na korisniku je da proceni da li sadržaj na sajtu
                odgovara njegovim potrebama.</p>

            <h2>CENE I FAKTURE</h2>

            <p>STOPAK ambalaža internet prodavnica prodaje proizvode po cenama koje su jasno naznačene.
                Ukoliko nije drugačije naznačeno, navedena cena proizvoda ne uključuje PDV.</p>

            <p>Iako se trudimo da osiguramo tačnost cena, može se desiti da dođe do greške. U slučaju da je
                stvarna cena artikla viša od navedene, obustavićemo porudžbinu i obavestiti kupca kako bismo
                pronašli odgovarajuće rešenje. Ukoliko je stvarna cena niža od navedene, izvršićemo povraćaj
                novca u dogovoru sa kupcem.</p>

            <p>
                Na fakturi će biti navedene cene sa uračunatim PDV-om. Kada naručite proizvode, na vašu email
                adresu biće poslata faktura sa detaljima o porudžbini. Cene mogu biti promenjene u bilo kom
                trenutku. Nismo u obavezi da prodamo proizvod po pogrešno nižoj ceni.
            </p>

            <p>Pored cene proizvoda, STOPAK ambalaža naplaćuje i troškove dostave ukoliko se dostava vrši
                van zone besplatne dostave.</p>

            <h2>PORUČIVANJE I DOSTAVA PROIZVODA</h2>

            <p>Proizvodi koji se prodaju u paketima mogu se naručivati samo kao paketi. Svaka porudžbina
                koja nije u skladu sa ovim pravilom neće biti isporučena u originalnom obliku, već će biti
                korigovana, a kupac će o tome biti obavešten pre isporuke.</p>

            <p>Adresa za isporuku smatraće se adresom kupca, osim ako nije eksplicitno navedena druga
                adresa. Nakon naručivanja, kupac će dobiti potvrdu putem emaila da je STOPAK ambalaža
                primila porudžbinu.</p>

            <h2>REKLAMACIJE</h2>

            <p>STOPAK ambalaža prihvata povraćaj novca i robe u slučaju nesaobraznosti ili oštećenja
                proizvoda. Molimo kupce da pažljivo pregledaju robu prilikom dostave. Ukoliko primetite
                oštećenje ili nesaobraznost, nemojte prihvatiti robu od kurira. Ako kurir odbije da sačeka, kupac
                ima pravo na reklamaciju u roku od 14 dana od prijema robe.</p>

            <p>Reklamaciju možete podneti na sledeće načine:</p>

            <ul>
                <li>Pozivom na naše kontakt telefone</li>
                <li>Slanjem reklamacije na našu email adresu: <a href="mailto:stopak.ambalaza@gmail.com">stopak.ambalaza@gmail.com</a></li>
            </ul>

            <p>Nakon odobrenja reklamacije, robu možete vratiti kurirskom službom ili je lično dostaviti.
                STOPAK ambalaža će nastojati da izvrši povraćaj novca što pre, najkasnije u roku od 14 dana od
                prijema vraćene robe. Povraćaj novca vrši se na dinarski račun kupca ili na račun sa kojeg je
                izvršeno plaćanje.</p>

            <p>Poštarina i dodatni troškovi porudžbine nisu predmet povraćaja.</p>

            <h2>KUPAC NEMA PRAVO NA POVRAĆAJ U SLEDEĆIM SLUČAJEVIMA</h2>

            <ul>
                <li>Nakon što je usluga bez nedostataka u potpunosti izvršena</li>
                <li>Ukoliko dođe do promene cene isporuke nakon izvršene porudžbine, dok STOPAK
                    ambalaža nije ažurirala cene u prodavnici</li>
                <li>Nakon isteka roka od 14 dana od prijema robe</li>
                <li>Ako je kupac otpečatio zapečaćenu robu koja zbog zdravstvenih ili higijenskih razloga ne
                    može biti vraćena</li>
            </ul>

            <h2>AUTORSKA PRAVA I KOMENTARI</h2>

            <p>Svi tekstovi, grafički sadržaji, fotografije, ikonice, audio materijali, logotipi, slogani, nazivi
                brendova i ostali sadržaji na ovom sajtu pripadaju firmi STOPAK ambalaža ili njenim
                dobavljačima. Zabranjeno je korišćenje, kopiranje, menjanje, prenošenje, objavljivanje ili na bilo
                koji drugi način komercijalno eksploatisanje ovih sadržaja bez dozvole.</p>

            <p>Zabranjeno je unošenje lažnih informacija, kao i neovlašćeno korišćenje tuđih podataka prilikom
                kupovine.</p>

            <h2>REŠAVANJE SPOROVA</h2>

            <p>U slučaju da dođe do spora između kupca i kompanije STOPAK ambalaža, a da nije moguće
                postići sporazumno rešenje, kupac i STOPAK ambalaža imaju pravo da traže zaštitu svojih prava
                sudskim putem.</p>
        </main>
        </>
    )
};

export default TermsOfService;