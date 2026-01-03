import React, { useContext } from "react";
import { StoreContext } from "../context/StoreContext";

const Profile = () => {
    const { userDetails } = useContext(StoreContext);
    return (
        <div>
            <p>{userDetails.name}</p>
            <p>{userDetails.email}</p>
        </div>
    );
};

export default Profile;
