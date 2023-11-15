import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const get = async (url: string) => {
  try {
    const response = await axios.get(url);

    const data = await response.data;

    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

const post = async (url: string, payload = {}) => {
  const token = Cookies.get("token");

  try {
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    return { status: response.status, data: response.data };
  } catch (e: Error | AxiosError | any) {
    if (axios.isAxiosError(e)) {
      return { status: e.response?.status, error: e.response?.data.message };
    } else {
      return { status: 500, error: e };
    }
  }
};

const deleteProductX = async (payload = {}) => {
  const token = Cookies.get("token");

  try {
    const response = await axios.delete('product', {
      headers: {
        authorization: `Bearer ${token}`,
      },
      data: {
        source: payload
      }
    })

    return { status: response.status, data: response.data };
  } catch (e: Error | AxiosError | any) {
    if (axios.isAxiosError(e)) {
      return { status: e.response?.status, error: e.response?.data.message };
    } else {
      return { status: 500, error: e };
    }
  }
};

export { get, post, deleteProductX };
