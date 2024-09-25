"use client";

import React, { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import { TextField, Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface SignupFormData {
  name: string;
  email: string;
}

const SignupPage = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://expert-umbrella-q7449r9474929w64-5000.app.github.dev/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      console.log(data);

      const token = data.token;
      localStorage.setItem("authToken", token);

      console.log("Signup successful:", data);
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Error during signup:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign Up">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button
          fullWidth
          variant="contained"
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
