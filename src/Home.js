import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [username, setUsername] = useState('');
    const [personalData, setPersonalData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
            fetchPersonalData(storedUsername);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchPersonalData = async (username) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/get_personal_data?username=${username}`);
            const data = await response.json();
            if (response.ok) {
                setPersonalData(data);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error fetching personal data:', error);
        }
    };

    const handleUpdateClick = () => {
        navigate('/save-personal-data');
    };

    const handleChatClick = () => {
        navigate('/chat');
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Welcome, {username}!</h1>
            <h2 className="text-center mb-4">Your Personal Data</h2>
            <table className="table table-bordered text-center mx-auto">
                <tbody>
                    <tr>
                        <th>Height</th>
                        <td>{personalData.height} cm</td>
                    </tr>
                    <tr>
                        <th>Weight</th>
                        <td>{personalData.weight} kg</td>
                    </tr>
                    <tr>
                        <th>Age</th>
                        <td>{personalData.age} years</td>
                    </tr>
                    <tr>
                        <th>Activity Level</th>
                        <td>{personalData.activity_level}</td>
                    </tr>
                </tbody>
            </table>
            <div className="text-center">
                <button className="btn btn-primary" onClick={handleUpdateClick}>Update Data</button>
                <button className="btn btn-primary" onClick={handleChatClick}>Chat</button>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Home;
