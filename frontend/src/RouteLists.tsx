import { Route, Routes } from 'react-router';
import LogIn from './components/Login';
import SignUp from './components/signup';
import Home from './components/Home';

const RouteLists = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default RouteLists;
