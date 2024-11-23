import { authOptions } from "lib/lib/authOptions";
import { getServerSession } from "next-auth";
import styles from "./page.module.css";
import EditProductModule from "lib/components/editProductModule/editProductModule";
import { redirect } from "next/navigation";
import { getAllCategories, getProductDetails } from "lib/lib/actions";

const EditProductPage = async ({ params }: { params: { id: string } }) => {


    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (user?.role !== "admin") {
        redirect('/');
    }
    const categories = await getAllCategories();
    
    const product = await getProductDetails(params.id);
    if(!product){
        redirect('/');
    }

    return (
        <>
        <title>Izmena proizvoda | Stopak Ambalaža</title>
        <main className={styles.edit_product_page}>
            <EditProductModule product={product} categories={categories} user={user} />
        </main>
        </>
    )
}

export default EditProductPage;