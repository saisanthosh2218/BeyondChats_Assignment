import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import plant from "../assets/plant.jpg";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    // Load Google script dynamically
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { theme: "outline", size: "large" } // Google's default styles
        );
      };
    };

    console.log("Redirect URI:", window.location.origin);
    console.log("Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);

    loadGoogleScript();
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await axios.post(
        "https://beyondchats-assignment-759z.onrender.com/api/auth/google",
        {
          token: response.credential,
        }
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed.");
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(
        "https://beyondchats-assignment-759z.onrender.com/api/auth/register",
        form
      );
      toast.success(res.data.message);
      setShowVerification(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  const handleVerify = async () => {
    try {
      const res = await axios.post(
        "https://beyondchats-assignment-759z.onrender.com/api/auth/verify-email",
        {
          email: form.email,
          code: verificationCode,
        }
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed.");
    }
  };

  return (
    <>
      <div>
        {!showVerification ? (
          <div className="mt-20 h-full w-full bg-white bg-clip-padding backdrop-filter backdrop-blur-4xl bg-opacity-5 border border-gray-300 p-4">
            <div className="flex justify-center items-center w-full  ">
              <div className="hidden md:block md:w-full">
                <img
                  src={plant}
                  className="mx-auto w-full"
                  width={900}
                  height={900}
                  alt=""
                />
              </div>
              <div className="bg-white w-52 p-5 md:w-full">
                <div className="md:-ml-5 -ml-10 md:p-10">
                  <h1 className="text-center text-2xl">
                    Yooohoo!! Welcome Back
                  </h1>
                  <div className=" md:mx-auto md:p-6 w-64 flex flex-col md:w-md rounded-md md:flex md:flex-col md:justify-center   ">
                    <label htmlFor="name">Name</label>
                    <input
                      className="p-1 border-b outline-none"
                      id="name"
                      type="text"
                      placeholder="Name"
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                    <label htmlFor="email">Email</label>
                    <input
                      className="p-1 border-b outline-none"
                      id="email"
                      type="email"
                      placeholder="Email"
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                    <label htmlFor="password">Password</label>
                    <input
                      className="p-1 border-b"
                      id="password"
                      type="password"
                      placeholder="Password"
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                    <button
                      className="bg-blue-500 text-white p-2 rounded-sm mt-2 hover:cursor-pointer"
                      onClick={handleRegister}
                    >
                      Register
                    </button>
                    <p className="text-center">Or</p>
                    {/* Google's Default Sign-in Button */}
                    <div
                      id="google-signin-btn"
                      style={{ marginTop: "10px" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Enter verification code"
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button onClick={handleVerify}>Verify</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Register;
