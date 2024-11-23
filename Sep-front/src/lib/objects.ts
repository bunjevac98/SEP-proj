export interface ProductCard {
  _id: string;
  title?: string;
  price?: number;
  image?: string;
}

export interface Product {
  _id: string;
  title: string;
  price: number;
  numOfArticle?: string;
  hasSizes?: boolean | false;
  sizes?: [
    {
      size: string;
      price: number;
    }
  ];
  featureImage?: {
    _id: string;
    type: string;
    localPath: string;
    url: string;
    originalname: string;
    forMobile: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  images?: {
    _id: string;
    type: string;
    localPath: string;
    url: string;
    originalname: string;
    forMobile: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
  description?: string;
  quantity?: number;
  category?: {
    _id?: string;
    name?: string;
    slug?: string;
    url?: string;
    metaDesc?: string;
    metaTitle?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  };
  format?: string;
  url?: string;
  isPopular?: boolean;
  status?: string;
  createdBy?: any; // You can replace `any` with the appropriate type if known
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ProductImage {
  _id: string;
  type: string;
  localPath: string;
  url: string;
  originalname: string;
  forMobile: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type ProductImages = ProductImage[];

export interface cartItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  image: string;
  increment: number;
  hasSize?: boolean;
  size?: {
    size: string;
    price: number;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  token: string;
  expires: string;
  role: string;
}

export interface Session {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    token: string;
    expires: string;
    role: string;
  };
}
