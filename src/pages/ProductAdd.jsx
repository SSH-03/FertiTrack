import React, { useState } from "react";
import { assets } from "../assets/assests";

const ProductAdd = () => {
    const[image, setImage] = useState(false)
    return (
        <div className="">
            <form>
                <div>
                    <p>Upload Image</p>
                    <lable htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) :assets.add_big_icon} alt="Upload Image" width={"40"}/>
                    </lable>
                    <input onChange={(e) =>setImage(e.target.files[0])} type="file" id="image"  required />
                </div>
                <div>
                    <p>Product name</p>
                    <input type="text" name="name" placeholder="Type here" />
                </div>
                <div>
                    <p>Product Description</p>
                    <input
                        type="text"
                        name="description"
                        rows="6 "
                        placeholder="Type here"
                        required
                    />
                </div>
                <div>
                    <div className="flex">
                        <p>Product Category</p>
                        <select name="category">
                            <option value="Chemical">Chemical</option>
                        </select>
                    </div>
                    <div>
                        <p>Product Price</p>
                        <input type="Number" name="price" placeholder="32/-" />
                    </div>
                </div>
                <button type="submit">ADD</button>
            </form>
        </div>
    );
};

export default ProductAdd;
