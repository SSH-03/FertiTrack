import React, { useContext } from "react";
import { assets } from "../assets/assests";
import { StoreContext } from "../context/StoreContext";

const ProductItem = ({
    _id,
    name,
    image,
    next_dose,
    dose_measure,
    unitprice,
    quantityType,
    description,
}) => {
    const { billingItems, setBillingItems } = useContext(StoreContext);

    const addProduct = () => {
        setBillingItems((prev) => {
            if (prev[_id]) {
                return {
                    ...prev,
                    [_id]: {
                        ...prev[_id],
                        quantity: prev[_id].quantity + 1,
                    },
                };
            }

            return {
                ...prev,
                [_id]: {
                    _id,
                    name,
                    image,
                    unitprice,
                    quantityType,
                    description,
                    quantity: 1,
                    next_dose,
                    dose_measure,
                    nextDoseDate: null,
                    discount: {
                        autoApply: false,
                        manual: 0,
                    },
                },
            };
        });
    };

    const removeProduct = () => {
        setBillingItems((prev) => {
            const updated = { ...prev };
            delete updated[_id];
            return updated;
        });
    };
console.log(image + " Midhun")
    return (
        <div className="card p-2 shadow-sm h-100">
            <div className="position-relative">
                <img
                    src={import.meta.env.VITE_BACKEND_URL + "/images/" + image}
                    className="card-img-top"
                    style={{ height: "160px", objectFit: "cover" }}
                />

                {!billingItems[_id] ? (
                    <img
                        src={assets.add_big_icon}
                        className="position-absolute bottom-0 end-0 m-2"
                        style={{ width: "40px", cursor: "pointer" }}
                        onClick={addProduct}
                    />
                ) : (
                    <div className="d-flex justify-content-between p-2">
                        <img
                            src={assets.remove_icon}
                            style={{ width: "30px", cursor: "pointer" }}
                            onClick={removeProduct}
                        />
                        <p className="fw-bold mb-0">
                            {billingItems[_id].quantity}
                        </p>
                        <img
                            src={assets.add_icon}
                            style={{ width: "30px", cursor: "pointer" }}
                            onClick={addProduct}
                        />
                    </div>
                )}
            </div>

            <div className="card-body">
                <h5>{name}</h5>
                <p>Next dose: {next_dose}</p>
                <p>Measure: {dose_measure}</p>
                <p>
                    ₹{unitprice} / {quantityType}
                </p>
            </div>
        </div>
    );
};

export default ProductItem;
