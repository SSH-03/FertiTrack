import React, { useContext } from "react";
import { StoreContext } from "../context/StoreContext";
import ProductItem from "./ProductItem";

const ProductDisplay = () => {
    const { ferti_products } = useContext(StoreContext);
    return (
        <div className="container-full">
            <h3 className="mb-3">Fertilizers</h3>

            <div className="row">
                {ferti_products.map((item, index) => (
                    <div className="col-md-6 col-lg-4 mb-3" key={index}>
                        <ProductItem
                            id={item._id}
                            name={item.name}
                            image={item.image}
                            next_dose={item.next_dose}
                            dose_measure={item.dose_measure}
                            unitprice={item.unitprice}
                            quantityType={item.quantityType}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductDisplay;
