import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../context/StoreContext";
import FarmLoading from "../components/Loading/FarmLoading";
import { assets } from "../assets/assests";

const Products = () => {
    const { ferti_products, fetchProductList, loading } =
        useContext(StoreContext);

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [image, setImage] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        next_dose: 0,
        dose_measure: "month",
        unitprice: 0,
        quantityType: "",
        quantity: 0,
    });

    /* ================= FILTER ================= */
    const filteredProducts = ferti_products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    /* ================= OPEN ADD ================= */
    const openAdd = () => {
        setEditingId(null);
        setImage(null);
        setFormData({
            name: "",
            description: "",
            next_dose: 0,
            dose_measure: "month",
            unitprice: 0,
            quantityType: "",
            quantity: 0,
        });
        setShowModal(true);
    };

    /* ================= OPEN EDIT ================= */
    const openEdit = (e, product) => {
        e.stopPropagation();
        setEditingId(product._id);
        setImage(null);
        setFormData({
            name: product.name,
            description: product.description,
            next_dose: product.next_dose,
            dose_measure: product.dose_measure,
            unitprice: product.unitprice,
            quantityType: product.quantityType,
            quantity: product.quantity,
        });
        setShowModal(true);
    };

    /* ================= SAVE ================= */
    const handleSave = async () => {
        if (!formData.name || formData.name.length < 3) {
            return toast.error("Enter valid product name");
        }

        if (!formData.quantityType) {
            return toast.error("Quantity type required");
        }

        try {
            const form = new FormData();
            Object.entries(formData).forEach(([key, value]) =>
                form.append(key, value)
            );

            if (image) form.append("image", image);

            const url = editingId
                ? `/api/product/update/${editingId}`
                : `/api/product/add`;

            const method = editingId ? "put" : "post";

            const res = await axios[method](
                import.meta.env.VITE_BACKEND_URL + url,
                form
            );

            if (res.data.success) {
                toast.success(res.data.message);
                setShowModal(false);
                fetchProductList();
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Product save failed");
        }
    };

    /* ================= DELETE ================= */
    const handleDelete = async (e, id) => {
        e.stopPropagation();

        if (!window.confirm("Delete this product?")) return;

        try {
            const res = await axios.delete(
                import.meta.env.VITE_BACKEND_URL + `/api/product/delete/${id}`
            );

            if (res.data.success) {
                toast.success("Product deleted");
                fetchProductList();
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Delete failed");
        }
    };

    if (loading) {
        return <FarmLoading text="Products data is loading..." />;
    }

    return (
        <div className="container">
            {/* SEARCH + ADD */}
            <div className="d-flex justify-content-between my-3">
                <div className="form-floating w-50">
                    <input
                        className="form-control"
                        placeholder="Search product"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <label>Search product</label>
                </div>

                <button className="btn btn-success" onClick={openAdd}>
                    Add Product
                </button>
            </div>

            {/* TABLE */}
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Next Dose</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredProducts.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center text-muted">
                                No products found
                            </td>
                        </tr>
                    ) : (
                        filteredProducts.map((item) => (
                            <tr key={item._id}>
                                <td>
                                    <img
                                        src={
                                            import.meta.env.VITE_BACKEND_URL +
                                            "/images/" +
                                            item.image
                                        }
                                        alt=""
                                        width="45"
                                        height="45"
                                    />
                                </td>
                                <td>{item.name}</td>
                                <td>
                                    ₹ {item.unitprice}/{item.quantityType}
                                </td>
                                <td>
                                    {item.quantity.toFixed(2)} {item.quantityType}
                                </td>
                                <td>
                                    {item.next_dose} {item.dose_measure}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={(e) => openEdit(e, item)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={(e) =>
                                            handleDelete(e, item._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* MODAL */}
            {showModal && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
                    <div
                        className="bg-white rounded shadow p-2"
                        style={{ width: 600 }}
                    >
                        {/* Header */}
                        <div className="card-header bg-primary text-white rounded">
                            <h5 className="mb-0 p-1">
                                {editingId ? "Edit Product" : "Add New Product"}
                            </h5>
                        </div>

                        {/* Body */}
                        <div className="card-body">
                            {/* Image Upload */}
                            <div className="mb-4 text-center">
                                <label className="fw-bold d-block mb-2">
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
                                    style={{ width: "80px" }}
                                />
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={(e) =>
                                        setImage(e.target.files[0])
                                    }
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
                                    placeholder="Enter product name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    Product Description
                                </label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter product description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Dose Row */}
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">
                                        Dose Measure
                                    </label>
                                    <select
                                        className="form-select"
                                        value={formData.dose_measure}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                dose_measure: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="year">Year</option>
                                        <option value="month">Month</option>
                                        <option value="week">Week</option>
                                        <option value="day">Day</option>
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">
                                        Next Dose
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="e.g. 2"
                                        value={formData.next_dose}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                next_dose: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Pricing & Quantity */}
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">
                                        Quantity Type
                                    </label>
                                    <select
                                        className="form-select"
                                        value={formData.quantityType}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                quantityType: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">Select</option>
                                        <option value="g">Grams (g)</option>
                                        <option value="kg">
                                            Kilograms (kg)
                                        </option>
                                        <option value="ton">Tons</option>
                                    </select>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">
                                        Unit Price (₹ /{" "}
                                        {formData.quantityType || "unit"})
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Enter unit price"
                                        value={formData.unitprice}
                                        disabled={!formData.quantityType}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                unitprice: Number(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                    />

                                    {formData.unitprice > 0 &&
                                        formData.quantityType && (
                                            <small className="text-muted">
                                                Stored as ₹{" "}
                                                {formData.quantityType === "g"
                                                    ? formData.unitprice
                                                    : formData.quantityType ===
                                                      "kg"
                                                    ? (
                                                          formData.unitprice /
                                                          1000
                                                      ).toFixed(4)
                                                    : (
                                                          formData.unitprice /
                                                          1000000
                                                      ).toFixed(6)}{" "}
                                                per gram
                                            </small>
                                        )}
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Enter quantity"
                                        value={formData.quantity}
                                        onChange={(e) => {
                                            const inputQty = Number(
                                                e.target.value
                                            );
                                            let calculatedQty = inputQty;

                                            if (
                                                formData.quantityType === "kg"
                                            ) {
                                                calculatedQty = inputQty * 1000;
                                            } else if (
                                                formData.quantityType === "ton"
                                            ) {
                                                calculatedQty =
                                                    inputQty * 1000000;
                                            }

                                            setFormData({
                                                ...formData,
                                                quantity: inputQty,
                                                calculatedQuantity:
                                                    calculatedQty, // optional
                                            });
                                        }}
                                    />
                                    {formData.quantityType && (
                                        <small className="text-muted">
                                            Stored as{" "}
                                            {formData.quantityType === "g"
                                                ? formData.quantity
                                                : formData.quantityType === "kg"
                                                ? formData.quantity * 1000
                                                : formData.quantity *
                                                  1000000}{" "}
                                            grams
                                        </small>
                                    )}
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="text-end">
                                <button
                                    className="btn btn-secondary me-2"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={handleSave}
                                >
                                    {editingId
                                        ? "Update Product"
                                        : "Add Product"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
