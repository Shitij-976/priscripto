import React, { useState } from "react";

const Login = () => {
  // State variables for form fields
  const [state, setState] = useState("Sign Up"); // Toggle between Sign Up and Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Form submission handler (currently empty)
  const onsubmitHandler = async (event) => {
    event.preventDefault();
  };

  return (
    <form className="min-h-[80vh] flex items-center mt-6" onSubmit={onsubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        {/* Form title */}
        <p className="text-3xl font-semibold">{state === "Sign Up" ? "Create Account" : "Login"}</p>
        <p>Please {state === "Sign Up" ? "sign up" : "log in"} to book an appointment</p>

        {/* Full Name field (only in Sign Up state) */}
        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)} // Fix: Change e.target.name → e.target.value
              value={name}
              required
            />
          </div>
        )}

        {/* Email field */}
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)} // Fix: Change e.target.name → e.target.value
            value={email} // Fix: Should bind with email, not name
            required
          />
        </div>

        {/* Password field */}
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)} // Fix: Change e.target.name → e.target.value
            value={password} // Fix: Should bind with password, not name
            required
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="bg-primary text-white w-full py-2 rounded-md text-base">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {/* Toggle between Sign Up and Login */}
        {state === "Sign Up" ? 
          <p>
            Already have an account?{" "}
            <span onClick={() => setState("Login")} className="text-primary underline cursor-pointer">
              Login here
            </span>
          </p>
         : 
          <p>
            Create a new Account?{" "}
            <span onClick={() => setState("Sign Up")} className="text-primary underline cursor-pointer">
              Click here
            </span>
          </p>
        }
      </div>
    </form>
  );
};

export default Login;
