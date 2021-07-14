import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
    return (
        <div>
            <h2>Homepage</h2>
            <br />
            <Link to="/editor">Go to card editor</Link>
            <br />
            <Link to="/viewer">Go to card viewer</Link>
        </div>
    );
}

export default Homepage;