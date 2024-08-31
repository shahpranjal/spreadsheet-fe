import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dropdown.css';

const Dropdown = () => {
    const navigate = useNavigate();

    const handleNavigation = (event) => {
        const selectedPage = event.target.value;
        if (selectedPage) {
            navigate(selectedPage);
        }
    };

    return (
        <div className="dropdown-nav">
            <select onChange={handleNavigation} defaultValue="">
                <option value="" disabled>Select a page</option>
                <option value="/">Home</option>
                <option value="/users">Users</option>
                <option value="/banks">Banks</option>
                <option value="/upload-csv">Upload CSV</option>
                <option value="/categories">Categories</option>
                <option value="/transactions">Transactions</option>
            </select>
        </div>
    );
};

export default Dropdown;
