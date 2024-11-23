"use client"
import Image from "next/image";
import styles from "./searchBar.module.css"
import { useRouter } from "next/navigation";
import { useState } from "react";

const Searchbar = () =>{
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (searchTerm !== '') {
            router.push(`/pretraga/${searchTerm}?page=1`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={styles.search_bar_container}>
            <input 
                type="text" 
                placeholder="Pretraga" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
                onKeyDown={handleKeyDown}
            />
            <Image 
                alt="Search icon" 
                className={styles.search_icon} 
                width={30} 
                height={30} 
                src="/images/icons/search-icon.svg" 
                onClick={handleSearch} 
            />
        </div>
    );
};

export default Searchbar;