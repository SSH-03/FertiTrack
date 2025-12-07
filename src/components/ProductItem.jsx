import React, { useContext, useState } from "react";
import { assets } from "../assets/assests";
import { StoreContext } from "../context/StoreContext";

const ProductItem = ({
    id,
    name,
    image,
    next_dose,
    dose_measure,
    unitprice,
    quantityType,
}) => {
    const [quantity, setQuantity] = useState(0);
    const { billingItems, addProduct, removeProduct } =
        useContext(StoreContext);

    return (
        <div className="card p-2 shadow-sm h-100">
            <div className="position-relative">
                <img
                    src={image}
                    className="card-img-top"
                    style={{ height: "160px", objectFit: "cover" }}
                />

                {!billingItems[id] ? (
                    <img
                        src={assets.add_big_icon}
                        className="position-absolute bottom-0 end-0 m-2"
                        style={{ width: "40px", cursor: "pointer" }}
                        onClick={() => addProduct(id)}
                    />
                ) : (
                    <div className="d-flex justify-content-between align-items-center p-2">
                        <img
                            src={assets.remove_icon}
                            style={{ width: "30px", cursor: "pointer" }}
                            onClick={() => removeProduct(id)}
                        />
                        <p className="fw-bold mb-0">{billingItems[id]}</p>
                        <img
                            src={assets.add_icon}
                            style={{ width: "30px", cursor: "pointer" }}
                            onClick={() => addProduct(id)}
                        />
                    </div>
                )}
            </div>

            <div className="card-body">
                <h5 className="card-title">{name}</h5>

                <p className="mb-1">
                    Next dose: <b>{next_dose}</b>
                </p>
                <p className="mb-1">
                    Dose measure: <b>{dose_measure}</b>
                </p>
                <p className="mb-0">
                    Unit price: <b>₹{unitprice}</b> / {quantityType}
                </p>
            </div>
        </div>
    );
};

export default ProductItem;
