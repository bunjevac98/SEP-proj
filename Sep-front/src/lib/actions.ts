import axios, { AxiosError, AxiosResponse } from "axios";
import { ProductCard } from "./objects";
import type { cartItem, Product } from "./objects";
import cartStyles from "../components/cart/cart.module.css";
import { redirect } from "next/navigation";
import CartItem from "lib/components/cart/cartItem/cartItem";
import LoaderStyles from "lib/components/fullPageLoader/fullPageLoader.module.css";

const apiUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEV_API
    : process.env.NEXT_PUBLIC_PROD_API;

export const getRandomProducts = async () => {
  const randomObjects: ProductCard[] = [
    { _id: "1", title: "Laptop", price: 999.994 },
    { _id: "2", title: "Smartphone", price: 499.99 },
    { _id: "3", title: "Headphones", price: 89.99 },
    { _id: "4", title: "Keyboard", price: 49.99 },
    { _id: "5", title: "Mouse", price: 29.99 },
    { _id: "6", title: "Monitor", price: 199.99 },
    // { _id: "7", title: "Printer", price: 129.99 },
    // { _id: "8", title: "Webcam", price: 79.99 },
    // { _id: "9", title: "Smartwatch", price: 299.99 },
    // { _id: "10", title: "Tablet", price: 399.99 },
  ];

  return randomObjects;
};

export const getProductDetails = async (
  productId: string
): Promise<Product | null> => {
  try {
    const response = await axios.get(`${apiUrl}/product/${productId}`);
    return response.data as Product;
  } catch (error) {
    console.error("There was an error making the request:", error);
    return null;
  }
};

export const getAllProducts = async (limit: number, page: number): Promise<Product[] | null> => {
  try {
    const response = await axios.get(`${apiUrl}/get-all-product?pageNumber=${page}&limit=${limit}`);
    return response.data.paginatedData as Product[];
  } catch (error) {
    console.error("There was an error making the request:", error);
    return null;
  }
}

