import React, { useEffect, useState, useContext } from "react";
import config from "../config";
import { Box, MenuItem, FormControl, Select } from "@mui/material";
import { AuthContext } from "./AuthContext";
import { useLoading } from "../spinner/LoadingProvider";
import { Snackbar, Alert } from "@mui/material";

type UserRole = "ADMIN" | "PLAYER";

type User = {
  userId: string;
  username: string;
  role: UserRole;
};

const UsersComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { isAdmin } = useContext(AuthContext);
  const { setLoading: setGlobalLoading } = useLoading();

  useEffect(() => {
    setGlobalLoading(true);
    fetch(`${config.authServiceUrl}/public/users/users`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setGlobalLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setGlobalLoading(false);
      });
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
    setError(null);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    console.log(`Changing role for user ${userId} to: ${newRole}`);
    try {
      setGlobalLoading(true);
      const endpoint = newRole === "ADMIN" ? "promote" : "downgrade";
      const response = await fetch(
        `${config.authServiceUrl}/users/${userId}/${endpoint}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to change role for user ${userId}`);
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId ? { ...user, role: newRole } : user
        )
      );

      setSnackbar({
        open: true,
        message: `Successfully changed role for user to ${newRole}`,
        severity: "success",
      });
    } catch (error) {
      console.error(`Error changing role for user ${userId}:`, error);
      setSnackbar({
        open: true,
        message: `Failed to change role for user ${userId}`,
        severity: "error",
      });
      setError(`Failed to change role for user ${userId}`);
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div>
      <Box
        sx={{
          marginTop: 2,
          marginBottom: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Registered Users</h2>
        <table
          style={{
            width: isAdmin() ? "45%" : "30%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "3px" }}>
                Username
              </th>
              <th style={{ border: "1px solid #ccc", padding: "3px" }}>Role</th>
              {isAdmin() && (
                <th style={{ border: "1px solid #ccc", padding: "3px" }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td style={{ border: "1px solid #ccc", padding: "3px" }}>
                  {user.username}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "3px" }}>
                  <span
                    style={{
                      padding: "2px 4px",
                      borderRadius: "2px",
                      backgroundColor:
                        user.role === "ADMIN" ? "#f8d7da" : "#d1e7dd",
                      color: user.role === "ADMIN" ? "#842029" : "#0f5132",
                      fontWeight: "bold",
                    }}
                  >
                    {user.role}
                  </span>
                </td>
                {isAdmin() && (
                  <td style={{ border: "1px solid #ccc", padding: "3px" }}>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <Select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user.userId,
                            e.target.value as UserRole
                          )
                        }
                      >
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                        <MenuItem value="PLAYER">PLAYER</MenuItem>
                      </Select>
                    </FormControl>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={
            snackbar.severity as "success" | "error" | "info" | "warning"
          }
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UsersComponent;
