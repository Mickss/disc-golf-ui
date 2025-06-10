import React, { useEffect, useState, useContext } from 'react';
import config from '../config';
import { Box, MenuItem, FormControl, Select } from '@mui/material';
import { AuthContext } from './AuthContext';

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

    const { isAdmin } = useContext(AuthContext);
    
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

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        console.log(`Changing role for user ${userId} to: ${newRole}`);
        // Call API for a change role
        setUsers(prevUsers => 
            prevUsers.map(user => 
                user.userId === userId ? { ...user, role: newRole } : user
            )
        );
    };

    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
    <div>
        <Box sx={{ marginTop: 2, marginBottom: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2>Registered Users</h2>
        <table style={{ width: isAdmin() ? '45%' : '30%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: '3px' }}>Username</th>
                            <th style={{ border: '1px solid #ccc', padding: '3px' }}>Role</th>
                            {isAdmin() && (
                                <th style={{ border: '1px solid #ccc', padding: '3px' }}>Actions</th>
                            )}
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
                                {isAdmin() && (
                                    <td style={{ border: '1px solid #ccc', padding: '3px' }}>
                                        <FormControl size="small" sx={{ minWidth: 100 }}>
                                            <Select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.userId, e.target.value as UserRole)}
                                                sx={{ 
                                                    fontSize: '0.75rem',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: '1px solid #ccc'
                                                    }
                                                }}
                                            >
                                                <MenuItem value="ADMIN" sx={{ fontSize: '0.75rem' }}>ADMIN</MenuItem>
                                                <MenuItem value="PLAYER" sx={{ fontSize: '0.75rem' }}>PLAYER</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
            </table>
        </Box>
    </div>
);
};

export default UsersComponent;
