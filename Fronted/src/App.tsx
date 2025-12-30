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
// import { Routes, Route, Navigate } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "./store";
// import LoginForm from "./Auth/loginPage.jsx";
// import SignupForm from "./Auth/signupPage.jsx";
// import ChatApp from "./Components/ChatApp.jsx";
// import ProtectedRoute from "./Components/ProtectedRoute.jsx";
// import "./app.css";

// function App() {
//   return (
//     <Provider store={store}>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <ChatApp />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/signup" element={<SignupForm />} />
//         <Route path="/login" element={<LoginForm />} />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Provider>
//   );
// }

// export default App;


import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ChatProvider } from "./context/ChatContext"
import LoginPage from "./Pages/LoginPage"
import SignupPage from "./Pages/SignupPage"
import ChatApp from "./Components/ChatApp"
import ProtectedRoute from "./Components/ProtectedRoute"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ChatApp />
                </ProtectedRoute>
              }
            />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ChatProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
