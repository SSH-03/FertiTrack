import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import ProductDisplay from "../components/ProductDisplay";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const UNIT_FACTOR = {
    g: 0.001,
    kg: 1,
    ton: 1000,
};

const Billing = () => {
    const {
        setSelectedTab,
        selectedCustomer,
        billingItems,
        setBillingItems,
        token,
        fetchProductList,
    } = useContext(StoreContext);

    const navigate = useNavigate();

    const [amountPaid, setAmountPaid] = useState(0);
    const [paymentMode, setPaymentMode] = useState("");
    const [autoDiscount, setAutoDiscount] = useState(false);
    const [manualDiscountEnabled, setManualDiscountEnabled] = useState(false);
    const [manualDiscount, setManualDiscount] = useState(0);

    const [showConfirm, setShowConfirm] = useState(false);

    const getEffectiveUnitPrice = (item) => {
        const baseType = item.quantityType;
        const orderType = item.orderQuantityType || baseType;

        // scenerios used for conversions
        // grams -> grams
        // conversion = 0.001 / 0.001 = 1
        // price = 100 x 1 = ₹100

        // grams -> kilograms
        // conversion = 1 / 0.001 = 1000
        // price = 100 x 1000 = ₹100,000

        // kilograms → grams
        // conversion = 0.001 / 0.001 = 1
        // price = ₹100

        if (!UNIT_FACTOR[baseType] || !UNIT_FACTOR[orderType]) {
            return item.unitprice;
        }

        const conversion = UNIT_FACTOR[orderType] / UNIT_FACTOR[baseType];

        return item.unitprice * conversion;
    };

    const getItemTotal = (item) => {
        return item.quantity * getEffectiveUnitPrice(item);
    };

    const addDuration = (dose, measure) => {
        const date = new Date();
        switch (measure) {
            case "day":
                date.setDate(date.getDate() + dose);
                break;
            case "week":
                date.setDate(date.getDate() + dose * 7);
                break;
            case "month":
                date.setMonth(date.getMonth() + dose);
                break;
            case "year":
                date.setFullYear(date.getFullYear() + dose);
                break;
            default:
                break;
        }
        return date;
    };

    const formatPrettyDate = (dateObj) => {
        const d = new Date(dateObj);
        const day = d.getDate();
        const suffix =
            day > 3 && day < 21
                ? "th"
                : ["st", "nd", "rd"][(day % 10) - 1] || "th";
        const month = d.toLocaleString("en-US", { month: "long" });
        const year = d.getFullYear();
        return `${day}${suffix} ${month} ${year}`;
    };

    const toInputFormat = (dateObj) =>
        new Date(dateObj).toISOString().split("T")[0];

    const total = Object.values(billingItems).reduce(
        (sum, item) => sum + getItemTotal(item),
        0
    );

    let discountAmount = 0;
    if (autoDiscount) discountAmount = total - Math.floor(total / 100) * 100;
    if (manualDiscountEnabled) discountAmount = manualDiscount;

    const finalTotal = Math.max(total - discountAmount, 0);
    const balance = Math.max(finalTotal - amountPaid, 0);

    const handleSaveClick = (event) => {
        event.preventDefault();

        if (!selectedCustomer) {
            toast.error("Please select a customer before billing.");
            return;
        }
        if (Object.keys(billingItems).length === 0) {
            toast.error("Please add products before billing.");
            return;
        }
        for (const item of Object.values(billingItems)) {
            if (!item.orderQuantityType) {
                item.orderQuantityType = item.quantityType;
            }

            if (!item.quantity || item.quantity <= 0) {
                toast.error(`Invalid quantity for ${item.name}`);
                return;
            }
        }

        if (!paymentMode) {
            toast.error("Please select a payment mode.");
            return;
        }

        setShowConfirm(true); // Show confirmation modal
    };
    const confirmSaveOrder = async () => {
        const productsArray = Object.values(billingItems).map((item) => {
            const autoDate = addDuration(item.next_dose, item.dose_measure);
            const finalDate = item.nextDoseDate
                ? new Date(item.nextDoseDate)
                : autoDate;
            return {
                productId: item._id, 

                name: item.name,
                quantityType: item.quantityType, 
                unitprice: item.unitprice,

                orderQuantity: item.quantity,
                orderQuantityType: item.orderQuantityType
                    ? item.orderQuantityType
                    : item.quantityType,

                baseUnitPrice: item.unitprice,
                effectiveUnitPrice: getEffectiveUnitPrice(item),
                totalPrice: getItemTotal(item),

                nextDoseDate: finalDate,
                nextDosePretty: formatPrettyDate(finalDate),
            };
        });

        const payments = amountPaid
            ? [
                  {
                      amount: amountPaid,
                      mode: paymentMode,
                      date: new Date().toISOString(),
                  },
              ]
            : [];

        const newOrder = {
            orderId: Date.now(),
            createdAt: new Date().toISOString(),
            customer: selectedCustomer,
            products: productsArray,
            billingSummary: {
                total,
                discountType: autoDiscount
                    ? "AUTO_ROUND"
                    : manualDiscountEnabled
                    ? "MANUAL"
                    : "NONE",
                discountAmount,
                finalTotal,
            },
            payments,
            balance,
        };

        try {
            const response = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/order/place",
                newOrder,
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success(response.data.message);

                setBillingItems({});
                setAmountPaid(0);
                setPaymentMode("");
                setManualDiscount(0);
                setAutoDiscount(false);
                setManualDiscountEnabled(false);

                setShowConfirm(false); // close modal
                setSelectedTab("orders");
                navigate("/orders");

                fetchProductList();
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error("Something went wrong while saving the order.");
        }
    };

    useEffect(() => {
        if (!selectedCustomer) {
            navigate("/customers");
            setSelectedTab("customers");
            toast.error("Please select the customer");
        }
    }, [selectedCustomer, navigate]);

    useEffect(() => {
        if (amountPaid > finalTotal) {
            setAmountPaid(finalTotal);
        }
    }, [finalTotal]);

    if (!selectedCustomer) {
        return null;
    }
    return (
        <>
            <form className="container mt-4" onSubmit={handleSaveClick}>
            
                <div className="card p-3 mb-4 shadow-sm">
                    <h4>{selectedCustomer.name}</h4>
                    <p className="mb-0">📞 {selectedCustomer.phone}</p>
                </div>

                <ProductDisplay />

                <h4 className="mt-4">Billing Items</h4>
                <table className="table table-bordered table-striped mt-2">
                    <thead className="table-dark">
                        <tr>
                            <th>Product</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Quantity Type</th>
                            <th>Total</th>
                            <th>Next Dose</th>
                            <th>Measure</th>
                            <th>Next Dose Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(billingItems).length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center text-danger "
                                >
                                    No products added yet. Please add products.
                                </td>
                            </tr>
                        ) : (
                            Object.values(billingItems).map((item) => {
                                const autoDate = addDuration(
                                    item.next_dose,
                                    item.dose_measure
                                );
                                const finalDate = item.nextDoseDate
                                    ? new Date(item.nextDoseDate)
                                    : autoDate;

                                return (
                                    <tr key={item._id}>
                                        <td>{item.name}</td>
                                        <td>
                                            ₹{getEffectiveUnitPrice(item)}/
                                            {item.orderQuantityType
                                                ? item.orderQuantityType
                                                : item.quantityType}
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    setBillingItems((prev) => ({
                                                        ...prev,
                                                        [item._id]: {
                                                            ...prev[item._id],
                                                            quantity: Number(
                                                                e.target.value
                                                            ),
                                                        },
                                                    }))
                                                }
                                            />
                                        </td>
                                        <td>
                                            {" "}
                                            <select
                                                className="form-select"
                                                value={item.orderQuantityType}
                                                onChange={(e) =>
                                                    setBillingItems((prev) => ({
                                                        ...prev,
                                                        [item._id]: {
                                                            ...prev[item._id],
                                                            orderQuantityType:
                                                                e.target.value,
                                                        },
                                                    }))
                                                }
                                            >
                                                <option value="">Select</option>
                                                <option value="g">
                                                    Grams (g)
                                                </option>
                                                <option value="kg">
                                                    Kilograms (kg)
                                                </option>
                                                <option value="ton">
                                                    Tons
                                                </option>
                                            </select>
                                        </td>
                                        <td>
                                            ₹{getItemTotal(item).toFixed(2)}
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={item.next_dose}
                                                onChange={(e) =>
                                                    setBillingItems((prev) => ({
                                                        ...prev,
                                                        [item._id]: {
                                                            ...prev[item._id],
                                                            next_dose: Number(
                                                                e.target.value
                                                            ),
                                                        },
                                                    }))
                                                }
                                            />
                                        </td>
                                        <td>
                                            <select
                                                className="form-select"
                                                value={item.dose_measure}
                                                onChange={(e) =>
                                                    setBillingItems((prev) => ({
                                                        ...prev,
                                                        [item._id]: {
                                                            ...prev[item._id],
                                                            dose_measure:
                                                                e.target.value,
                                                        },
                                                    }))
                                                }
                                            >
                                                <option value="day">Day</option>
                                                <option value="week">
                                                    Week
                                                </option>
                                                <option value="month">
                                                    Month
                                                </option>
                                                <option value="year">
                                                    Year
                                                </option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={toInputFormat(finalDate)}
                                                onChange={(e) =>
                                                    setBillingItems((prev) => ({
                                                        ...prev,
                                                        [item._id]: {
                                                            ...prev[item._id],
                                                            nextDoseDate:
                                                                e.target.value,
                                                        },
                                                    }))
                                                }
                                            />
                                            <div className="fw-bold mt-1">
                                                {formatPrettyDate(finalDate)}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

                <div className="card p-4 shadow-sm mt-4">
                    <label className="fw-bold">Total Amount</label>
                    <input
                        className="form-control mb-3"
                        value={`₹ ${total}`}
                        disabled
                    />

                    <div className="form-check form-switch mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={autoDiscount}
                            onChange={() => {
                                setAutoDiscount(!autoDiscount);
                                setManualDiscountEnabled(false);
                            }}
                        />
                        <label className="form-check-label fw-bold">
                            Auto Round Discount (nearest 100)
                        </label>
                    </div>

                    <div className="form-check form-switch mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={manualDiscountEnabled}
                            onChange={() => {
                                setManualDiscountEnabled(
                                    !manualDiscountEnabled
                                );
                                setAutoDiscount(false);
                            }}
                        />
                        <label className="form-check-label fw-bold">
                            Manual Discount
                        </label>
                    </div>

                    {manualDiscountEnabled && (
                        <input
                            type="number"
                            className="form-control mb-3"
                            placeholder="Enter discount amount"
                            value={manualDiscount}
                            onChange={(e) =>
                                setManualDiscount(Number(e.target.value))
                            }
                        />
                    )}

                    <label className="fw-bold">Final Total</label>
                    <input
                        className="form-control mb-3"
                        value={`₹ ${finalTotal}`}
                        disabled
                    />

                    <label className="fw-bold">Payment Mode</label>
                    <select
                        className="form-select mb-3"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                    >
                        <option value="">Select Payment Mode</option>
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                        <option value="card">Card</option>
                    </select>

                    <label className="fw-bold">Amount Paid</label>
                    <input
                        type="number"
                        className="form-control mb-3"
                        value={amountPaid}
                        min="0"
                        max={finalTotal}
                        onChange={(e) =>
                            setAmountPaid(
                                Math.min(Number(e.target.value), finalTotal)
                            )
                        }
                    />

                    <label className="fw-bold">Balance</label>
                    <input
                        className="form-control mb-3"
                        value={`₹ ${balance}`}
                        disabled
                    />

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={finalTotal <= 0 || !paymentMode}
                    >
                        Save Bill
                    </button>
                </div>
            </form>
            {showConfirm && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.55)",
                        zIndex: 1050,
                    }}
                    onClick={() => setShowConfirm(false)}
                >
                    <div
                        className="modal-dialog"
                        style={{ maxWidth: "520px", width: "100%" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content bg-white rounded-4 shadow-lg">
                        
                            <div className="modal-header px-4 py-3 border-bottom">
                                <h5 className="modal-title fw-bold">
                                    Confirm Billing
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowConfirm(false)}
                                ></button>
                            </div>

                            <div className="modal-body px-4 py-3">
                            
                                <h6 className="fw-bold mb-3">
                                    Products Summary
                                </h6>

                                <div className="border rounded-3 mb-3">
                                    {Object.values(billingItems).map((item) => (
                                        <div
                                            key={item._id}
                                            className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"
                                        >
                                            <div>
                                                <div className="fw-semibold">
                                                    {item.name}
                                                </div>
                                                <small className="text-muted">
                                                    {item.quantity}{" "}
                                                    {item.orderQuantityType} × ₹
                                                    {getEffectiveUnitPrice(
                                                        item
                                                    ).toFixed(2)}
                                                </small>
                                            </div>
                                            <div className="fw-bold">
                                                ₹{getItemTotal(item).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-light rounded-3 p-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Total</span>
                                        <strong>₹{finalTotal}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Amount Paid</span>
                                        <strong>₹{amountPaid}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between text-danger fw-bold">
                                        <span>Balance</span>
                                        <span>₹{balance}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer px-4 py-3 border-top">
                                <button
                                    className="btn btn-outline-secondary px-4"
                                    onClick={() => setShowConfirm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary px-4 ms-2"
                                    onClick={confirmSaveOrder}
                                >
                                    Confirm & Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Billing;
