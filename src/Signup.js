import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Import custom styles

function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [matchError, setMatchError] = useState('');
    const navigate = useNavigate();

    // Password validation function
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password strength
        if (!validatePassword(password)) {
            setPasswordError('Password must be at least 8 characters long, contain one number and one capital letter.');
            return;
        } else {
            setPasswordError('');
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setMatchError('Passwords do not match.');
            return;
        } else {
            setMatchError('');
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.status === 201) {
                alert('User created successfully!');
                navigate('/login');
            } else {
                alert(data.message || 'Signup failed!');
            }
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4">
                <h1 className="text-center mb-4">Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username:</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {passwordError && <small className="text-danger">{passwordError}</small>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Confirm Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Repeat your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {matchError && <small className="text-danger">{matchError}</small>}
                    </div>
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </form>
                <button className="btn btn-link" onClick={() => navigate('/login')}>Already have an account? Login</button>
            </div>
        </div>
    );
}

export default Signup;
