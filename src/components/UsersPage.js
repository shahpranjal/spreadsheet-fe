import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import './UsersPage.css';  // Importing the CSS file

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newUserName, setNewUserName] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [updatedUserName, setUpdatedUserName] = useState("");

    const baseUrl = config.baseUrl + '/api/users';

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        axios.get(`${baseUrl}/`)
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

    const handleCreateUser = () => {
        axios.post(`${baseUrl}/create_user`, { name: newUserName })
            .then(response => {
                setUsers([...users, response.data]);
                setNewUserName("");
            })
            .catch(error => {
                console.error("There was an error creating the user!", error);
                setError(error);
            });
    };

    const handleDeleteUser = (userId) => {
        axios.delete(`${baseUrl}/${userId}`)
            .then(() => {
                setUsers(users.filter(user => user.id !== userId));
            })
            .catch(error => {
                console.error("There was an error deleting the user!", error);
                setError(error);
            });
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setUpdatedUserName(user.name);
    };

    const handleUpdateUser = () => {
        axios.put(`${baseUrl}/${editingUser.id}`, { name: updatedUserName })
            .then(response => {
                setUsers(users.map(user => user.id === editingUser.id ? response.data : user));
                setEditingUser(null);
                setUpdatedUserName("");
            })
            .catch(error => {
                console.error("There was an error updating the user!", error);
                setError(error);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="users-container">
            <h2>Users Page</h2>
            <ul className="users-list">
                {users.map(user => (
                    <li key={user.id}>
                        {user.name}
                        <button className="button" onClick={() => handleEditUser(user)}>Edit</button>
                        <button className="button" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <div className="create-user">
                <h3>Create New User</h3>
                <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter user name"
                    className="input-field"
                />
                <button className="button" onClick={handleCreateUser}>Create User</button>
            </div>
            {editingUser && (
                <div className="edit-user">
                    <h3>Edit User</h3>
                    <input
                        type="text"
                        value={updatedUserName}
                        onChange={(e) => setUpdatedUserName(e.target.value)}
                        placeholder="Enter new user name"
                        className="input-field"
                    />
                    <button className="button" onClick={handleUpdateUser}>Update User</button>
                    <button className="button" onClick={() => setEditingUser(null)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
