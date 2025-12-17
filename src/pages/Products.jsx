import { useState } from "react";
import { assets } from "../assets/assests";
import { Link, Outlet } from "react-router-dom";

const Products = () => {
    const [menu, setMenu] = useState("list");

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
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
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                            <li className="nav-item mx-4">
                                <Link
                                    to={"/products/"}
                                    onClick={() => setMenu("list")}
                                    className={`nav-link px-4 ${
                                        menu === "list"
                                            ? "active border-bottom border-4 border-info"
                                            : ""
                                    }`}
                                >
                                    List
                                </Link>
                            </li>

                            <li className="nav-item mx-4">
                                <Link
                                    to={"/products/add"}
                                    onClick={() => setMenu("add")}
                                    className={`nav-link px-4 ${
                                        menu === "add"
                                            ? "active border-bottom border-4 border-info"
                                            : ""
                                    }`}
                                >
                                    Add
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>
    );
};

export default Products;
