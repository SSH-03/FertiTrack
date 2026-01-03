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
            if (!prev[_id]) return prev; // safety check

            const currentQty = prev[_id].quantity;

            if (currentQty <= 1) {
                // remove the product if quantity is 1
                const updated = { ...prev };
                delete updated[_id];
                return updated;
            } else {
                // subtract 1 from quantity
                return {
                    ...prev,
                    [_id]: {
                        ...prev[_id],
                        quantity: currentQty - 1,
                    },
                };
            }
        });
    };

    return (
        <div className="card p-2 shadow-sm h-100 position-relative">
            <img
                src={import.meta.env.VITE_BACKEND_URL + "/images/" + image}
                className="card-img-top"
                style={{ height: "160px", objectFit: "cover" }}
            />

            <div className="card-body">
                <h5>{name}</h5>
                <p>
                    Next dose: {next_dose} {dose_measure}
                </p>

                <p>
                    ₹{unitprice} / {quantityType}
                </p>
            </div>

            {/* Bottom controls container */}
            <div className="position-absolute bottom-0 end-0 m-2">
                {!billingItems[_id] ? (
                    <img
                        src={assets.add_big_icon}
                        style={{ width: "40px", cursor: "pointer" }}
                        onClick={addProduct}
                    />
                ) : (
                    <div className="d-flex align-items-center bg-white rounded p-1 shadow-sm">
                        <img
                            src={assets.remove_icon}
                            style={{ width: "30px", cursor: "pointer" }}
                            onClick={removeProduct}
                        />
                        <p className="fw-bold mb-0 mx-2">
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
        </div>
    );
};

export default ProductItem;
