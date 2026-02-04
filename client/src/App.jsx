import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import Routing from "./routes/Routing";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <AuthProvider>
        <Routing />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </div>
  );
}

export default App;
