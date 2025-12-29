import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [openOrder, setOpenOrder] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("upi");
    const [confirmCancel, setConfirmCancel] = useState(null);
    const [confirmPayment, setConfirmPayment] = useState(null);

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const fetchOrders = async () => {
        try {
            const response = await axios.get(
                import.meta.env.VITE_BACKEND_URL + "/api/order/list"
            );

            if (response.data.success) {
                setOrders(response.data.data || []);
            } else {
                toast.error(response.data.message);

                setOrders([]);
            }
        } catch (error) {
            toast.error("Server error");
            setOrders([]);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []);

    const cancelOrderHandler = async (orderId) => {
        const response = await axios.post(`${API_URL}/api/order/cancelorder`, {
            orderId,
            ordercanceled: true,
        });

        if (response.data.success) {
            fetchOrders();
            setConfirmCancel(null);
        }
    };

    const payInstallment = async (orderId) => {
        if (!paymentAmount || paymentAmount <= 0) {
            toast.warning("Enter a valid amount");
            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}/api/order/pay-installment`,
                {
                    orderId,
                    amount: Number(paymentAmount),
                    mode: paymentMode,
                }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                setPaymentAmount("");
                fetchOrders();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Server error");
            console.error(error);
        }
    };

    return (
        <>
            <div className="container mt-4">
                {orders.map((order, index) => (
                    <div
                        className={`card mb-3 ${
                            order.ordercanceled ? "border-danger" : ""
                        }`}
                        key={order._id}
                    >
                        <div
                            className="card-header d-flex justify-content-between"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                                setOpenOrder(openOrder === index ? null : index)
                            }
                        >
                            <div>
                                <div className="fw-semibold">
                                    Name: {order.customer.name}
                                </div>{" "}
                                <small className="text-muted">
                                    📞 {order.customer.phone}
                                </small>
                                <small className="text-muted d-block">
                                    <b>Village:</b> {order.customer.village}
                                </small>
                            </div>

                            {!(openOrder === index) ? (
                                <div>
                                    <span className="badge bg-warning me-2">
                                        Total ₹{order.billingSummary.total}
                                    </span>
                                    <span className="badge bg-info me-2">
                                        Discount ₹
                                        {order.billingSummary.discountAmount}
                                    </span>
                                    <span className="badge bg-success me-2">
                                        Final Total ₹
                                        {order.billingSummary.finalTotal}
                                    </span>

                                    {order.balance === 0 ? (
                                        <span className="badge bg-success ">
                                            Fully Paid
                                        </span>
                                    ) : (
                                        <span className="badge bg-danger">
                                            Balance ₹{order.balance}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                ""
                            )}
                        </div>

                        {openOrder === index && (
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h5>Products</h5>

                                        <ul className="list-group mb-3">
                                            {order.products.map((p, i) => (
                                                <li
                                                    key={i}
                                                    className="list-group-item"
                                                >
                                                    <div className="d-flex justify-content-between fw-semibold">
                                                        <span>{p.name}</span>
                                                        <span>
                                                            ₹{p.unitprice}
                                                        </span>
                                                    </div>

                                                    <div className="d-flex justify-content-between small text-muted">
                                                        <span>
                                                            Qty: {p.quantity}{" "}
                                                            {p.quantityType}
                                                        </span>
                                                        <span>
                                                            Total: ₹
                                                            {p.unitprice *
                                                                p.quantity}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* PRODUCT SUMMARY */}
                                        <div className="border rounded p-3 bg-light">
                                            <div className="d-flex justify-content-between mb-1">
                                                <span>Total Products</span>
                                                <span>
                                                    {order.products.length}
                                                </span>
                                            </div>

                                            <div className="d-flex justify-content-between">
                                                <span>Subtotal</span>
                                                <span>
                                                    ₹
                                                    {order.billingSummary.total}
                                                </span>
                                            </div>

                                            <div className="d-flex justify-content-between text-warning">
                                                <span>Discount</span>
                                                <span>
                                                    - ₹
                                                    {
                                                        order.billingSummary
                                                            .discountAmount
                                                    }
                                                </span>
                                            </div>

                                            <hr className="my-2" />

                                            <div className="d-flex justify-content-between fw-bold">
                                                <span>Final Total</span>
                                                <span>
                                                    ₹
                                                    {
                                                        order.billingSummary
                                                            .finalTotal
                                                    }
                                                </span>
                                            </div>

                                            <div className="d-flex justify-content-between text-danger">
                                                <span>Balance</span>
                                                <span>₹{order.balance}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <h5>Payments</h5>

                                        <ul className="list-group mb-3">
                                            {order.payments.map((pay, i) => (
                                                <li
                                                    key={i}
                                                    className="list-group-item d-flex justify-content-between"
                                                >
                                                    <span>
                                                        {pay.mode.toUpperCase()}{" "}
                                                        (
                                                        {new Date(
                                                            pay.date
                                                        ).toLocaleDateString()}{" "}
                                                        {new Date(
                                                            pay.date
                                                        ).toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                        )
                                                    </span>

                                                    <span>₹{pay.amount}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        {!order.ordercanceled && (
                                            <div className="border p-3 rounded mb-2">
                                                <input
                                                    type="number"
                                                    className="form-control mb-2"
                                                    placeholder="Enter amount"
                                                    value={paymentAmount}
                                                    onChange={(e) =>
                                                        setPaymentAmount(
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <select
                                                    className="form-select mb-2"
                                                    value={paymentMode}
                                                    onChange={(e) =>
                                                        setPaymentMode(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="upi">
                                                        UPI
                                                    </option>
                                                    <option value="cash">
                                                        Cash
                                                    </option>
                                                    <option value="card">
                                                        Card
                                                    </option>
                                                </select>
                                                <button
                                                    className="btn btn-primary w-100"
                                                    onClick={() => {
                                                        if (
                                                            !paymentAmount ||
                                                            paymentAmount <= 0
                                                        ) {
                                                            toast.warning(
                                                                "Enter a valid amount"
                                                            );
                                                            return;
                                                        }

                                                        setConfirmPayment({
                                                            orderId: order._id,
                                                            amount: Number(
                                                                paymentAmount
                                                            ),
                                                            mode: paymentMode,
                                                        });
                                                    }}
                                                >
                                                    Pay
                                                </button>
                                            </div>
                                        )}

                                        {order.ordercanceled ? (
                                            <span className="badge bg-secondary w-100 py-2">
                                                Order Canceled
                                            </span>
                                        ) : (
                                            <button
                                                className="btn btn-outline-danger w-100"
                                                onClick={() =>
                                                    setConfirmCancel(order)
                                                }
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {confirmCancel && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.55)",
                        zIndex: 1050,
                    }}
                    onClick={() => setConfirmCancel(null)}
                >
                    <div
                        className="modal-dialog"
                        style={{ maxWidth: "500px", width: "100%" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content bg-white rounded-4 shadow-lg border-danger">
                            <div className="modal-header px-4 py-3 border-bottom">
                                <h5 className="modal-title fw-bold text-danger">
                                    Confirm Cancel Order
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setConfirmCancel(null)}
                                ></button>
                            </div>

                            <div className="modal-body px-4 py-3">
                                <p>
                                    <b>Order ID:</b> {confirmCancel.orderId}
                                </p>
                                <p>
                                    <b>Customer:</b>{" "}
                                    {confirmCancel.customer.name}
                                </p>
                                <p>
                                    <b>Total:</b> ₹
                                    {confirmCancel.billingSummary.finalTotal}
                                </p>

                                <div className="alert alert-danger mt-3 mb-0">
                                    Are you sure you want to cancel this order?
                                    <br />
                                    <small>This action cannot be undone.</small>
                                </div>
                            </div>

                            <div className="modal-footer px-4 py-3 border-top">
                                <button
                                    className="btn btn-outline-secondary px-4"
                                    onClick={() => setConfirmCancel(null)}
                                >
                                    No
                                </button>
                                <button
                                    className="btn btn-danger px-4 ms-2"
                                    onClick={() =>
                                        cancelOrderHandler(confirmCancel._id)
                                    }
                                >
                                    Yes, Cancel Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {confirmPayment && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.6)",
                        zIndex: 1060,
                    }}
                >
                    <div
                        className="modal-dialog"
                        style={{ maxWidth: "450px", width: "100%" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content bg-white text-dark rounded-4 shadow-lg">
                            <div className="modal-header px-4 py-3">
                                <h5 className="modal-title fw-bold">
                                    Confirm Payment
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setConfirmPayment(null)}
                                ></button>
                            </div>

                            <div className="modal-body px-4 py-3">
                                <div className="mb-2">
                                    <strong>Amount:</strong> ₹
                                    {confirmPayment.amount}
                                </div>
                                <div className="mb-3">
                                    <strong>Mode:</strong>{" "}
                                    {confirmPayment.mode.toUpperCase()}
                                </div>

                                <div className="alert alert-warning mb-0">
                                    Are you sure you want to proceed with this
                                    payment?
                                </div>
                            </div>

                            <div className="modal-footer px-4 py-3">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => setConfirmPayment(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-success ms-2"
                                    onClick={() => {
                                        payInstallment(confirmPayment.orderId);
                                        setConfirmPayment(null);
                                    }}
                                >
                                    Yes, Pay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Orders;
