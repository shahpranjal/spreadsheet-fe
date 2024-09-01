import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UploadCsv.css';
import '../styles/common.css';
import config from "../../config";

const UploadCsv = () => {
    const [file, setFile] = useState(null);
    const [users, setUsers] = useState([]);
    const [banks, setBanks] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchBanks();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${config.usersUrl}`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchBanks = async () => {
        try {
            const response = await axios.get(`${config.banksUrl}`);
            setBanks(response.data);
        } catch (error) {
            console.error('Error fetching banks:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', selectedUser);
        formData.append('bank_id', selectedBank);

        try {
            await axios.post(`${config.uploadUrl}/upload_file`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Failed to upload file. ' + error.response.data.error);
        }
    };

    return (
        <div className="upload-csv-container">
            <h2>Upload CSV</h2>
            <input type="file" onChange={handleFileChange}/>
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                <option value="">Select User</option>
                {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                ))}
            </select>
            <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
                <option value="">Select Bank</option>
                {banks.map(bank => (
                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                ))}
            </select>
            <button onClick={handleUpload}>Upload</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadCsv;
