import { createContext } from "react";
import { customers } from "../assets/assests";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const contextValue = {

        customers
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
