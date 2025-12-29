import React, { useContext, useState } from "react";
import { assets } from "../../assets/assests";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = () => {
    const { selectedTab, setSelectedTab, token, setToken } =
        useContext(StoreContext);

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken("");
        navigate("/");
        setSelectedTab("home");
    };
    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand">
                        <img
                            src={assets.FertiTrack_icon}
                            alt="Bootstrap"
                            width="212"
                            height="60"
                        />
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                    >
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link
                                    to={"/"}
                                    onClick={() => setSelectedTab("home")}
                                    className={`nav-link cursor-pointer${
                                        selectedTab === "home"
                                            ? "active border-bottom border-5 border-info"
                                            : ""
                                    }`}
                                >
                                    Home
                                </Link>
                            </li>
                            {token && (
                                <>
                                    <li className="nav-item">
                                        <Link
                                            to={"customers"}
                                            onClick={() =>
                                                setSelectedTab("customers")
                                            }
                                            className={`nav-link cursor-pointer${
                                                selectedTab === "customers"
                                                    ? "active border-bottom border-5 border-info"
                                                    : ""
                                            }`}
                                        >
                                            Customers
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            to={"/billing"}
                                            onClick={() =>
                                                setSelectedTab("billing")
                                            }
                                            className={`nav-link cursor-pointer${
                                                selectedTab === "billing"
                                                    ? "active border-bottom border-5 border-info"
                                                    : ""
                                            }`}
                                        >
                                            Billing
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            to={"/orders"}
                                            onClick={() =>
                                                setSelectedTab("orders")
                                            }
                                            className={`nav-link cursor-pointer${
                                                selectedTab === "orders"
                                                    ? "active border-bottom border-5 border-info"
                                                    : ""
                                            }`}
                                        >
                                            Orders
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            to={"/products"}
                                            onClick={() =>
                                                setSelectedTab("products")
                                            }
                                            className={`nav-link cursor-pointer${
                                                selectedTab === "products"
                                                    ? "active border-bottom border-5 border-info"
                                                    : ""
                                            }`}
                                        >
                                            Products
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            to={"/analytics"}
                                            onClick={() =>
                                                setSelectedTab("analytics")
                                            }
                                            className={`nav-link cursor-pointer${
                                                selectedTab === "analytics"
                                                    ? "active border-bottom border-5 border-info"
                                                    : ""
                                            }`}
                                        >
                                            Analytics
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link
                                            to={"/notifications"}
                                            onClick={() =>
                                                setSelectedTab("notifications")
                                            }
                                            className={`nav-link cursor-pointer${
                                                selectedTab === "notifications"
                                                    ? "active border-bottom border-5 border-info"
                                                    : ""
                                            }`}
                                        >
                                            Notifications
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>{" "}
                        <div className=" d-flex">
                            <div
                                className={`me-2 text-center border px-2 pt-1 border-2 border-dark ${
                                    selectedTab === "contact"
                                        ? "border-bottom-2 bg-secondary bg-opacity-25"
                                        : " border-bottom-0"
                                }`}
                            >
                                <Link
                                    to={"/contact"}
                                    onClick={() => setSelectedTab("contact")}
                                    className={`nav-link cursor-pointer`}
                                >
                                    <img
                                        src={assets.contant_icon}
                                        alt=""
                                        className="ms-4"
                                        width="30"
                                    />
                                    <p>Contact For Application problems</p>
                                </Link>
                            </div>
                            {!token ? (
                                <div>
                                    {" "}
                                    <div
                                        className="d-flex text-center bg-success bg-opacity-10 border border-info rounded-pill px-4 py-2 mt-3"
                                        onClick={() => {
                                            navigate("/");
                                            setSelectedTab("home");
                                        }}
                                    >
                                        Login
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex text-center bg-danger bg-opacity-10 border border-danger rounded-pill px-4 pt-2">
                                    {" "}
                                    <Link
                                        className="nav-link me-2"
                                        to={"/profile"}
                                    >
                                        {" "}
                                        <img
                                            className=""
                                            src={assets.profile_icon}
                                            width="30"
                                        />
                                        <p>Profile</p>
                                    </Link>
                                    <div className="me-2" onClick={logout}>
                                        {" "}
                                        <img
                                            className="ms-4"
                                            src={assets.logout_icon}
                                            width="30"
                                        />
                                        <p>Logout</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <hr class="border border-danger border-2 " />
        </div>
    );
};

export default Navbar;
