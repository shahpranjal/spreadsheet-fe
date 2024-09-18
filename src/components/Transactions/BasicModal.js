import React from 'react';
import Modal from 'react-modal';

const BasicModal = ({
                        isOpen,
                        onRequestClose,
                        transaction,
                        categories,
                        handleInputChange,
                        openMoreModal,
                        calculateAmount,
                        goToPreviousTransaction,
                        goToNextTransaction,
                        isFirstTransaction,
                        isLastTransaction
                    }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal"
            overlayClassName="modal-overlay"
        >
            {transaction && (
                <div>
                    <h2>{transaction.description}</h2>

                    <div className="form-group">
                        <label htmlFor="date">Date:</label>
                        <input
                            type="text"
                            name="date"
                            value={transaction.date}
                            className="input-field read-only"
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Amount:</label>
                        <input
                            type="text"
                            name="amount"
                            value={calculateAmount(transaction)}
                            className="input-field read-only"
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category_id">Category:</label>
                        <select
                            name="category_id"
                            value={transaction.category_id || ''}
                            onChange={handleInputChange}
                            className="select-field"
                        >
                            <option value="" disabled>Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="modal-buttons">
                        <button className="button" onClick={goToPreviousTransaction}
                                disabled={isFirstTransaction}>Previous
                        </button>
                        <button className="button" onClick={openMoreModal}>More</button>
                        <button className="button" onClick={goToNextTransaction}>{isLastTransaction ? "Save" : "Next"}
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default BasicModal;
