import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Add from "./pages/Add";
import Edit from "./pages/Edit";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<SignUp />} />
      <Route path="/home" element={<Home />} />
      <Route path="/add" element={<Add />} />
      <Route path="/edit/:id" element={<Edit />} />
    </Routes>
  );
}
export default App;
