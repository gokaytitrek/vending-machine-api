"use client";

import { Product } from "@/types";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

interface ContextInterface {
  isLoading: boolean;
  products: Product[];
  refreshData(): void;
}

const DataContext = React.createContext<ContextInterface>(
  {} as ContextInterface
);

const DataProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getData().then(() => setIsLoading(false));
  }, [updated]);

  const refreshData = () => {
    setUpdated((prev) => !prev);
  };

  const getData = async () => {
    try {
      const response = await axios.get("/product");

      const data = await response.data;

      setProducts(data);
    } catch (err) {
      console.error({ err });
    }
  };

  const values = {
    isLoading,
    products,
    refreshData,
  };

  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
};

const useProductData = () => {
  const context = useContext(DataContext);
  if (context == null) {
    throw new Error("useProductData() called outside of a Provider?");
  }
  return context;
};

export { DataProvider, useProductData };
