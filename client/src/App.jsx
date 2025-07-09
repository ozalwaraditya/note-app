import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Home from "./components/Home";
import Signup from "./components/SignUp";
import Signin from "./components/Signin";

const App = () => (
  <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
    </Routes>
  </Router>
);

export default App;
