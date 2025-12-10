import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./component/Signup.jsx";
import Login from "./component/Login.jsx";
import Game from "./component/Game.jsx";
import PrivateRoute from "./component/PrivateRoute.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/game" 
            element={
              <PrivateRoute>
                <Game />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;