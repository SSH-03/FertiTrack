import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Customer from "./pages/Customer";
import Billing from "./pages/Billing";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import { useState } from "react";

function App() {
        const [activeTab, setActiveTab] = useState("customers");

    return (
        <div className="container-full">
            <Navbar />
            <Routes>
                <Route path="/" element={<Customer/>}/>
                <Route path="/billing" element={<Billing/>}/>
                <Route path="/orders" element={<Orders/>}/>
                <Route path="/products" element={<Products/>}/>
                <Route path="/contact" element={<Contact/>}/>
                
            </Routes>
        </div>
    );
}

export default App;
