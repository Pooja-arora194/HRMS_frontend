import React, { useState } from "react";
import axios from "axios";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { BASE_URL } from "../baseUrl";
import { useNavigate } from 'react-router-dom';
const drawerWidth = 240;
const Events = () => {
    const navigate = useNavigate();
    const [submitval, setSubmitVal] = useState({
        event_title: "",
        event_date: "",
        event_description: "",
        start_time: "",
        end_time: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
    };


    const values = (e) => {

        setSubmitVal({ ...submitval, [e.target.name]: e.target.value });

    }

    const add = () => {

        let authtokens = localStorage.getItem("authtoken");
        let token = {
            headers: {
                token: authtokens,
                "Content-Type": "application/json",
            },
        };

        axios
            .post(`${BASE_URL}/add_event`, submitval, token)
            .then((res) => {
                navigate('/dashboardpage')

            })
            .catch((err) => {
                console.log(err);

            });


        setSubmitVal({ event_title: '', event_date: '', event_description: '', start_time: '', end_time: '' })
    }

    return (
        <>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(95 % - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Typography paragraph>
                    <h4 className="pt-3"><b>Add Event</b></h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row mt-4">
                            <div className="col-4">
                                <label className="py-3">Event Title</label>
                                <input type="text" name="event_title" value={submitval.event_title} className="form-control" placeholder="Enter Event Title" onChange={values} ></input>
                            </div>
                            <div className="col-4">
                                <label className="py-3">Event Date</label>
                                <input type="date" name="event_date" value={submitval.event_date} className="form-control" placeholder="Choose Date" onChange={values} ></input>
                            </div>
                        </div>
                        <div className="row pt-3">
                            <div className="col-8">
                                <label className="py-3">Event Description</label>
                                <textarea className="form-control" value={submitval.event_description} name="event_description" rows="8" onChange={values} ></textarea>
                            </div>
                        </div>
                        <div className="row ">
                            <div className="col-4">
                                <label className="py-3">Start Time</label>
                                <input type="text" name="start_time" value={submitval.start_time} className="form-control" onChange={values} ></input>
                            </div>
                            <div className="col-4">
                                <label className="py-3">End Time</label>
                                <input type="text" name="end_time" value={submitval.end_time} className="form-control" onChange={values} ></input>
                            </div>
                        </div>
                        <div className="submit_btn mt-4">
                            <button type="submit" className="btn btn-primary" onClick={add}>Post Event</button>
                        </div>
                    </form>
                </Typography>
            </Box>

        </>
    )
}

export default Events;
