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
    } = useContext(StoreContext);

    const [amountPaid, setAmountPaid] = useState(0);
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

    const toInputFormat = (dateObj) =>
        new Date(dateObj).toISOString().split("T")[0];

    const calculateTotal = () => {
        let total = 0;
        Object.keys(billingItems).forEach((id) => {
            const qty = billingItems[id];
            const product = ferti_products.find((p) => p._id === id);
            if (product) total += qty * product.unitprice;
        });
        return total;
    };

    const total = calculateTotal();
    const balance = total - amountPaid;

    const saveOrder = () => {
        const newOrder = {
            id: Date.now(),
            customer: selectedCustomer,
            items: billingItems,
            total,
            paid: amountPaid,
            balance,
            nextDoseDate: Object.keys(billingItems).map((id) => {
                const product = ferti_products.find((p) => p._id === id);

                const dose = billingItems[id + "_dose"] ?? product.next_dose;
                const measure =
                    billingItems[id + "_measure"] ?? product.dose_measure;

                const userSelectDate = billingItems[id + "_nextDoseDate"];

                const finalDate = userSelectDate
                    ? new Date(userSelectDate)
                    : addDuration(dose, measure);

                return {
                    productId: id,
                    nextDate: formatPrettyDate(finalDate),
                };
            }),
        };

        setOrders((prev) => [...prev, newOrder]);

        setBillingItems({});
        setAmountPaid(0);

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
            {/* Customer Details */}
            <div className="card p-3 mb-4 shadow-sm">
                <h4>{selectedCustomer.name}</h4>
                <p className="mb-0">📞 {selectedCustomer.phone}</p>
            </div>

            <ProductDisplay />

            {/* Billing Table */}
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
                    </tr>
                </thead>

                <tbody>
                    {Object.keys(billingItems).map((id) => {
                        const qty = billingItems[id];
                        const product = ferti_products.find(
                            (p) => p._id === id
                        );
                        if (!product) return null;

                        const dose =
                            billingItems[id + "_dose"] ?? product.next_dose;
                        const measure =
                            billingItems[id + "_measure"] ??
                            product.dose_measure;

                        const autoDate = addDuration(dose, measure);
                        const userDate = billingItems[id + "_nextDoseDate"];

                        const finalDate = userDate
                            ? new Date(userDate)
                            : autoDate;

                        return (
                            <tr key={id}>
                                <td>{product.name}</td>

                                {/* Qty */}
                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        value={qty}
                                        onChange={(e) =>
                                            setBillingItems((prev) => ({
                                                ...prev,
                                                [id]: Number(e.target.value),
                                            }))
                                        }
                                    />
                                </td>

                                <td>₹{product.unitprice}</td>
                                <td>₹{qty * product.unitprice}</td>

                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        value={dose}
                                        onChange={(e) =>
                                            setBillingItems((prev) => ({
                                                ...prev,
                                                [id + "_dose"]: Number(
                                                    e.target.value
                                                ),
                                            }))
                                        }
                                    />
                                </td>

                                <td>
                                    <select
                                        className="form-select"
                                        value={measure}
                                        onChange={(e) =>
                                            setBillingItems((prev) => ({
                                                ...prev,
                                                [id + "_measure"]:
                                                    e.target.value,
                                            }))
                                        }
                                    >
                                        <option value="day">Day(s)</option>
                                        <option value="week">Week(s)</option>
                                        <option value="month">Month(s)</option>
                                        <option value="year">Year(s)</option>
                                    </select>
                                </td>

                                <td>
                                    <div className="d-flex gap-2">
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={
                                                userDate
                                                    ? userDate
                                                    : toInputFormat(autoDate)
                                            }
                                            onChange={(e) =>
                                                setBillingItems((prev) => ({
                                                    ...prev,
                                                    [id + "_nextDoseDate"]:
                                                        e.target.value,
                                                }))
                                            }
                                        />
                                        <button
                                            className="btn btn-sm btn-warning"
                                            onClick={() =>
                                                setBillingItems((prev) => {
                                                    const updated = { ...prev };
                                                    delete updated[
                                                        id + "_nextDoseDate"
                                                    ];
                                                    return updated;
                                                })
                                            }
                                        >
                                            Reset
                                        </button>
                                    </div>

                                    <div className="fw-bold mt-1">
                                        {formatPrettyDate(finalDate)}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="card p-3 shadow-sm mt-4">
                <div className="mb-3">
                    <label className="form-label fw-bold">Total Amount</label>
                    <input
                        type="text"
                        className="form-control"
                        value={`₹ ${total}`}
                        disabled
                    />
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
                        type="text"
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
