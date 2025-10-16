import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [donors, setDonors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    blood_group: '',
    age: '',
    address: ''
  });
  const [searchBloodGroup, setSearchBloodGroup] = useState('');
  const [showForm, setShowForm] = useState(false);

   const API_URL = 'https://blooddonationapplication-c4cpcxdachhzeebw.centralindia-01.azurewebsites.net/api';

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await axios.get(`${API_URL}/donors`);
      setDonors(response.data);
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/donors`, formData);
      alert('Donor registered successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        blood_group: '',
        age: '',
        address: ''
      });
      setShowForm(false);
      fetchDonors();
    } catch (error) {
      alert('Error registering donor: ' + error.message);
    }
  };

  const handleSearch = async () => {
    if (!searchBloodGroup) {
      fetchDonors();
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/donors/search/${searchBloodGroup}`);
      setDonors(response.data);
    } catch (error) {
      console.error('Error searching donors:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      try {
        await axios.delete(`${API_URL}/donors/${id}`);
        alert('Donor deleted successfully!');
        fetchDonors();
      } catch (error) {
        alert('Error deleting donor: ' + error.message);
      }
    }
  };

  return (
    <div className="App">
      <header>
        <h1>🩸 Blood Donation Management System</h1>
      </header>

      <div className="container">
        <div className="actions">
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Register as Donor'}
          </button>
          
          <div className="search-box">
            <select 
              value={searchBloodGroup} 
              onChange={(e) => setSearchBloodGroup(e.target.value)}
            >
              <option value="">All Blood Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>

        {showForm && (
          <div className="form-container">
            <h2>Donor Registration Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Blood Group *</label>
                <select
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="18"
                  max="65"
                  required
                />
              </div>

              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-submit">Register Donor</button>
            </form>
          </div>
        )}

        <div className="donors-list">
          <h2>Registered Donors ({donors.length})</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Blood Group</th>
                  <th>Age</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donors.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{textAlign: 'center'}}>No donors registered yet</td>
                  </tr>
                ) : (
                  donors.map((donor) => (
                    <tr key={donor.id}>
                      <td>{donor.name}</td>
                      <td><span className="blood-badge">{donor.blood_group}</span></td>
                      <td>{donor.age}</td>
                      <td>{donor.phone}</td>
                      <td>{donor.email}</td>
                      <td>{donor.address}</td>
                      <td>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(donor.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
