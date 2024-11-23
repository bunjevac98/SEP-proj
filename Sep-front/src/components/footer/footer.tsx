import Image from "next/image"
import styles from "./footer.module.css"
import Link from "next/link";

const PageFooter = () => {
    return (
        <footer id="page_footer" className={styles.page_footer}>
            <Image src="/images/logos/StoPak - logo.svg" alt="StoPak logo" width={200} height={50} quality={100} />
            <div className={styles.footer_left_side}>
                <div className={styles.footer_left_top}>
                    <Link href="/politika-privatnosti">POLITIKA PRIVATNOSTI</Link>
                    <Link href="/uslovi-koriscenja">USLOVI KORIŠĆENJA</Link>
                </div>
                <p>Copyright © {(new Date()).getFullYear()} StoPak. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default PageFooter;