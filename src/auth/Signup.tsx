import { useState } from "react";

function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Handle signup logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-primary dark:text-white">Sign Up</h2>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-200" htmlFor="email">
            Email
          </label>
          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-primary dark:bg-gray-700 dark:text-white"
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-gray-700 dark:text-gray-200" htmlFor="password">
            Password
          </label>
          <input
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-primary dark:bg-gray-700 dark:text-white"
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition"
        >
          Sign Up
        </button>
        {submitted && (
          <p className="mt-4 text-green-600 dark:text-green-400">Signup submitted!</p>
        )}
      </form>
    </div>
  );
}

export default Signup;