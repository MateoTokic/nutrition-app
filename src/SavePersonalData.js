import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SavePersonalData() {
  const [username, setUsername] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [activityLevel, setActivityLevel] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/save_personal_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          height: parseFloat(height),
          weight: parseFloat(weight),
          age: parseInt(age, 10),
          activity_level: parseInt(activityLevel, 10),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Personal data saved successfully!');
        navigate('/home');
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert('Error saving data. Please try again later.');
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };


  return (
    <div className="container mt-5">
      <h1 className="mb-4">Save Personal Data</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Height (cm):</label>
          <input
            type="number"
            className="form-control"
            step="0.01"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Weight (kg):</label>
          <input
            type="number"
            className="form-control"
            step="0.01"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Age:</label>
          <input
            type="number"
            className="form-control"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Activity Level (1-5):</label>
          <select
            className="form-select"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            required
          >
            <option value={1}>1 - Sedentary</option>
            <option value={2}>2 - Lightly active</option>
            <option value={3}>3 - Moderately active</option>
            <option value={4}>4 - Very active</option>
            <option value={5}>5 - Extra active</option>
          </select>
        </div>
        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={handleBack}>Back</button>
          <button type="submit" className="btn btn-primary">Save Data</button>
        </div>
      </form>
    </div>
  );
}

export default SavePersonalData;
