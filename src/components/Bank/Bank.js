import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './Bank.css';
import config from '../../config';
import '../styles/common.css';

const Bank = () => {
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBank, setEditingBank] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBank, setNewBank] = useState({
        name: '',
        date_column: '',
        debit_column: '',
        credit_column: '',
        description_column: ''
    });

    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = () => {
        axios.get(`${config.banksUrl}`)
            .then(response => {
                setBanks(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the banks!", error);
                setError(error);
                setLoading(false);
            });
    };

    const handleBankClick = (bank) => {
        setEditingBank(bank);
        setNewBank({
            name: bank.name,
            date_column: bank.date_column,
            debit_column: bank.debit_column,
            credit_column: bank.credit_column,
            description_column: bank.description_column
        });
        setIsModalOpen(true);
    };

    const handleCreateBankClick = () => {
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewBank(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCreateOrUpdateBank = () => {
        let url = ""
        if (editingBank) {
            url = `${config.banksUrl}/${editingBank.id}`
        } else {
            url = `${config.banksUrl}/create_bank`
        }
        axios.post(url, newBank)
            .then(response => {
                if (editingBank) {
                    setBanks(banks.map(bank => bank.id === editingBank.id ? response.data : bank));
                } else {
                    setBanks([...banks, response.data]);
                }
                setEditingBank(null);
                setNewBank({
                    name: '',
                    date_column: '',
                    debit_column: '',
                    credit_column: '',
                    description_column: ''
                });
                setIsModalOpen(false);
            })
            .catch(error => {
                console.error("There was an error creating the bank!", error);
                setError(error);
            });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBank(null);
        setNewBank({
            name: '',
            date_column: '',
            debit_column: '',
            credit_column: '',
            description_column: ''
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="banks-container">
            <h2>Banks</h2>
            <button className="button create-button" onClick={handleCreateBankClick}>Create</button>
            <ul className="banks-list">
                {banks.map(bank => (
                    <li key={bank.id} className="bank-item" onClick={() => handleBankClick(bank)}>
                        {bank.name}
                    </li>
                ))}
            </ul>

            {/* Create Bank Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel={editingBank ? "Edit Bank" : "Create Bank"}
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>{editingBank ? "Edit Bank" : "Create Bank"}</h2>
                <div className="form-group">
                    <label htmlFor="name">Bank Name</label>
                    <input
                        type="text"
                        name="name"
                        value={newBank.name}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Bank Name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description_column">Description Column</label>
                    <input
                        type="text"
                        name="description_column"
                        value={newBank.description_column}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Description Column"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="date_column">Date Column</label>
                    <input
                        type="text"
                        name="date_column"
                        value={newBank.date_column}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Date Column"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="debit_column">Debit Column</label>
                    <input
                        type="text"
                        name="debit_column"
                        value={newBank.debit_column}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Debit Column"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="credit_column">Credit Column</label>
                    <input
                        type="text"
                        name="credit_column"
                        value={newBank.credit_column}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Credit Column"
                    />
                </div>
                    <div className="modal-buttons">
                        <button className="button" onClick={handleCreateOrUpdateBank}>Save</button>
                        <button className="button" onClick={closeModal}>Cancel</button>
                    </div>
            </Modal>
        </div>
);
};

export default Bank;
