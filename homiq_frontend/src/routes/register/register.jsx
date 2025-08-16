import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import apiRequest from "../../lib/apiRequests";

function Register() {

    const [error, setError] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    // to use useNavigate() hook, diff between Link and this hook is that, user has to manually click on that stuff in the Link, but in useNavigate we can write our logic and it will redirect automatically
    const navigate  = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

        // FormData ek inbuilt js function hai jo hamare input values ko ek object me convert kr deta hai
        // and us se fir .get() krke use kr skte hai with the field name values
        // e.target me sab data hoga fields me store hoga jo user dega
        const formData  = new FormData(e.target);

        const username = formData.get("username")
        const email = formData.get("email")
        const password = formData.get("password")

        // console.log(username, email, password);
        try {
            const res  = await apiRequest.post("/auth/register", {
                username, email, password
            })
            // console.log(res.data);
            
            navigate("/login")

        } catch(err) {
            console.log(err)
            setError(err.response.data.message);
        } finally {
          setIsLoading(false);
        }
    };

  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username" required minLength={3} maxLength={20} type="text" placeholder="Username" />
          <input name="email" required type="text" placeholder="Email" />
          <input name="password" required type="password" placeholder="Password" />
          <button disabled={isLoading}>Register</button>
          {error && <span>{error}</span>}
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Register;