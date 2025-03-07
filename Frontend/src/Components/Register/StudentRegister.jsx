import React, { useState } from "react";
import ParticleBackground from "../ParticleBackground";
import { NavLink, useNavigate } from "react-router-dom";
import { TiHome } from "react-icons/ti";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import TypingAnimation from "../TypingAnimation";
import FormField from "./RegisterFormField";

// Validation schema
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  studentId: yup.string().required("Student ID is required"), // Updated field
  department: yup.string().required("Department required"), // Updated field
  course: yup.string().required("course required"), // Updated field
});

const StudentRegister = ({ notify }) => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeInput, setActiveInput] = useState("");
  const [isNameFieldDisabled, setIsNameFieldDisabled] = useState(false); // New state for disabling/enabling name field

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setError,
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleAnimationComplete = () => setIsAnimationComplete(true);

  const handleContinue = async () => {
    const fieldNames = ["name", "email", "password", "studentId", "department", "course"]; // Updated field
    const currentField = fieldNames[currentStep];

    const isValid = await trigger(currentField);

    if (isValid) {
      if (currentStep === 1) {
        const emailValue = getValues("email");
        if (emailValue) {
          const isEmailValid = await checkFieldExistence("email", emailValue);
          if (!isEmailValid) return; // Exit early if email validation fails
        }
      }

      if (currentStep === 3) {
        const studentIdValue = getValues("studentId"); // Updated field
        if (studentIdValue) {
          const isStudentIdValid = await checkFieldExistence(
            "studentId", // Updated field
            studentIdValue
          );
          if (!isStudentIdValid) return; // Exit early if student ID validation fails
        }
      }

      // Proceed to the next step if validation passes and there are no errors
      setValue(currentField, getValues(currentField), {
        shouldValidate: true,
        shouldDirty: true,
        disabled: true,
      });

      setCurrentStep(currentStep + 1);
    }
  };

  const handleInputClick = (inputName) => setActiveInput(inputName);

  const checkFieldExistence = async (field, value) => {
    try {
      // Assuming the name is already available in the form data
      const name = getValues("name");

      const response = await axios.get(
        `http://localhost:5000/api/students/check-${field}/${value}`,
        {
          params: {
            name, // Include the name in the query parameters
          },
        }
      );

      if (response.data.exists) {
        if (response.data.proceed) {
          // Student ID and name match, proceed with login or registration
          notify(response.data.message, "success");
          return true;
        } else {
          // Student ID exists, but the name does not match
          notify(response.data.message, "error");
          setError("name", {
            type: "manual",
            message: response.data.message,
          });
          // Enable the name field and reset to the first step
          setIsNameFieldDisabled(false);
          setCurrentStep(0);
          return false;
        }
      }

      // Student ID does not exist
      return true;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          // Conflict: Student ID exists but name mismatch
          notify(error.response.data.message, "error");
          setError(field, {
            type: "manual",
            message: error.response.data.message,
          });
        } else if (error.response.status === 404) {
          // Student ID does not exist
          notify(error.response.data.message, "error");
          setError(field, {
            type: "manual",
            message: error.response.data.message,
          });
        } else {
          // Other server-side errors
          notify(
            `Server error: ${error.response.data.message || "Unknown error"}`,
            "error"
          );
          setError(field, {
            type: "manual",
            message: error.response.data.message || "Unknown server error.",
          });
        }
      } else {
        // Network or other errors
        notify("Network error. Please try again.", "error");
        setError(field, {
          type: "manual",
          message: "Network error. Please try again.",
        });
      }
      return false;
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/students/register",
        data
      );
      reset();
      notify("Registration Successful!", "success");
      navigate("/student/login");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        notify("Student already exists!", "error");
      } else {
        notify("There was an error registering the student!", "error");
      }
      console.error("Error:", error);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleContinue();
    }
  };

  return (
    <div className="sm:h-full max-h-full w-full font-[Mona] text-white relative">
      <ParticleBackground />
      <div className="mainForm relative z-10">
        <div className="nav w-full sm:px-14 px-6 py-6 flex justify-between sm:items-center items-start flex-col sm:flex-row sm:gap-0 gap-2">
          <NavLink to="/" className="icon text-3xl 2xl:text-4xl">
            <TiHome />
          </NavLink>
          <div className="txt-warp flex justify-center items-center gap-4">
            <h1 className="sm:text-[1rem] 2xl:text-2xl text-2xl font-medium opacity-[.5]">
              Already have an account?
            </h1>
            <NavLink
              to="/student/login"
              className="txt sm:text-lg 2xl:text-2xl text-lg sm:leading-normal leading-none tracking-tight font-[900] flex justify-center items-center"
            >
              Sign in <IoIosArrowRoundForward />
            </NavLink>
          </div>
        </div>
        <div className="main-content min-h-[88vh] sm:min-h-[85.8vh] xl:min-h-[87.7vh] w-full flex justify-center items-center md:px-0 py-8 px-2">
          <div className="form-Wrap h-fit w-[40rem] font-mono p-4 rounded-md backdrop-blur-2xl border-[2px] border-zinc-500">
            <TypingAnimation handleAnimation={handleAnimationComplete} />
            {isAnimationComplete && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                method="post"
                onKeyDown={handleKeyPress}
              >
                {currentStep >= 0 && (
                  <FormField
                    label="Enter your name*"
                    name="name"
                    control={control}
                    errors={errors}
                    onClick={() => handleInputClick("name")}
                    showButton={currentStep === 0 || activeInput === "name"}
                    handleContinue={handleContinue}
                    disabled={isNameFieldDisabled}
                  />
                )}
                {currentStep >= 1 && (
                  <FormField
                    label="Enter your email*"
                    name="email"
                    type="email"
                    control={control}
                    errors={errors}
                    onClick={() => handleInputClick("email")}
                    showButton={currentStep === 1 || activeInput === "email"}
                    handleContinue={handleContinue}
                    disabled={currentStep > 1}
                  />
                )}
                {currentStep >= 2 && (
                  <FormField
                    label="Enter your password*"
                    name="password"
                    type="password"
                    control={control}
                    errors={errors}
                    onClick={() => handleInputClick("password")}
                    showButton={currentStep === 2 || activeInput === "password"}
                    handleContinue={handleContinue}
                    disabled={currentStep > 2}
                  />
                )}
                {currentStep >= 3 && (
                  <FormField
                    label="Enter your student ID*"
                    name="studentId" // Updated field
                    control={control}
                    errors={errors}
                    onClick={() => handleInputClick("studentId")} // Updated field
                    showButton={
                      currentStep === 3 || activeInput === "studentId" // Updated field
                    }
                    handleContinue={handleContinue}
                  />
                )}
                {currentStep >= 4 && (
                  <FormField
                    label="Enter your Department*"
                    name="department" // Updated field
                    control={control}
                    errors={errors}
                    onClick={() => handleInputClick("department")} // Updated field
                    showButton={
                      currentStep === 3 || activeInput === "department" // Updated field
                    }
                    handleContinue={handleContinue}
                  />
                )}
                {currentStep >= 5 && (
                  <FormField
                    label="Enter your Course*"
                    name="course" // Updated field
                    control={control}
                    errors={errors}
                    onClick={() => handleInputClick("course")} // Updated field
                    showButton={
                      currentStep === 3 || activeInput === "course" // Updated field
                    }
                    handleContinue={handleContinue}
                  />
                )}
                {currentStep >= 5 && (
                  <div className="btn-wrap h-fit w-full flex justify-center items-center mt-5">
                    <button
                      type="submit"
                      className="py-1 px-2 text-base font-light border-[1px] border-zinc-600 rounded-md mx-auto hover:bg-teal-800"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
