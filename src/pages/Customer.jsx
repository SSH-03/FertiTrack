import React, { useContext, useState } from "react";
import { StoreContext } from "../context/StoreContext";

const Customer = () => {
    const { customers } = useContext(StoreContext);
    const [search, setSearch] = useState("");

    const filtered = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.toString().includes(search)
    );

    return (
        <div className="container">
            {/* Search  */}
            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="form-floating" style={{ width: "50%" }}>
                    <input
                        type="text"
                        className="form-control"
                        id="searchInput"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <label htmlFor="searchInput">Search by name or phone</label>
                </div>

                <button className="btn btn-outline-success ms-3">
                    Add Customer
                </button>
            </div>

            {/* Table */}
            <table className="table table-hover">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Phone</th>
                        <th className="p-2 border">Village</th>
                    </tr>
                </thead>

                <tbody>
                    {filtered.length > 0 ? (
                        filtered.map((item, index) => (
                            <tr key={index} className="">
                                <td className="p-2 border">{item.name}</td>
                                <td className="p-2 border">{item.phone}</td>
                                <td className="p-2 border">{item.village}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="4"
                                className="p-3 text-center text-gray-500"
                            >
                                No matching customers found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Customer;
