import React, { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import ProductItem from "./ProductItem";

const ProductDisplay = () => {
    const { ferti_products } = useContext(StoreContext);

    return (
        <div className="container-full">
            <h3 className="mb-3">Fertilizers</h3>

            <div className="row">
                {ferti_products.map((item) => (
                    <div className="col-md-6 col-lg-4 mb-3" key={item._id}>
                        <ProductItem {...item} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductDisplay;
