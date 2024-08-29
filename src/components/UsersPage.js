import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import config from '../config';
import './UsersPage.css';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatedUserName, setUpdatedUserName] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newUserName, setNewUserName] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        axios.get(`${config.baseUrl}/api/users`)
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the users!", error);
                setError(error);
                setLoading(false);
            });
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setUpdatedUserName(user.name);
        setIsEditModalOpen(true);
    };

    const handleCreateUserClick = () => {
        setIsCreateModalOpen(true);
    };

    const handleCreateUser = () => {
        axios.post(`${config.baseUrl}/api/users/create_user`, { name: newUserName })
            .then(response => {
                setUsers([...users, response.data]);
                setNewUserName("");
                setIsCreateModalOpen(false);
            })
            .catch(error => {
                console.error("There was an error creating the user!", error);
                setError(error);
            });
    };

    const handleUpdateUser = () => {
        axios.put(`${config.baseUrl}/api/users/${selectedUser.id}`, { name: updatedUserName })
            .then(response => {
                setUsers(users.map(user => user.id === selectedUser.id ? response.data : user));
                setIsEditModalOpen(false);
            })
            .catch(error => {
                console.error("There was an error updating the user!", error);
                setError(error);
            });
    };

    const handleDeleteUser = () => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            axios.delete(`${config.baseUrl}/api/users/${selectedUser.id}`)
                .then(() => {
                    setUsers(users.filter(user => user.id !== selectedUser.id));
                    setIsEditModalOpen(false);
                })
                .catch(error => {
                    console.error("There was an error deleting the user!", error);
                    setError(error);
                });
        }
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setNewUserName("");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="users-container">
            <h2>Users</h2>
            <ul className="users-list">
                {users.map(user => (
                    <li key={user.id} onClick={() => handleUserClick(user)} className="user-name">
                        {user.name}
                    </li>
                ))}
            </ul>
            <button className="button create-button" onClick={handleCreateUserClick}>Create</button>

            {/* Edit/Delete Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={closeEditModal}
                contentLabel="Edit User"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Edit User</h2>
                <input
                    type="text"
                    value={updatedUserName}
                    onChange={(e) => setUpdatedUserName(e.target.value)}
                    className="input-field"
                />
                <div className="modal-buttons">
                    <button className="button" onClick={handleUpdateUser}>Update</button>
                    <button className="button delete-button" onClick={handleDeleteUser}>Delete</button>
                    <button className="button" onClick={closeEditModal}>Cancel</button>
                </div>
            </Modal>

            {/* Create User Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onRequestClose={closeCreateModal}
                contentLabel="Create User"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <h2>Create User</h2>
                <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="input-field"
                    placeholder="Enter user name"
                />
                <div className="modal-buttons">
                    <button className="button" onClick={handleCreateUser}>Save</button>
                    <button className="button" onClick={closeCreateModal}>Cancel</button>
                </div>
            </Modal>
        </div>
    );
};

export default UsersPage;
