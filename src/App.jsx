import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Customer from "./pages/Customer";
import Billing from "./pages/Billing";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import { useState } from "react";
import LoginPopUp from "./components/LoginPopUp";
import ProductList from "./pages/ProductList";
import ProductAdd from "./pages/ProductAdd";
import Home from "./pages/Home";

import { ToastContainer, toast } from "react-toastify";

function App() {
    // const [activeTab, setActiveTab] = useState("customers");
    const [showLogin, setShowLogin] = useState(false);

    return (
        <>
        <ToastContainer/>
            {showLogin ? <LoginPopUp setShowLogin={setShowLogin} /> : <></>}
            <div className="container-full">
                <Navbar setShowLogin={setShowLogin} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/customers" element={<Customer />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/products" element={<Products />}>
                        <Route path="/products/" element={<ProductList />} />
                        <Route path="/products/add" element={<ProductAdd />} />
                    </Route>
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
