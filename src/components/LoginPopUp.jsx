import axios from "axios";
import React, { useContext, useState } from "react";
import { StoreContext } from "../context/StoreContext";

const LoginPopUp = ({ setShowLogin }) => {
    const { setToken } = useContext(StoreContext);

    const [currState, setCurrState] = useState("Login");

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((data) => ({ ...data, [name]: value }));
    };

    // useEffect(() => {
    //     console.log(data);
    // },[data])

    const onLogin = async (event) => {
        event.preventDefault();
        let newURL = import.meta.env.VITE_BACKEND_URL;
        if (currState === "Login") {
            newURL += "/api/user/login";
        } else {
            newURL += "/api/user/register";
        }

        const response = await axios.post(newURL, data);

        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setShowLogin(false)
        }
        else{
            alert(response.data.message )
        }
    };
    return (
        <div className="login-popup">
            <form
                className="login-popup-container  border border-dark border-4"
                onSubmit={onLogin}
            >
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
                            name="name"
                            onChange={onChangeHandler}
                            value={data.name}
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="form-control  mb-2"
                        name="email"
                        onChange={onChangeHandler}
                        value={data.email}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        className="form-control  mb-2"
                        name="password"
                        onChange={onChangeHandler}
                        value={data.password}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-danger fw-bold fs-6"
                >
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
