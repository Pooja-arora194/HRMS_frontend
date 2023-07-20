

import React, { useEffect, useState } from "react";
import axios from "axios";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { BASE_URL } from "../baseUrl";
import { Link, useNavigate } from 'react-router-dom';

const drawerWidth = 320;
const AddProject = () => {
  const navigate = useNavigate()


  const [openaddteam, setOpenAddTeam] = useState(false)
  const [openHandleOk, setOpenHandleOk] = useState('')
  const [openCancel, setOpenCancel] = useState('')
  const [addproject, setAddProject] = useState({
    project_name: "",
    department: "",
    status: "",
    client_name: "",
    launch_date: ""
  })

  const [teamname, setTeamName] = useState('')
  const [teamleader, setTeamLeader] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
  }
  const showAddTeam = () => {
    setOpenAddTeam(true)
  }
  const showCancel = () => {
    setOpenAddTeam(false);
  };
  const showHandleOk = () => {

  }

  const [selectedOptions, setSelectedOptions] = useState();
  const [employee, setEmployee] = useState([])


  function handleSelect(data) {
    // for(let x of data){
    //   console.log(x.value, "x.value")
    //   setSelectedOptions(x.value);
    // }
    setSelectedOptions(data)

  }


  useEffect(() => {

    axios.get(`${BASE_URL}/all_employee`)
      .then((res) => {
        setEmployee(res.data)

      })
      .catch((err) => {
        console.log(err);
      });
  }, [])


  const handlesubmit = async (e) => {
    e.preventDefault();
  };

  const values = (e) => {

    setAddProject({ ...addproject, [e.target.name]: e.target.value });

  }

  const setValue = (e) => {

    setTeamName({ ...teamname, [e.target.name]: e.target.value });

  }

  const add_project = () => {

    const { project_name, department, status, client_name, launch_date } = addproject;



    axios.post(`${BASE_URL}/add_project`, addproject)
      .then((res) => {

        // navigate("/addteam",{prokec:res.data.data.project_name})
        navigate(`/project/${res.data.data.code}`);


      })
      .catch((err) => {
        console.log(err);
      });
    setAddProject({ project_name: "", department: "", launch_date: "", status: "", client_name: "" })
  }




  return (
    <>
      <div className="add-project static_width layout">
        <div className="container">
          <h4 className="pt-3"><b>New Project</b></h4>
          <input type="file" className="pt-4"
            placeholder="Upload Logo"
          ></input>
          <div className="layout mt-5">
            <form onSubmit={handleSubmit}>
              <div className="row justify-content-between custom-row">
                <div className="col-md-3">
                  <label className="addUserLabel">Project Name</label><br />
                  <input type="text" name="project_name" value={addproject.project_name} onChange={values} className="add_userInput" placeholder="Enter Project Name" />
                </div>
                <div className="col-md-3">
                  <label className="addUserLabel">Department</label><br />
                  <select className=" add_userInput" value={addproject.department} onChange={values} name="department">

                    <option selected>Select Department</option>
                    <option value="Development">Development</option>
                    <option value="Designing">Designing</option>
                    <option value="SEO">SEO</option>
                    <option value="BDE">BDE</option>
                    <option value="HR">HR</option>

                  </select>
                </div>
                <div className="col-md-3">
                  <label className="addUserLabel">Status</label><br />
                  <select className="add_userInput" value={addproject.status} onChange={values} name="status">

                    <option selected>Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>


                  </select>
                </div>
              </div>
              <div className="row  custom-row last-row">
                <div className="col-md-3">
                  <label className="addUserLabel">Client Name</label><br />
                  <input className=" add_userInput" value={addproject.client_name} onChange={values} placeholder="Enter Client Name" type="text" name="client_name" />
                </div>
                <div className="col-md-3">
                  <label className="addUserLabel">Launch Date</label><br />
                  <input type="date" name="launch_date" className=" add_userInput"
                    value={addproject.launch_date} onChange={values} placeholder="Enter Launch Date" />
                </div>

              </div>
              <div className="submit-project">

                <input type="submit" className="add-project-btn" value="Add Project" onClick={add_project} />
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  )
}
export default AddProject