import React, { useState } from "react";

const LoginPopUp = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState("Login");

    return (
        <div className="login-popup">
            <form className="login-popup-container  border border-dark border-4">
                <div className="position-relative">
                    <h2>{currState}</h2>

                    <div
                        className="  position-absolute top-0 end-0 hovermanual p-2 text-dark"
                        onClick={() => setShowLogin(false)}
                    >
                        <i class="bi bi-x-circle"></i>
                    </div>
                </div>
                <div>
                    {currState === "Login" ? (
                        <></>
                    ) : (
                        <input
                            type="text"
                            placeholder="Your Name"
                            required
                            className="form-control  mb-2"
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="form-control  mb-2"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        className="form-control  mb-2"
                    />
                </div>

                <button className="btn btn-outline-danger fw-bold fs-6">
                    {currState === "Sign Up" ? "Create account" : "Login"}
                </button>

                <div className="hstack from-group">
                    <input type="checkbox" className="p-5" required></input>
                    <p className="m-2">I agree the terms and condition</p>
                </div>

                {currState === "Login" ? (
                    <p>
                        Create a new account?{" "}
                        <span
                            className="text-danger fw-bold fs-6 text-decoration-underline"
                            onClick={() => setCurrState("Sign up")}
                        >
                            Click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Already have a account?{" "}
                        <span
                            className="text-danger fw-bold fs-6 text-decoration-underline"
                            onClick={() => setCurrState("Login")}
                        >
                            Login here
                        </span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopUp;
