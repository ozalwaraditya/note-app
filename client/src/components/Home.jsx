import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <Link to="/signup" className="btn btn-primary">
        Go to Sign Up
      </Link>
    </div>
  );
};

export default Home;
