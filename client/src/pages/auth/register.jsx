import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { loginWithGoogle, registerUser } from "@/store/auth-slice";
import { GoogleLogin } from "@react-oauth/google";
import { HousePlug } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AuthRegister() {
  const displayMsg = (message) => toast.success(message);
  const displayErrorMsg = (message) => toast.error(message);

  const initialState = {
    userName: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    if (!formData.userName) {
      displayErrorMsg("Username is required");
      isValid = false;
    }
    if (!formData.email) {
      displayErrorMsg("Email is required");
      isValid = false;
    }
    if (!formData.password) {
      displayErrorMsg("Password is required");
      isValid = false;
    }
    return isValid;
  };

  const responseGoogle = (response) => {
    if (response.credential) {
      const googleToken = response.credential;

      dispatch(loginWithGoogle(googleToken))
        .then((data) => {
          if (data?.payload?.success) {
            displayMsg(data.payload.message || "Login successful");
            navigate(location.state?.from || "/shop/home");
          } else {
            displayErrorMsg(
              data?.payload?.message ||
                "Google login failed. Try email and password."
            );
          }
        })
        .catch((error) => {
          displayErrorMsg(error.message || "An error occurred during login.");
        });
    } else {
      displayErrorMsg("Failed to retrieve Google credentials.");
    }
  };

  function onSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    dispatch(registerUser(formData))
      .then((data) => {
        if (data?.payload?.success) {
          displayMsg(data.payload.message || "Account created successfully");
          navigate("/auth/login");
        } else {
          displayErrorMsg(
            data?.payload?.message || "Registration failed. Please try again."
          );
        }
      })
      .catch((error) => {
        displayErrorMsg(error.message || "An unexpected error occurred.");
      });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <Link to="/home">
        <div className="text-2xl font-sans text-blue-600 hover:text-blue-800 ease-in-out font-bold flex items-center justify-center transition-colors duration-300">
          Tianna Store
          <HousePlug />
        </div>
      </Link>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <GoogleLogin
        theme="filled_blue"
        size="large"
        width={"600px"}
        text="signup_with"
        style={{ width: "100%" }}
        onSuccess={responseGoogle}
      />
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthRegister;
