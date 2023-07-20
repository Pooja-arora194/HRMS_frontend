

import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Avatar } from "antd";
import { Button, Modal } from 'antd';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';
import Header from "../pages/utils/header";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../baseUrl";
const drawerWidth = 320;
const AddTeam = () => {


    const { code } = useParams();

    const [openaddteam, setOpenAddTeam] = useState(false)
    const [openHandleOk, setOpenHandleOk] = useState('')
    const [openCancel, setOpenCancel] = useState('')


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
    const [project, setProject] = useState([])
    const [projectId, setProjectId] = useState('')


    function handleSelect(data) {
        // for(let x of data){
        //   console.log(x.value, "x.value")
        //   setSelectedOptions(x.value);
        // }
        setSelectedOptions(data)

    }


    useLayoutEffect(() => {
        //id project
        axios.get(`${BASE_URL}/project/${code}`)
            .then((res) => {

                setProject(res.data);
                for (let x of res.data) {
                    setProjectId(x.id)
                }

            })
            .catch((err) => {
                console.log(err);
            });
    }, [])



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

    const setValue = (e) => {

        setTeamName({ ...teamname, [e.target.name]: e.target.value });

    }






    const add_team = () => {
        const { team_name } = teamname

        axios.post(`${BASE_URL}/add_team`, { team_name: team_name, team_leader_id: teamleader, project_id: projectId, selectedOptions: selectedOptions, code: code })
            .then((res) => {


            })
            .catch((err) => {
                console.log(err);
            });
        setOpenAddTeam(false);
    }

    return (
        <>

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3 }}
            >
                <Toolbar />
                <Typography paragraph className="add_project">

                    {/* <input type="file" className="pt-4"
                        placeholder="Upload Logo"
                    ></input> */}



                    <div className="layout mt-5">
                        {
                            project.map((element) => {
                                return (
                                    <>


                                        <div className="row mt-4">
                                            <div className="col-md-4">
                                                <label className="addUserLabel"><b>Project Name</b></label><br />
                                                <h6 className="pt-3">{element.project_name}</h6>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="addUserLabel"><b>Department</b></label><br />
                                                <h6 className="pt-3">{element.department}</h6>

                                            </div>
                                            <div className="col-md-4">
                                                <label className="addUserLabel"><b>Status</b></label><br />
                                                <h6 className="pt-3">{element.status}</h6>
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-md-4 mt-4">
                                                <label className="addUserLabel"><b>Client Name</b></label><br />
                                                <h6 className="pt-3">{element.client_name}</h6>
                                            </div>
                                            <div className="col-md-4 mt-4">
                                                <label className="addUserLabel"><b>Launch Date</b></label><br />
                                                <h6 className="pt-3">{element.project_name}</h6>
                                            </div>

                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>


                </Typography>
                <Typography paragraph className="add_teams">
                    <div className="layout">
                        <form onSubmit={handleSubmit}>
                            <h5 className="team_button"><b>Teams</b>
                                <button className="add_team_button" onClick={showAddTeam}>Add Team</button>
                                <Modal
                                    open={openaddteam}
                                    title="add team"
                                    onOk={showHandleOk}
                                    onCancel={showCancel}
                                    footer={[

                                        <Button key="submit" type="primary" onClick={add_team} >
                                            Add Team
                                        </Button>,

                                    ]}
                                >
                                    <label className="mb-2">Team Name</label>
                                    <input type="text" className="form-control" onChange={setValue} name="team_name" placeholder="Enter Team Name" />
                                    <label className="mt-2 pb-2">Member</label>

                                    <div className="app_team">

                                        <div className="dropdown-container ">
                                            <Select
                                                options={employee}
                                                placeholder="Select Member"
                                                value={selectedOptions}
                                                onChange={handleSelect}
                                                isSearchable={true}
                                                isMulti
                                            />
                                        </div>
                                    </div>

                                    <label className="mt-2 pb-2">Team Leader</label>
                                    <select className="form-control" name="team_leader_id" onChange={(e) => setTeamLeader(e.target.value)} value={teamleader}>
                                        <option>Select Team Leader</option>
                                        {
                                            employee.map((element, index) => {
                                                return (
                                                    <>

                                                        <option value={element.value}>{element.label}</option>
                                                    </>
                                                )
                                            })
                                        }

                                    </select>

                                </Modal>
                            </h5>
                            <div className="row mt-5 add-team_border">
                                {
                                    project.map((item, i) => {
                                        return (
                                            <>
                                                {item.teams.map((element, i) => {
                                                    return (
                                                        <>


                                                            <div className="col-md-4 border_style">
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <h5><b>{element.team_name}</b></h5>
                                                                        <h6>3 Members</h6>
                                                                        <h6>Edit Members</h6>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <Avatar></Avatar>
                                                                        <Avatar></Avatar>
                                                                        <Avatar></Avatar>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                })

                                                }
                                            </>
                                        )
                                    })
                                }
                            </div>

                        </form>
                    </div>
                </Typography>
            </Box>
        </>
    )
}
export default AddTeam