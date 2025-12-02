import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Customer from "./components/Customer";
import Billing from "./components/Billing";
import Orders from "./components/Orders";
import Products from "./components/Products";

function App() {
    return (
        <div className="container-full">
            <Navbar />
            <Routes>
                <Route path="/" element={<Customer/>}/>
                <Route path="/billing" element={<Billing/>}/>
                <Route path="/orders" element={<Orders/>}/>
                <Route path="/products" element={<Products/>}/>
            </Routes>
        </div>
    );
}

export default App;
