import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import './Transactions.css';
import '../styles/common.css';
import BasicModal from './BasicModal';
import MoreModal from './MoreModal';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [banks, setBanks] = useState([]);
    const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
    const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        fetchTransactions();
        fetchUsers();
        fetchCategories();
        fetchBanks();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                goToPreviousTransaction();
            } else if (e.key === 'ArrowRight') {
                goToNextTransaction();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedTransaction]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedTransaction({
            ...selectedTransaction,
            [name]: value
        });
    };

    const updateTransaction = async () => {
        try {
            const response = await axios.put(`${config.transactionUrl}/${selectedTransaction.id}`, selectedTransaction);
            const updatedTransaction = response.data.transaction;

            setTransactions(transactions.map(t =>
                t.id === updatedTransaction.id ? updatedTransaction : t
            ));
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const openBasicModal = (transaction) => {
        setSelectedTransaction(transaction);
        setIsBasicModalOpen(true);
    };

    const closeBasicModal = () => {
        setIsBasicModalOpen(false);
        setSelectedTransaction(null);
    };

    const openMoreModal = () => {
        setIsBasicModalOpen(false); // Close basic modal
        setIsMoreModalOpen(true); // Open more modal
    };

    const closeMoreModal = () => {
        setIsMoreModalOpen(false);
        setSelectedTransaction(null);
    };

    const openBasicModalFromMore = () => {
        setIsMoreModalOpen(false);
        setIsBasicModalOpen(true);
    };

    const calculateAmount = (transaction) => {
        return transaction.debit - transaction.credit;
    };

    const goToPreviousTransaction = async () => {
        const currentIndex = transactions.findIndex(t => t.id === selectedTransaction.id);
        if (currentIndex > 0) {
            if (hasTransactionChanged()) {
                await updateTransaction();
            }
            closeMoreModal();
            openBasicModal(transactions[currentIndex - 1]);
        }
    };

    const goToNextTransaction = async () => {
        const currentIndex = transactions.findIndex(t => t.id === selectedTransaction.id);
        if (currentIndex < transactions.length - 1) {
            if (hasTransactionChanged()) {
                await updateTransaction();
            }
            closeMoreModal();
            openBasicModal(transactions[currentIndex + 1]);
        }
    };

    const hasTransactionChanged = () => {
        const originalTransaction = transactions.find(t => t.id === selectedTransaction.id);
        return JSON.stringify(originalTransaction) !== JSON.stringify(selectedTransaction);
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
                </tr>
                </thead>
                <tbody>
                {transactions.map(transaction => (
                    <tr key={transaction.id} onClick={() => openBasicModal(transaction)}>
                        <td>{transaction.date}</td>
                        <td>{transaction.description}</td>
                        <td>{calculateAmount(transaction)}</td>
                        <td>
                            <span>{categories.find(category => category.id === transaction.category_id)?.name || '-'}</span>
                        </td>
                        <td>
                                <span>
                                    {transaction.status
                                        ? transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)
                                        : 'Pending'}
                                </span>
                        </td>
                        <td>{users.find(user => user.id === transaction.user_id)?.name || 'Unknown User'}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <BasicModal
                isOpen={isBasicModalOpen}
                onRequestClose={closeBasicModal}
                transaction={selectedTransaction}
                categories={categories}
                handleInputChange={handleInputChange}
                openMoreModal={openMoreModal}
                calculateAmount={calculateAmount}
                goToPreviousTransaction={goToPreviousTransaction}
                goToNextTransaction={goToNextTransaction}
                isFirstTransaction={transactions[0]?.id === selectedTransaction?.id}
                isLastTransaction={transactions[transactions.length - 1]?.id === selectedTransaction?.id}
            />

            <MoreModal
                isOpen={isMoreModalOpen}
                onRequestClose={closeMoreModal}
                transaction={selectedTransaction}
                users={users}
                banks={banks}
                categories={categories}
                handleInputChange={handleInputChange}
                onHide={openBasicModalFromMore}
                goToPreviousTransaction={goToPreviousTransaction}
                goToNextTransaction={goToNextTransaction}
                isFirstTransaction={transactions[0]?.id === selectedTransaction?.id}
                isLastTransaction={transactions[transactions.length - 1]?.id === selectedTransaction?.id}
            />
        </div>
    );
};

export default Transactions;
