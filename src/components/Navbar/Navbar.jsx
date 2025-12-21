import React, { useContext, useState } from "react";
import { assets } from "../../assets/assests";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");

    const { token, setToken } = useContext(StoreContext);

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
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
                                    onClick={() => setMenu("home")}
                                    className={`nav-link cursor-pointer${
                                        menu === "home"
                                            ? "active border-bottom border-5 border-info"
                                            : ""
                                    }`}
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    to={"customers"}
                                    onClick={() => setMenu("customers")}
                                    className={`nav-link cursor-pointer${
                                        menu === "customers"
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
                                    onClick={() => setMenu("billing")}
                                    className={`nav-link cursor-pointer${
                                        menu === "billing"
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
                                    onClick={() => setMenu("orders")}
                                    className={`nav-link cursor-pointer${
                                        menu === "orders"
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
                                    onClick={() => setMenu("products")}
                                    className={`nav-link cursor-pointer${
                                        menu === "products"
                                            ? "active border-bottom border-5 border-info"
                                            : ""
                                    }`}
                                >
                                    Products
                                </Link>
                            </li>
                        </ul>{" "}
                        <div className=" d-flex">
                            <div>
                                <Link
                                    to={"/contact"}
                                    onClick={() => setMenu("contact")}
                                    className={`nav-link cursor-pointer${
                                        menu === "contact"
                                            ? "active border-bottom border-5 border-success"
                                            : ""
                                    }`}
                                >
                                    Contact For Application problems
                                </Link>
                            </div>
                            {!token ? (
                                <div className="m-2">
                                    {" "}
                                    <button
                                        className="btn btn-success"
                                        onClick={() => setShowLogin(true)}
                                    >
                                        Login
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {" "}
                                    <div>
                                        {" "}
                                        <img
                                            className="ms-4"
                                            src={assets.profile_icon}
                                            // src={assets.Login_icon}
                                            width="30"
                                        />
                                        <p>Profile</p>
                                        {/* <p>Login</p> */}
                                    </div>
                                    <div>
                                        {" "}
                                        <img
                                            className="ms-4"
                                            src={assets.logout_icon}
                                            width="30"
                                            onClick={logout}
                                        />
                                        <p>Logout</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
