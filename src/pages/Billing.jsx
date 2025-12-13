import React, { useContext, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import ProductDisplay from "../components/ProductDisplay";
import { useNavigate } from "react-router-dom";

const Billing = () => {
    const {
        selectedCustomer,
        ferti_products,
        billingItems,
        setBillingItems,
        setOrders,
        removeProduct,
    } = useContext(StoreContext);

    const [paymentMode, setPaymentMode] = useState("");
    const [amountPaid, setAmountPaid] = useState(0);

    // DISCOUNT STATES
    const [autoRound, setAutoRound] = useState(false);
    const [manualMode, setManualMode] = useState(false);
    const [manualDiscount, setManualDiscount] = useState(0);

    const navigate = useNavigate();

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

    const calculateTotal = () => {
        let total = 0;
        Object.keys(billingItems).forEach((id) => {
            const qty = billingItems[id];
            const product = ferti_products.find((p) => p._id === id);
            if (product) {
                total += qty * product.unitprice;
            }
        });
        return total;
    };

    const rawTotal = calculateTotal();

    const getAutoRoundDiscount = (total) => {
        if (total < 10) return 0; // do NOT round small totals
        // const rounded = Math.floor(total / 10) * 10;
        const rounded = Math.floor(total / 100) * 100;
        return total - rounded;
    };

    const autoDiscountAmount = getAutoRoundDiscount(rawTotal);

    // ---------------------------------------------------------------

    const appliedDiscount = autoRound
        ? autoDiscountAmount
        : manualMode
        ? manualDiscount
        : 0;

    const finalTotal = rawTotal - appliedDiscount;

    const balance = finalTotal - amountPaid;

    const saveOrder = () => {
        const orderItems = Object.keys(billingItems).map((id) => {
            const product = ferti_products.find((p) => p._id === id);

            const dose = product.next_dose;
            const measure = product.dose_measure;
            const nextDate = addDuration(dose, measure);

            return {
                productId: id,
                productName: product.name,
                qty: billingItems[id],
                unitPrice: product.unitprice,
                total: billingItems[id] * product.unitprice,
                dose,
                measure,
                nextDoseDate: formatPrettyDate(nextDate),
            };
        });

        const newOrder = {
            id: Date.now(),
            customer: selectedCustomer,
            items: orderItems,
            totalBeforeDiscount: rawTotal,
            discountApplied: appliedDiscount,
            finalTotal,
            paid: amountPaid,
            balance,
            paymentMode,
            orderDate: new Date().toLocaleString(),
        };

        setOrders((prev) => [...prev, newOrder]);

        setBillingItems({});
        setAmountPaid(0);
        setManualDiscount(0);
        setAutoRound(false);
        setManualMode(false);

        navigate("/orders");
    };

    if (!selectedCustomer)
        return (
            <p className="text-danger p-3">
                Please select a customer before billing.
            </p>
        );

    return (
        <div className="container mt-4">
            {/* CUSTOMER CARD */}
            <div className="card p-3 mb-4 shadow-sm">
                <h4>{selectedCustomer.name}</h4>
                <p className="mb-0">📞 {selectedCustomer.phone}</p>
            </div>

            <ProductDisplay />

            {/* TABLE */}
            <h4 className="mt-4">Billing Items</h4>

            <table className="table table-bordered table-striped mt-2">
                <thead className="table-dark">
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                        <th>Next Dose</th>
                        <th>Dose Measure</th>
                        <th>Next Dose Date</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(billingItems).map((id) => {
                        const qty = billingItems[id];
                        const product = ferti_products.find(
                            (p) => p._id === id
                        );
                        if (!product) return null;

                        const dose = product.next_dose;
                        const measure = product.dose_measure;
                        const autoDate = addDuration(dose, measure);

                        return (
                            <tr key={id}>
                                <td>{product.name}</td>

                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="0"
                                        value={qty}
                                        onChange={(e) => {
                                            const newQty = Number(
                                                e.target.value
                                            );
                                            if (newQty <= 0) {
                                                removeProduct(id);
                                            } else {
                                                setBillingItems((prev) => ({
                                                    ...prev,
                                                    [id]: newQty,
                                                }));
                                            }
                                        }}
                                    />
                                </td>

                                <td>₹{product.unitprice}</td>
                                <td>₹{qty * product.unitprice}</td>

                                <td>{dose}</td>
                                <td>{measure}</td>

                                <td>{formatPrettyDate(autoDate)}</td>

                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRemove(id)}
                                    >
                                        X
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* TOTAL + DISCOUNT */}
            <div className="card p-3 shadow-sm mt-4">
                <div className="mb-3">
                    <label className="form-label fw-bold">Total Amount</label>
                    <input
                        className="form-control"
                        value={`₹ ${rawTotal}`}
                        disabled
                    />
                </div>

                {/* AUTO ROUND DISCOUNT */}
                <div className="form-check form-switch mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={autoRound}
                        onChange={(e) => {
                            setAutoRound(e.target.checked);
                            if (e.target.checked) {
                                setManualMode(false);
                                setManualDiscount(0);
                            }
                        }}
                    />
                    <label className="form-check-label fw-bold">
                        Auto Round Discount (round down to nearest 100)
                    </label>
                </div>

                {/* MANUAL DISCOUNT TOGGLE */}
                <div className="form-check form-switch mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={manualMode}
                        onChange={(e) => {
                            setManualMode(e.target.checked);
                            if (e.target.checked) {
                                setAutoRound(false);
                            } else {
                                setManualDiscount(0);
                            }
                        }}
                    />
                    <label className="form-check-label fw-bold">
                        Manual Discount
                    </label>
                </div>

                {/* MANUAL INPUT */}
                {manualMode && !autoRound && (
                    <div className="mb-3">
                        <label className="form-label fw-bold">
                            Enter Discount Amount
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            value={manualDiscount}
                            onChange={(e) =>
                                setManualDiscount(Number(e.target.value))
                            }
                        />
                    </div>
                )}

                {/* Final total */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Final Total</label>
                    <input
                        className="form-control"
                        value={`₹ ${finalTotal}`}
                        disabled
                    />
                </div>

                {/* PAYMENT */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Payment Mode</label>
                    <select
                        className="form-select"
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                    >
                        <option value="">Select Payment Mode</option>
                        <option value="cash">Cash</option>
                        <option value="upi">UPI</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Amount Paid</label>
                    <input
                        type="number"
                        className="form-control"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(Number(e.target.value))}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Balance</label>
                    <input
                        className="form-control"
                        value={`₹ ${balance}`}
                        disabled
                    />
                </div>

                <button className="btn btn-primary w-100" onClick={saveOrder}>
                    Save Bill
                </button>
            </div>
        </div>
    );
};

export default Billing;
