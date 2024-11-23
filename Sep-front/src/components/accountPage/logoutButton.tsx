"use client"

import { signOut } from "next-auth/react";
import type { User } from "lib/lib/objects";
import styles from './logoutButton.module.css';

const LogoutButton = ({user}:{user:User}) => {
    return (<>
        <button className={styles.SignOutButton} onClick={() => signOut({
            callbackUrl: `${window.location.origin}/login`,
            redirect:true
        })}>ODJAVI SE</button>

        
    </>)
};

export default LogoutButton;