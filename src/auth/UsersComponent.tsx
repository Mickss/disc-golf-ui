import React, { useEffect, useState } from 'react';
import config from '../config';
import { Box } from '@mui/material';

type UserRole = 'ADMIN' | 'PLAYER';

type User = {
    userId: string;
    username: string;
    role: UserRole;
};

const UsersComponent: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${config.authServiceUrl}/public/users/users`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch users');
                return res.json();
            })
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
    <div>
        <Box sx={{ marginTop: 2, marginBottom: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2>Registered Users</h2>
        <table style={{ width: '30%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
                <tr>
                    <th style={{ border: '1px solid #ccc', padding: '3px' }}>Username</th>
                    <th style={{ border: '1px solid #ccc', padding: '3px' }}>Role</th>
                </tr>
            </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.userId}>
                            <td style={{ border: '1px solid #ccc', padding: '3px' }}>{user.username}</td>
                            <td style={{ border: '1px solid #ccc', padding: '3px' }}>
                                <span style={{
                                    padding: '2px 4px',
                                    borderRadius: '2px',
                                    backgroundColor: user.role === 'ADMIN' ? '#f8d7da' : '#d1e7dd',
                                    color: user.role === 'ADMIN' ? '#842029' : '#0f5132',
                                    fontWeight: 'bold'
                                }}>
                                    {user.role}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Box>
    </div>
);
};

export default UsersComponent;
