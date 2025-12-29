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
import Home from "./pages/Home";

import { ToastContainer, toast } from "react-toastify";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

function App() {
    // const [activeTab, setActiveTab] = useState("customers");

    return (
        <>
            <ToastContainer />
           
            <div className="container-full">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/customers" element={<Customer />} />
                    <Route path="/billing" element={<Billing />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/products" element={<Products />}>
                       
                    </Route>
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/profile" element={<Profile />} />

                </Routes>
            </div>
        </>
    );
}

export default App;
