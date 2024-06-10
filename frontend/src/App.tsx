import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import { SigninPage } from "./pages/SigninPage";
import { DashboardPage } from "./pages/DashboardPage";
import { SendMoneyPage } from "./pages/SendMoneyPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/send" element={<SendMoneyPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
