import { createContext, useEffect, useState } from "react";
import axios from "axios";
// import { customers, ferti_products } from "../assets/assests";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [ userDetails, setUserDetails] = useState({})

    const [selectedTab, setSelectedTab] = useState("home");

    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [billingItems, setBillingItems] = useState([]);

    const [token, setToken] = useState("");
    const [ferti_products, setFertiProducts] = useState([]);
    const [loading, setLoading] = useState([]);

    const addProduct = (itemId) => {
        if (!billingItems[itemId]) {
            setBillingItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setBillingItems((prev) => ({
                ...prev,
                [itemId]: prev[itemId] + 1,
            }));
        }
    };

    // const removeProduct = (itemId) => {
    //     setBillingItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    // };

    const removeProduct = (itemId) => {
        setBillingItems((prev) => {
            const updated = { ...prev };

            if (updated[itemId] > 1) {
                updated[itemId] = updated[itemId] - 1; // reduce qty
            } else {
                delete updated[itemId]; // remove item completely
            }

            return updated;
        });
    };

    const fetchCustomers = async () => {
        try {
            const res = await axios.get(
                import.meta.env.VITE_BACKEND_URL + "/api/customer/list"
            );

            if (res.data.success) {
                setCustomers(res.data.customers);
            }
        } catch (error) {
            console.log("Customer fetch error", error);
        }
    };

    const fetchProductList = async () => {
        const response = await axios.get(
            import.meta.env.VITE_BACKEND_URL + "/api/product/list"
        );

        setFertiProducts(response.data.data);
    };

    // useEffect(() => {
    //     console.log(billingItems);
    // }, [billingItems]);

    useEffect(() => {
        async function loadData(params) {
            setLoading(true);
            console.log("Data loading")

            await fetchProductList();
            await fetchCustomers();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                setUserDetails(JSON.parse(localStorage.getItem("user")));
            }
            console.log(ferti_products,"Data loaded")
            setLoading(false);
            console.log(userDetails + "USerdetials ")
        }
        loadData();
    }, []);

    const contextValue = {
        userDetails,

        selectedTab, 
        setSelectedTab,

        customers,
        selectedCustomer,
        setSelectedCustomer,
        fetchCustomers,

        ferti_products,
        fetchProductList,
        loading,

        billingItems,
        setBillingItems,
        addProduct,
        removeProduct,

        token,
        setToken,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
