import React, { useContext, useState } from "react";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import FarmLoading from "../components/Loading/FarmLoading";

const Customer = () => {
    const { customers, setSelectedCustomer, fetchCustomers, setSelectedTab, loading } =
        useContext(StoreContext);

    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        village: "",
    });

    const filtered = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.toString().includes(search)
    );

    const handleSelect = (customer) => {
        setSelectedCustomer(customer);
        console.log(customer);
        setSelectedTab("billing");
        navigate("/billing");
    };

    const openAdd = () => {
        setEditingId(null);
        setFormData({ name: "", phone: "", village: "" });
        setShowModal(true);
    };

    const openEdit = (e, customer) => {
        e.stopPropagation();
        setEditingId(customer._id);
        setFormData({
            name: customer.name,
            phone: customer.phone,
            village: customer.village,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.name || formData.name.length < 3) {
            return toast.error("Enter valid name");
        }

        if (!/^[6-9]\d{9}$/.test(formData.phone)) {
            return toast.error("Enter valid phone number");
        }

        try {
            const url = editingId
                ? `/api/customer/update/${editingId}`
                : "/api/customer/add";

            const method = editingId ? "put" : "post";

            const res = await axios[method](
                import.meta.env.VITE_BACKEND_URL + url,
                formData
            );

            if (res.data.success) {
                toast.success(res.data.message);
                setShowModal(false);
                fetchCustomers();
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Customer data failed to Save");
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();

        if (!window.confirm("Delete this customer?")) return;

        const res = await axios.delete(
            import.meta.env.VITE_BACKEND_URL + `/api/customer/delete/${id}`
        );

        if (res.data.success) {
            toast.success("Customer deleted");
            fetchCustomers();
        }
    };

    if (loading) {
        return <FarmLoading text="Customers data is loading......" />;
    }

    return (
        <div className="container">
            {/* Search */}
            <div className="d-flex justify-content-between my-3">
                <div className="form-floating" style={{ width: "50%" }}>
                    {" "}
                    <input
                        type="text"
                        className="form-control"
                        id="searchInput"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />{" "}
                    <label htmlFor="searchInput">Search by name or phone</label>{" "}
                </div>
                <div>
                    {" "}
                    <button className="btn btn-success" onClick={openAdd}>
                        Add Customer
                    </button>
                </div>
            </div>

            {/* Table */}
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Village</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td
                                colSpan="4"
                                className="text-center text-muted py-4"
                            >
                                No customers found
                            </td>
                        </tr>
                    ) : (
                        filtered.map((c) => (
                            <tr
                                key={c._id}
                                onClick={() => handleSelect(c)}
                                style={{ cursor: "pointer" }}
                            >
                                <td>{c.name}</td>
                                <td>{c.phone}</td>
                                <td>{c.village}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={(e) => openEdit(e, c)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={(e) => handleDelete(e, c._id)}
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
                        className="bg-white p-4 rounded"
                        style={{ width: 400 }}
                    >
                        <h5>{editingId ? "Edit Customer" : "Add Customer"}</h5>

                        <input
                            className="form-control my-2"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value.replace(
                                        /[^a-zA-Z\s]/g,
                                        ""
                                    ),
                                })
                            }
                        />

                        <input
                            className="form-control my-2"
                            placeholder="Phone"
                            maxLength={10}
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    phone: e.target.value.replace(/\D/g, ""),
                                })
                            }
                        />

                        <input
                            className="form-control my-2"
                            placeholder="Village"
                            value={formData.village}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    village: e.target.value,
                                })
                            }
                        />

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
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customer;
