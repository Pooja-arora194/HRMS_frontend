import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import { BASE_URL } from "../baseUrl";
const SignUp = () => {

  const navigate = useNavigate();

  const [data, setData] = useState({
    "username": "",
    "password": "",
    "email": "",
    "dob": "",
    "phonenumber": ""
  })

  const handlesubmit = async (e) => {
    e.preventDefault();
  };


  const values = (e) => {

    setData({ ...data, [e.target.name]: e.target.value });

  }

  const add = () => {

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    axios
      .post(`${BASE_URL}/signup`, data, config)
      .then((res) => {
        setData(res.data)
        // localStorage.setItem('authToken', res.data.authToken);
        navigate('/');
      })
      .catch((err) => {
        console.log(err);

      });
    setData({ username: "", email: "", password: "", dob: "", phonenumber: "" })
  }



  return (
    <>
      <div className="container mt-4">

        <div className="col-sm-6 mx-auto">
          <div className="card">
            <div className="card-header">
              <h3 className="text-center pt-5">SIGNUP </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handlesubmit}>
                <div className="form-login-wrapper">
                  <div className="form-group" align="left">
                    <label>Username*</label>
                    <input
                      type="text"
                      className="form-control formtext email"

                      placeholder="Username"
                      name="username"
                      id="Username"
                      onChange={values}
                      value={data.username}
                      required
                    />
                  </div>
                  <div className="form-group" align="left">
                    <label>Date Of Birth*</label>
                    <input
                      type="dob"
                      className="form-control formtext email"

                      placeholder="Date Of Birth"
                      name="dob"
                      id="DOB"
                      onChange={values}
                      value={data.dob}
                      required
                    />
                  </div>
                  <div className="form-group" align="left">
                    <label>Phonenumber*</label>
                    <input
                      type="phonenumber"
                      className="form-control formtext email"

                      placeholder="Phonenumber"
                      name="phonenumber"
                      id="Phonenumber"
                      onChange={values}
                      value={data.phonenumber}
                      required
                    />
                  </div>
                  <div className="form-group" align="left">
                    <label>Email*</label>
                    <input
                      type="email"
                      className="form-control formtext email"

                      placeholder="Email"
                      name="email"
                      id="Email"
                      onChange={values}
                      value={data.email}
                      required
                    />
                  </div>

                  <div className="form-group " align="left">
                    <label>Password*</label>
                    <input
                      type="password"
                      className="form-control formtext password"

                      placeholder="Password"
                      name="password"
                      id="Password"
                      onChange={values}
                      value={data.password}
                      required
                    />
                  </div>
                  {/* <p>
                Already have an account ?<Link to = '/login'>Log in</Link></p> */}
                  <div className="submit-btn mt-2" align="right">
                    <input
                      type="submit"
                      name="submit"
                      className="btn btn-danger"
                      value="SIGNUP" onClick={add}

                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;