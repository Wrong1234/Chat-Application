// import { Routes, Route } from "react-router-dom";
// import LoginForm from "./Auth/loginPage.jsx";
// import SignupForm from "./Auth/signupPage.jsx";
// import ChatApp from "./Components/ChatApp.jsx"
// import './app.css'

// function App() {

//   return (
//     <>
//       <div>
//          <Routes>
//             <Route path="/" element={<ChatApp />} />
//             <Route path="/signup" element={<SignupForm />} />
//             <Route path="/login" element={<LoginForm />} />
//          </Routes>
//       </div>
    
//     </>
//   );
// }

// export default App;

// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import LoginForm from "./Auth/loginPage.jsx";
import SignupForm from "./Auth/signupPage.jsx";
import ChatApp from "./Components/ChatApp.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import "./app.css";

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatApp />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Provider>
  );
}

export default App;