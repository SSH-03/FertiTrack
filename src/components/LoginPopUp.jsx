import axios from "axios";
import React, { useContext, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

const LoginPopUp = () => {
    const { setToken, setSelectedTab } = useContext(StoreContext);
    
    const navigate = useNavigate();

    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const onChangeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const onLogin = async (e) => {
        e.preventDefault();

        let url = import.meta.env.VITE_BACKEND_URL;
        url += currState === "Login" ? "/api/user/login" : "/api/user/register";

        try {
            const response = await axios.post(url, data);

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                navigate("customers")
                setSelectedTab("customers")
                
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("Server error");
        }
    };

    return (
        <div className="card shadow p-4">
            <h4 className="text-center mb-3">{currState}</h4>

            <form onSubmit={onLogin}>
                {/* Name (Signup only) */}
                {currState === "Sign Up" && (
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Your Name"
                        name="name"
                        value={data.name}
                        onChange={onChangeHandler}
                        required
                    />
                )}

                {/* Email */}
                <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="Email"
                    name="email"
                    value={data.email}
                    onChange={onChangeHandler}
                    required
                />

                {/* Password */}
                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    name="password"
                    value={data.password}
                    onChange={onChangeHandler}
                    required
                />

                {/* Terms */}
                <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        required
                    />
                    <label className="form-check-label">
                        I agree to the terms & conditions
                    </label>
                </div>

                {/* Submit */}
                <button className="btn btn-danger w-100 fw-bold">
                    {currState === "Login" ? "Login" : "Create Account"}
                </button>
            </form>

           
            {/* <p className="text-center mt-3 mb-0">
                {currState === "Login" ? (
                    <>
                        New user?{" "}
                        <span
                            className="text-danger fw-bold"
                            role="button"
                            onClick={() => setCurrState("Sign Up")}
                        >
                            Sign up
                        </span>
                    </>
                ) : (
                    <>
                        Already have an account?{" "}
                        <span
                            className="text-danger fw-bold"
                            role="button"
                            onClick={() => setCurrState("Login")}
                        >
                            Login
                        </span>
                    </>
                )}
            </p> */}
        </div>
    );
};

export default LoginPopUp;
