import React, { useState } from "react";

const LoginPopUp = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState("Sign Up");

    return (
        <div className="login-popup">
            <form className="login-popup-container  border border-dark border-4">
                <div className="position-relative">
                    <h2>{currState}</h2>

                    <div className="  position-absolute top-0 end-0 hovermanual p-2 text-dark">
                        <i class="bi bi-x-circle"></i>
                    </div>
                </div>
                <div>
                    {currState === "Login" ? (
                        <></>
                    ) : (
                        <input type="text" placeholder="Your Name" required />
                    )}

                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Password" required />
                </div>
                <button>
                    {currState === "Sign Up" ? "Create account" : "Login"}
                </button>
                <div>
                    <input type="checkbox" required />
                    <p>I agree the terms and condition</p>
                </div>
                {currState === "Login" ? (
                    <p>
                        Create a new account?{" "}
                        <span onClick={() => setCurrState("Sign up")}>
                            Click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Already have a account?{" "}
                        <span onClick={() => setCurrState("Login")}>
                            Login here
                        </span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopUp;
