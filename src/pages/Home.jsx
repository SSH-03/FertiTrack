import React, { useContext } from "react";
import Loading from "../components/Loading";
import LoginPopUp from "../components/LoginPopUp";
import { StoreContext } from "../context/StoreContext";

const Home = () => {
    const { token } = useContext(StoreContext);
    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center">
            <div className="row w-100">
                {/* Left Section */}
                <div className={token ? "col-md-12" : "col-md-8"}>
                    <Loading />
                </div>

                {!token && (
                    <div className="col-md-4 d-flex justify-content-center align-items-center">
                        <LoginPopUp />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
