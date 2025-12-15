import  { useState } from "react";
import { assets } from "../assets/assests";
import { Link, Outlet } from "react-router-dom";

const Products = () => {
  
      const [menu, setMenu] = useState("list");
  
  return (
      <div>
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
                                  to={"/products/"}
                                  onClick={() => setMenu("list")}
                                  className={`nav-link cursor-pointer${
                                      menu === "list"
                                          ? "active border-bottom border-5 border-info"
                                          : ""
                                  }`}
                              >
                                  List
                              </Link>
                          </li>{" "}
                          <li className="nav-item">
                              <Link
                                  to={"/products/add"}
                                  onClick={() => setMenu("add")}
                                  className={`nav-link cursor-pointer${
                                      menu === "add"
                                          ? "active border-bottom border-5 border-info"
                                          : ""
                                  }`}
                              >
                                  Add
                              </Link>
                          </li>
                      </ul>{" "}
                  </div>
              </div>
          </nav>
          <Outlet />
      </div>
  );
};

export default Products;
