import React, { useEffect, useState } from "react";
import { assets } from "../assets/assests";
import axios from "axios";
import { toast } from "react-toastify";

const ProductAdd = () => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",

        next_dose: 0,
        dose_measure: "month",
        unitprice: 0,
        quantityType: "",

        quantity: 0,
        description: "",
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((data) => ({ ...data, [name]: value }));
    };

    // useEffect(()=>{
    //     console.log(data);

    // },[data])

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("image", image);
        formData.append("next_dose", Number(data.next_dose));
        formData.append("dose_measure", data.dose_measure);
        formData.append("unitprice", Number(data.unitprice));
        formData.append("quantityType", data.quantityType);
        formData.append("quantity", Number(data.quantity));
        formData.append("description", data.description);

        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/product/add`,
            formData
        );
        if (response.data.success) {
            setData({
                name: "",

                next_dose: 0,
                dose_measure: "month",
                unitprice: 0,
                quantityType: "",

                quantity: 0,
                description: "",
            });
            setImage(false);
            toast.success(response.data.message)
        } else {
            toast.error(response.data.message)
            
        }
        console.log(import.meta.env.VITE_BACKEND_URL);
        
    };

    return (
        <div className="container my-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Add New Product</h5>
                </div>

                <div className="card-body">
                    <form onSubmit={onSubmitHandler}>
                        {/* Image Upload */}
                        <div className="mb-4 text-center">
                            <label
                                htmlFor="image"
                                className="d-block mb-2 fw-bold"
                            >
                                Upload Product Image
                            </label>
                            <img
                                src={
                                    image
                                        ? URL.createObjectURL(image)
                                        : assets.add_big_icon
                                }
                                alt="Upload"
                                className="img-thumbnail mb-2"
                                style={{ width: "80px", cursor: "pointer" }}
                            />
                            <input
                                type="file"
                                id="image"
                                className="form-control"
                                onChange={(e) => setImage(e.target.files[0])}
                                required
                            />
                        </div>

                        {/* Product Name */}
                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                Product Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="Enter product name"
                                value={data.name}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                Product Description
                            </label>
                            <textarea
                                className="form-control"
                                name="description"
                                rows="3"
                                placeholder="Enter product description"
                                value={data.description}
                                onChange={onChangeHandler}
                                required
                            />
                        </div>

                        {/* Grid Row */}
                        <div className="row">
                            {/* Dose Measure */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">
                                    Dose Measure
                                </label>
                                <select
                                    className="form-select"
                                    name="dose_measure"
                                    onChange={onChangeHandler}
                                >
                                    <option value="year">Year</option>
                                    <option value="month">Month</option>
                                    <option value="week">Week</option>
                                    <option value="day">Day</option>
                                </select>
                            </div>

                            {/* Next Dose */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">
                                    Next Dose
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="next_dose"
                                    placeholder="e.g. 2"
                                    value={data.next_dose}
                                    onChange={onChangeHandler}
                                />
                            </div>
                        </div>

                        {/* Pricing & Quantity */}
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-bold">
                                    Unit Price (₹)
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="unitprice"
                                    placeholder="e.g. 50"
                                    value={data.unitprice}
                                    onChange={onChangeHandler}
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-bold">
                                    Quantity Type
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="quantityType"
                                    placeholder="G / KG / Tones"
                                    value={data.quantityType}
                                    onChange={onChangeHandler}
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label fw-bold">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="quantity"
                                    placeholder="Enter quantity"
                                    value={data.quantity}
                                    onChange={onChangeHandler}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="text-end">
                            <button
                                type="submit"
                                className="btn btn-success px-4"
                            >
                                Add Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductAdd;
