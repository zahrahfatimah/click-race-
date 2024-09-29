import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Toastify from "toastify-js";

export default function Register() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const body = { username };
      const { data } = await axios.post(
        "https://click.daseas.cloud/register",
        body
      );
      console.log(data);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("userId", data.user.id);

      Toastify({
        text: `Succedd Register`,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#008000",
        },
        onClick: function () {}, // Callback after click
      }).showToast();

      navigate("/");
    } catch (error) {
      console.log(error);
      Toastify({
        text: error.response.data.message,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#FF0000",
        },
        onClick: function () {}, // Callback after click
      }).showToast();
    }
  }

  return (
    <>
      <div className="body">
        <div className="Ring">
          <i style={{ color: "#00ff0a" }}></i>
          <i style={{ color: "#ff0057" }}></i>
          <i style={{ color: "#f8e80c" }}></i>
          <form onSubmit={handleRegister} className="login">
            <h2>Register</h2>
            <div className="inputBox">
              <input
                type="text"
                id="Username"
                name="Username"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="inputBox">
              <button className="btn" type="submit" id="button" value="Sign in">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
