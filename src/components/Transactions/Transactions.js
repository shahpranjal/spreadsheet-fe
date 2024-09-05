import React, {useState, useEffect} from 'react';
import axios from 'axios';
import config from '../../config';
import './Transactions.css';
import '../styles/common.css';
import Modal from 'react-modal';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [banks, setBanks] = useState([]); // Assuming you have banks data
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        fetchTransactions();
        fetchUsers();
        fetchCategories();
        fetchBanks(); // Fetch banks data
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`${config.transactionUrl}`);
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${config.usersUrl}`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${config.categoriesUrl}`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
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

    const handleCategoryChange = (transactionId, newCategoryId) => {
        setTransactions(transactions.map(transaction =>
            transaction.id === transactionId
                ? {...transaction, category_id: newCategoryId === "" ? null : newCategoryId}
                : transaction
        ));
    };

    const handleStatusChange = (transactionId, newStatus) => {
        setTransactions(transactions.map(transaction =>
            transaction.id === transactionId
                ? {...transaction, status: newStatus}
                : transaction
        ));
    };

    const saveTransaction = async (transactionId) => {
        try {
            const transactionToSave = transactions.find(t => t.id === transactionId);
            const response = await axios.put(`${config.baseUrl}/api/transactions/${transactionId}`, transactionToSave);
            const updatedTransaction = response.data.transaction;

            setTransactions(transactions.map(t =>
                t.id === transactionId ? updatedTransaction : t
            ));
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const openModal = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSelectedTransaction({
            ...selectedTransaction,
            [name]: value
        });
    };

    const updateTransaction = async () => {
        try {
            const response = await axios.put(`${config.baseUrl}/api/transactions/${selectedTransaction.id}`, selectedTransaction);
            const updatedTransaction = response.data.transaction;

            setTransactions(transactions.map(t =>
                t.id === updatedTransaction.id ? updatedTransaction : t
            ));
            closeModal();
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="transactions-page">
            <h2>Transactions</h2>

            <table className="transactions-table">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>User</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map(transaction => (
                    <tr key={transaction.id}>
                        <td>{transaction.date}</td>
                        <td>{transaction.description}</td>
                        <td>{transaction.debit - transaction.credit}</td>
                        <td>
                            <select
                                value={transaction.category_id || ''}
                                onChange={(e) => handleCategoryChange(transaction.id, e.target.value)}
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <select
                                value={transaction.status || 'pending'}
                                onChange={(e) => handleStatusChange(transaction.id, e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="processed">Processed</option>
                                <option value="skip">Skip</option>
                            </select>
                        </td>
                        <td>
                            {users.find(user => user.id === transaction.user_id)?.name || 'Unknown User'}
                        </td>
                        <td>
                            <button className="button" onClick={() => saveTransaction(transaction.id)}>Save</button>
                            <button className="button" onClick={() => openModal(transaction)}>Edit</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="modal"
                overlayClassName="modal-overlay"
            >
                {selectedTransaction && (
                    <div>
                        <h2>Edit Transaction</h2>
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            name="date" value={selectedTransaction.date}
                            onChange={handleInputChange}
                            className="input-field"
                            placeholder="Date"
                        />

                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={selectedTransaction.description}
                            onChange={handleInputChange}
                            className="input-field"
                            placeholder="Description"
                        />

                        <label htmlFor="debit">Debit:</label>
                        <input
                            type="text"
                            name="debit"
                            value={selectedTransaction.debit}
                            onChange={handleInputChange}
                            className="input-field"
                            placeholder="Debit"
                        />

                        <label htmlFor="credit">Credit:</label>
                        <input
                            type="text"
                            name="credit"
                            value={selectedTransaction.credit}
                            onChange={handleInputChange}
                            className="input-field"
                            placeholder="Credit"
                        />

                        <label htmlFor="user_id">User:</label>
                        <select
                            name="user_id"
                            value={selectedTransaction.user_id}
                            onChange={handleInputChange}
                            className="select-field"
                        >
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="bank_id">Bank:</label>
                        <select
                            name="bank_id"
                            value={selectedTransaction.bank_id}
                            onChange={handleInputChange}
                            className="select-field"
                        >
                            {banks.map(bank => (
                                <option key={bank.id} value={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="category_id">Category:</label>
                        <select
                            name="category_id"
                            value={selectedTransaction.category_id}
                            onChange={handleInputChange}
                            className="select-field"
                        >
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="status">Status:</label>
                        <select
                            name="status"
                            value={selectedTransaction.status}
                            onChange={handleInputChange}
                            className="select-field"
                        >
                            <option value="pending">Pending</option>
                            <option value="processed">Processed</option>
                            <option value="skip">Skip</option>
                        </select>

                        <div className="modal-buttons">
                            <button className="button" onClick={closeModal}>Cancel</button>
                            <button className="button" onClick={updateTransaction}>Save</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Transactions;
