import React, { useContext, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import ProductDisplay from "../components/ProductDisplay";
import { useNavigate } from "react-router-dom";

const Billing = () => {
    const { selectedCustomer, billingItems, setBillingItems, setOrders } =
        useContext(StoreContext);

    const navigate = useNavigate();

    /* -------------------- PAYMENT & DISCOUNT STATES -------------------- */
    const [amountPaid, setAmountPaid] = useState(0);
    const [paymentMode, setPaymentMode] = useState("");

    const [autoDiscount, setAutoDiscount] = useState(false);
    const [manualDiscountEnabled, setManualDiscountEnabled] = useState(false);
    const [manualDiscount, setManualDiscount] = useState(0);

    /* -------------------- DATE HELPERS -------------------- */
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

    /* -------------------- TOTAL CALCULATION -------------------- */
    const total = Object.values(billingItems).reduce(
        (sum, item) => sum + item.quantity * item.unitprice,
        0
    );

    /* -------------------- DISCOUNT LOGIC -------------------- */
    let discountAmount = 0;

    if (autoDiscount) {
        discountAmount = total - Math.floor(total / 100) * 100;
    }

    if (manualDiscountEnabled) {
        discountAmount = manualDiscount;
    }

    const finalTotal = Math.max(total - discountAmount, 0);
    const balance = finalTotal - amountPaid;

    /* -------------------- SAVE ORDER -------------------- */
    const saveOrder = () => {
        const productsArray = Object.values(billingItems).map((item) => {
            const autoDate = addDuration(item.next_dose, item.dose_measure);
            const finalDate = item.nextDoseDate
                ? new Date(item.nextDoseDate)
                : autoDate;

            return {
                ...item,
                nextDoseDate: finalDate,
                nextDosePretty: formatPrettyDate(finalDate),
                totalPrice: item.quantity * item.unitprice,
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

        console.log("ORDER DATA 👉", newOrder);

        setOrders((prev) => [...prev, newOrder]);
        setBillingItems({});
        setAmountPaid(0);

        navigate("/orders");
    };

    if (!selectedCustomer) {
        return (
            <p className="text-danger p-3">
                Please select a customer before billing.
            </p>
        );
    }

    return (
        <div className="container mt-4">
            {/* Customer */}
            <div className="card p-3 mb-4 shadow-sm">
                <h4>{selectedCustomer.name}</h4>
                <p className="mb-0">📞 {selectedCustomer.phone}</p>
            </div>

            <ProductDisplay />

            {/* -------------------- BILLING TABLE (UNCHANGED) -------------------- */}
            <h4 className="mt-4">Billing Items</h4>

            <table className="table table-bordered table-striped mt-2">
                <thead className="table-dark">
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                        <th>Next Dose</th>
                        <th>Measure</th>
                        <th>Next Dose Date</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.values(billingItems).map((item) => {
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
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1"
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

                                <td>₹{item.unitprice}</td>
                                <td>₹{item.quantity * item.unitprice}</td>

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
                                        <option value="week">Week</option>
                                        <option value="month">Month</option>
                                        <option value="year">Year</option>
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
                    })}
                </tbody>
            </table>

            {/* -------------------- PAYMENT & DISCOUNT -------------------- */}
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
                            setManualDiscountEnabled(!manualDiscountEnabled);
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
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                />

                <label className="fw-bold">Balance</label>
                <input
                    className="form-control mb-3"
                    value={`₹ ${balance}`}
                    disabled
                />

                <button className="btn btn-primary w-100" onClick={saveOrder}>
                    Save Bill
                </button>
            </div>
        </div>
    );
};

export default Billing;
