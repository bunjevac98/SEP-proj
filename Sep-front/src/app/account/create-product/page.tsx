import { authOptions } from "lib/lib/authOptions";
import { getServerSession } from "next-auth";
import styles from "./page.module.css";
import EditProductModule from "lib/components/editProductModule/editProductModule";
import { redirect } from "next/navigation";
import { getAllCategories, getProductDetails } from "lib/lib/actions";
import CreateProductModule from "lib/components/createProductModule/createProductModule";

const CreateProductPage = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (user?.role !== "admin") {
    redirect("/");
  }
  const categories = await getAllCategories();

  return (
    <>
      <title>Kreiranje proizvoda | Stopak Ambalaža</title>
      <main className={styles.edit_product_page}>
        <CreateProductModule categories={categories} />
      </main>
    </>
  );
};

export default CreateProductPage;