export const handleDeleteProduct = async (id: string, token: string) => {
  try {
    const response = await axios.delete(`${apiUrl}/delete-product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("There was an error making the request:", error);
    return null;
  }
};

export const getAllCategories = async () => {
  const AllCategories = await axios
    .get(`${apiUrl}/categories-get-all`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("There was an error making the request:", error);
    });

  return AllCategories;
};

export const getCategoryName = async (categoryId: string | undefined) => {
  if (!categoryId) {
    return "";
  }
  const allCategories = await getAllCategories();
  const thisCategory = allCategories?.find(
    (category: { _id: any }) => category._id === categoryId
  );
  return thisCategory?.name;
};

export const handleCartClose = () => {
  const Cart = document.getElementById("website_cart_container");
  if (Cart?.classList.contains(cartStyles.active)) {
    Cart?.classList.remove(cartStyles.active);
  }
};

export const handleCartOpen = () => {
  const Cart = document.getElementById("website_cart_container");
  if (!Cart?.classList.contains(cartStyles.active)) {
    Cart?.classList.add(cartStyles.active);
  }
};

export const formatNumber = (number: number): string => {
  const fixedNumber = number.toFixed(2);

  const [integerPart, decimalPart] = fixedNumber.split(".");

  const integerWithSeparators = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "."
  );

  const formattedNumber = `${integerWithSeparators},${decimalPart}`;

  return formattedNumber;
};

export const registerUser = async (data: Object) => {
  try {
    const response = await axios.post(`${apiUrl}/register`, data);
    return { status: response.status, message: response.data.message };
  } catch (err: any) {
    // Handle errors that have a response object (i.e., server responded with a status)
    if (err.response) {
      return { status: err.response.status, message: err.response.data.message };
    }
    // Handle network errors or other unexpected errors
    return { status: 'error', message: err.message };
  }
};


export const updateProduct = async (data: any, token: string): Promise<boolean> => {
  const { _id } = data;
  try {
    const response = await axios.put(`${apiUrl}/product/${_id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

export const getPopularProducts = async (): Promise<Product[] | null> => {
  try {
    const response = await axios.get(`${apiUrl}/get-all-popular-products?pageNumber=1&limit=9`, {});
    if (response.status === 200) {
      return response.data.paginatedData as Product[];
    } else {
      return null;
    }
  }
  catch {
    return null;
  }
};

export const updateCategory = async (id: string, name: string, description:string) => {
  try {
    const response = await axios.put(`${apiUrl}/update-category/${id}`, {
      // data: {
      metaDesc: name,
      metaTitle: name,
      name: name,
      slug: name,
      url: name,
      description: description
      // }
    });
    return response;
  } catch {
    return { status: 400 };
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await axios.delete(`${apiUrl}/delete-category/${id}`);
    return response;
  } catch {
    return {
      status: 500
    }
  }
}

export const createCategory = async (name: string) => {
  const response = await axios.post(`${apiUrl}/create-category`, {
    name: name,
  });

  if (response.status === 200) {
    return 200;
  } else {
    return 500;
  }
};

export const createProduct = async (formData: FormData, token: string) => {
  try {
    const response = await axios.post(`${apiUrl}/create-product`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const getSearchResults = async (term: string, page?: string): Promise<any> => {
  try {
    const response = await axios.get(`${apiUrl}/get-all-product?searchTerm=${term}&limit=25${page ? `&pageNumber=${page}` : '&pageNumber=1'}`);
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }



};


export const signedOrder = async (userId: string, note: string, orderItems: cartItem[]) => {
  const response = await axios.post(`${apiUrl}/create-order`, {
    "customer_id": userId, // Replace with a valid user ID
    //"address": "VRSAC JOVANA CVIJICA 38",
    "description": note,
    "orderedProducts": orderItems.map((orderItem) => {
      return {
        "productId": orderItem.id.split('++')[0],
        "quantity": orderItem.quantity,
        "price": orderItem.hasSize&&orderItem?.size?orderItem?.size.price:orderItem.price,
        "size": orderItem.hasSize&&orderItem?.size?orderItem?.size.size:null
      }
    })
  });
  return response;
}

export const unsignedOrder = async (note: string, orderItems: cartItem[], tempCustomer: any, isCompany: boolean) => {
  const response = await axios.post(`${apiUrl}/create-order`,
    isCompany ? {
      "description": note,
      "orderedProducts": orderItems.map((orderItem) => {
        return {
          "productId": orderItem.id.split('++')[0],
          "quantity": orderItem.quantity,
          "price": orderItem.hasSize&&orderItem?.size?orderItem?.size.price:orderItem.price,
          "size": orderItem.hasSize&&orderItem?.size?orderItem?.size.size:null  
        }
      }),
      "customer": {
        "email": tempCustomer.email,
        "firstName": tempCustomer.firstName,
        "lastName": tempCustomer.lastName,
        "address": tempCustomer.address,

        "companyName": tempCustomer.companyName,
        "phone": [
          tempCustomer.phone
        ],
        "PIB": tempCustomer.PIB
      }
    } : {
      "description": note,
      "orderedProducts": orderItems.map((orderItem) => {
        return {
          "productId": orderItem.id.split('++')[0],
          "quantity": orderItem.quantity,
          "price": orderItem.hasSize&&orderItem?.size?orderItem?.size.price:orderItem.price,
          "size": orderItem.hasSize&&orderItem?.size?orderItem?.size.size:null  
        }
      }),
      "customer": {
        "email": tempCustomer.email,
        "firstName": tempCustomer.firstName,
        "lastName": tempCustomer.lastName,
        "address": tempCustomer.address,
        "phone": [
          tempCustomer.phone
        ],
      }
    });
  return response;
}

export const getCustomerOrders = async (id:string)=>{
  try{
  const response:any = await axios.get(`${apiUrl}/get-user-orders/${id}`);
  return response;
  }catch(err:any){
    return err;
  }
}


export const getCategoryProducts = async (id:string, page?:number, limit?:number)=>{
  try{
    return (await axios.get(`${apiUrl}/categories-get-product-from-categorty/${id}/${page?page:1}/${limit?limit:25}`)).data;
  }catch(Err:any){
    return {status: 404};
  }
};

export const getCategoryId = async (name: string) => {
  try {
    const response = await axios.get(`${apiUrl}/categories-get-all`);
    const allCategories = response.data;

    const category = allCategories.find((cat: { name: string }) => 
      cat.name.toLowerCase() === name.toLowerCase()
    );
    return category ? category._id : null;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // throw new Error('Failed to retrieve category ID');
  }
};

export const showLoader = () => {
  document.getElementById('full_page_loader')?.classList.add(LoaderStyles.active);
}

export const hideLoader = () => {
  document.getElementById('full_page_loader')?.classList.remove(LoaderStyles.active);
}

export const getAllOrders = async () =>{
  try{
    const response = await axios.get(`${apiUrl}/get-all-orders?limit=999`);
    return response.data.paginatedData;
  } catch (error: any) {
    if (error.response) {
      return { status: error.response.status, message: error.response.data };
    } else {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
};

export const getOrderDetails = async (orderId: string) => {
  try{
    const response = await axios.get(`${apiUrl}/order-details/${orderId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return { status: error.response.status, message: error.response.data };
    } else {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
};

export const deleteOrder = async(orderId:string) =>{
  try{
    const response = await axios.delete(`${apiUrl}/delete-order/${orderId}`);
    return response;
  } catch (error: any) {
    if (error.response) {
      return { status: error.response.status, message: error.response.data };
    } else {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
} 


export const completeOrder = async(orderId:string) =>{
  try{
    const response = await axios.put(`${apiUrl}/update-order-status/${orderId}`);
    return response;
  } catch (error: any) {
    if (error.response) {
      return { status: error.response.status, message: error.response.data };
    } else {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
} 

export const getCategoryDescription = async (id: string) => {
  try {
    const response = await axios.get(`${apiUrl}/get-category-description/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return { status: error.response.status, message: error.response.data };
    } else {
      return { status: 500, message: 'Internal Server Error' };
    }
  }
}