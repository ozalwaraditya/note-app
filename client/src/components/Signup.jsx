import { useState } from "react";
import { Link } from "react-router-dom";
import { url } from "../utils/url";
import { toast } from "react-hot-toast";
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/signup`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data;

      if (data.success === false) {
        toast.error(data.message);
        return;
      }

      toast.success("Signup successful!");
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed. Try again.";
      toast.error(message);
    }
  };



  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
    <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
      <h3 className="card-title text-center mb-4">Create Account</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">User Name</label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter your username"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
      </form>
      <div className="mt-3 text-center">
        Already have an account? <Link to="/signin">Sign in</Link>
      </div>
    </div>
</div>
  );
};

export default Signup;