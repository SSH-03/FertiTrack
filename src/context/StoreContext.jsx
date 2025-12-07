import { createContext, useEffect, useState } from "react";
import { customers, ferti_products } from "../assets/assests";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [billingItems, setBillingItems] = useState([]);
    const [orders, setOrders] = useState([]);

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

    const removeProduct = (itemId) => {
        setBillingItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    };

    useEffect(() => {
        console.log(billingItems);
    }, [billingItems]);

    const contextValue = {
        customers,
        selectedCustomer,
        setSelectedCustomer,
        ferti_products,

        billingItems,
        setBillingItems,
        addProduct,
        removeProduct,
        orders,
        setOrders,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
