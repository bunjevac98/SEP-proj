import Image from "next/image";
import styles from "./fullPageLoader.module.css";

const ServerPageLoader = ({forceopen}:{forceopen?:boolean}) => {

    return(
        <div id="server_page_loader" className={`${styles.fullPageLoader} ${styles.active} ${styles.server}`}>
            <Image src="/images/logos/StoPak - logo.png" alt="company logo" width={300} height={75}/>
            <div className={styles.loader}>
                <span className={`${styles.circle} ${styles.one}`}></span>
                <span className={`${styles.circle} ${styles.two}`}></span>
                <span className={`${styles.circle} ${styles.three}`}></span>
            </div>
        </div>
    );
}

export default ServerPageLoader;