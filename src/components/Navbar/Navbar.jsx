import React, { useState } from "react";
import { assets } from "../../assets/assests";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [menu, setMenu] = useState("customers");
    return (
        <div className="container=full">
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand">
                        <img
                            src={assets.FertiTrack_icon}
                            alt="Bootstrap"
                            width="60"
                            height="60"
                        />
                    </a>
                    <button
                        class="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div
                        class="collapse navbar-collapse"
                        id="navbarSupportedContent"
                    >
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <Link
                                    to={"/"}
                                    onClick={() => setMenu("customers")}
                                    class={`nav-link cursor-pointer${
                                        menu === "customers"
                                            ? "active border-bottom border-5 border-info"
                                            : ""
                                    }`}
                                >
                                    Customers
                                </Link>
                            </li>
                            <li class="nav-item">
                                <Link
                                    to={"/billing"}
                                    onClick={() => setMenu("billing")}
                                    class={`nav-link cursor-pointer${
                                        menu === "billing"
                                            ? "active border-bottom border-5 border-info"
                                            : ""
                                    }`}
                                >
                                    Billing
                                </Link>
                            </li>
                            <li class="nav-item">
                                <Link
                                    to={"/orders"}
                                    onClick={() => setMenu("orders")}
                                    class={`nav-link cursor-pointer${
                                        menu === "orders"
                                            ? "active border-bottom border-5 border-info"
                                            : ""
                                    }`}
                                >
                                    Orders
                                </Link>
                            </li>
                            <li class="nav-item">
                                <Link
                                    to={"/products"}
                                    onClick={() => setMenu("products")}
                                    class={`nav-link cursor-pointer${
                                        menu === "products"
                                            ? "active border-bottom border-5 border-info"
                                            : ""
                                    }`}
                                >
                                    Products
                                </Link>
                            </li>
                        </ul>{" "}
                        <div class=" d-flex">
                            <div>
                                <Link
                                    to={"/contact"}
                                    onClick={() => setMenu("contact")}
                                    class={`nav-link cursor-pointer${
                                        menu === "contact"
                                            ? "active border-bottom border-5 border-success"
                                            : ""
                                    }`}
                                >
                                    Contact For Application problems
                                </Link>
                            </div>

                            <div >
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
                            <div >
                                {" "}
                                <img
                                    className="ms-4"
                                    src={assets.logout_icon}
                                    width="30"
                                />
                                <p>Logout</p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
