import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Header from "../utils/header";
import { BASE_URL } from "../../baseUrl";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LayoutTemplate from "../../layout/Layout";
import moment from 'moment'
import { DataContext } from "../../context/DataContext";

const AddUser = () => {
  const { user } = useContext(DataContext)
  const navigate = useNavigate();
  const [role, setRole] = useState('')
  const [show, setShow] = useState(false)
  const [teamLeads, setTeamLeads] = useState([])
  const [newuser, setNewUser] = useState({
    name: "",
    first_login: "",
    email: "",
    dob: "",
    phonenumber: "",
    date_of_joining: "",
    emp_id: "",
    designation: "",
    otherDesignation: '',
    profile: '',
    team_leader: ''
  },
  )

  const values = (e) => {
    setNewUser({ ...newuser, [e.target.name]: e.target.value });
  }

  const add = (e) => {
    e.preventDefault()
    const { name, email, first_login, dob, phonenumber, date_of_joining, emp_id, designation } = newuser;
    console.log(newuser)
    const empIdPattern = /^SICS\d+$/;

    if (!empIdPattern.test(emp_id)) {
      toast.error("Please enter a valid employee ID");
      return;
    }
    axios
      .post(`${BASE_URL}/add_user`, newuser)
      .then((res) => {
        setNewUser(res.data)
        console.log(res.data)
        toast.success("User Added Successfully")
        navigate('/invite')
        setNewUser({ name: "", email: "", first_login: "", emp_id: "", phonenumber: "", dob: "", date_of_joining: "", designation: "" })
      })
      .catch((err) => {
        toast.error(err.response?.data?.msg ?? "Something went wrong")
        console.log(err);

      });
  }

  useEffect(() => {
    var config = {
      method: 'get',
      url: `${BASE_URL}/get/team_leaders`,
      headers: {}
    };

    axios(config)
      .then(function (response) {
        setTeamLeads(response.data)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [])

  return (
    <LayoutTemplate>
      <ToastContainer></ToastContainer>
      <div className=" layout add-UserLayout">
        <div className="container">
          <h2 className="add-user-heading">Add Employee</h2>

          <form onSubmit={add}>
            <div className="row justify-content-between custom-row">
              <div className="col-md-3">
                <label className="addUserLabel">Employee Name</label>
                <input type="text" className=" add_userInput" onChange={values} name="name"
                  value={newuser.name} placeholder="Enter Employee Name" required />
              </div>
              <div className="col-md-3">
                <label className="addUserLabel">Email Id</label>
                <input className=" add_userInput" onChange={values}
                  value={newuser.email} placeholder="Enter Email Id" type="email" name=
                  "email" required />
              </div>
              <div className="col-md-3">
                <label className="addUserLabel">Password</label>
                <input className=" add_userInput" onChange={values}
                  value={newuser.first_login}
                  placeholder="Enter Password" type="string" name="first_login" required />
              </div>
            </div>
            <div className="row justify-content-between custom-row">
              <div className="col-md-3">
                <label className="addUserLabel">Date Of Birth</label>
                <input className=" add_userInput" onChange={values}
                  value={newuser.dob} type="date" placeholder="Enter Date Of Birth" name="dob" maxlength="4"
                  pattern="[1-9][0-9]{3}"
                  max="9999-12-30" required />
              </div>
              <div className="col-md-3">
                <label className="addUserLabel">Phone No</label>
                <input className=" add_userInput" onChange={values}
                  value={newuser.phonenumber} maxLength={10} placeholder="Enter Phone No" type="tel" name="phonenumber" required />
              </div>
              <div className="col-md-3">
                <label className="addUserLabel">Employee ID</label>
                <input className=" add_userInput" onChange={values}
                  value={newuser.emp_id}
                  placeholder="Enter Employee ID" type="string" name="emp_id" required />
              </div>
            </div>
            <div className="row justify-content-between custom-row">
              <div className="col-md-3">
                <label className="addUserLabel">Date Of Joining</label>
                <input className=" add_userInput" onChange={values}
                  // min={moment(new Date()).format('YYYY-MM-DD')}
                  value={newuser.date_of_joining}
                  maxlength="4"
                  pattern="[1-9][0-9]{3}"
                  max="9999-12-30" placeholder="Enter Date Of Joining" type="date" name="date_of_joining" required />
              </div>



              <div className="col-md-3">
                {
                  user.role == 2 ?
                    <>
                      <label className=" addUserLabel">Designation</label>
                      <select className="add_userInput" name="designation" onChange={values}
                        value={newuser.designation} required>
                        <option selected>Select Designation</option>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="Php Developer">Php Developer</option>
                        <option value="Python Developer">Python Developer</option>
                        <option value="Designer">Web Designer</option>
                        <option value="SEO">SEO</option>
                        <option value="UIUX">UI/UX</option>
                        <option value="BDE">BDE</option>

                        <option value="other">Other</option>

                      </select>
                    </>
                    : user.role == 1 ?
                      <>
                        <label className=" addUserLabel">Designation</label>
                        <select className="add_userInput" name="designation" onChange={values}
                          value={newuser.designation} required>
                          <option selected>Select Designation</option>
                          <option value="Full Stack Developer">Full Stack Developer</option>
                          <option value="Php Developer">Php Developer</option>
                          <option value="Python Developer">Python Developer</option>
                          <option value="Designer">Web Designer</option>
                          <option value="SEO">SEO</option>
                          <option value="UIUX">UI/UX</option>
                          <option value="BDE">BDE</option>
                          <option value="HR">HR</option>
                          <option value="other">Other</option>

                        </select>
                      </>
                      : ""

                }
                {newuser?.designation == "other"
                  &&
                  <>
                    <label className=" addUserLabel">Designation</label>
                    <input className="add_userInput" name='otherDesignation'
                      onChange={values} value={newuser.otherDesignation} placeholder="Enter Designation" type="text" />
                  </>
                }
              </div>
              <div className="col-md-3">
                <label className="addUserLabel">Profile</label>
                <select className="add_userInput" name="profile" onChange={values}
                  value={newuser.profile} required>
                  <option selected>Select Profile</option>
                  <option value="team_leader">Team Leader</option>
                  <option value="employee">Employee</option>
                </select>
                {newuser?.profile == "employee"
                  &&
                  <>
                    <label className="addUserLabel">Team Leader</label>
                    <select className="add_userInput" name="team_leader" onChange={values}
                      value={newuser.team_leader} required>
                      {teamLeads?.length > 0 ?
                        <>
                          <option selected>Select Team Leader</option>
                          {teamLeads.map((item, index) => {
                            return <option kye={index} value={item._id}>
                              {item.name}
                            </option>
                          })}
                        </>
                        :
                        <option disabled >No Team Leader</option>
                      }

                    </select>
                  </>
                }
              </div>
            </div>
            <input type="submit" className="add-employee-btn" value="Add Employee" />
          </form>
        </div>

      </div>
    </LayoutTemplate>
  );
};

export default AddUser;