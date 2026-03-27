import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<div>Register Page</div>} />
          <Route path='/' element={<div>Dashboard</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;