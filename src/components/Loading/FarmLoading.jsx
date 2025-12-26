import React from "react";
import "./FarmLoading.css";

const FarmLoading = ({
    text = "Applying fertilizer… tree growing healthy 🌳",
}) => {
    return (
        <div className="farm-loader-wrapper">
            <p className="loading-text">{text}</p>
            <div className="farm-scene">
                <div className="sun"></div>

                <div className="fertilizer-can">
                    <div className="can-body"></div>
                    <div className="can-spout"></div>
                </div>

                <div className="fertilizer-flow"></div>

                <div className="tree">
                    <div className="trunk"></div>

                    <div className="canopy">
                        <span className="leaf"></span>
                        <span className="leaf"></span>
                        <span className="leaf"></span>
                        <span className="leaf"></span>
                        <span className="leaf"></span>
                        <span className="leaf"></span>
                        <span className="leaf"></span>

                        <span className="fruit"></span>
                        <span className="fruit"></span>
                        <span className="fruit"></span>
                        <span className="fruit"></span>
                        <span className="fruit"></span>
                    </div>
                </div>

                <div className="soil"></div>
            </div>
        </div>
    );
};

export default FarmLoading;
