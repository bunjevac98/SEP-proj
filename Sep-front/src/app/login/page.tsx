import LoginForm from "lib/components/loginForms/loginForm";
import styles from "./page.module.css";
import RegisterForm from "lib/components/loginForms/registerForm";
import { getServerSession } from "next-auth";
import { redirect, RedirectType } from "next/navigation";

const LoginPage = async () => {

  const session = await getServerSession();

  if(session?.user){
    redirect('/account', RedirectType.replace);
  }
  
  return (
    <>
    <title>Prijava | Stopak Ambalaža</title>
    <main className={styles.login_page_container}>
      <div className={styles.forms_container}>
        <div className={styles.left}>
          <LoginForm />
        </div>
        <div className={styles.right}>
          <RegisterForm type="" />
        </div>
      </div>
    </main>
    </>
  );
};

export default LoginPage;
