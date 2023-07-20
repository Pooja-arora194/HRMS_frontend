import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import Header from "../utils/header";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { BASE_URL } from "../../baseUrl";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 0;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function LeaveRequests() {

    const navigate = useNavigate();
    const [request, setRequest] = useState([]);
    const [role, setRole] = useState('')
    const [show, setShow] = useState(false)



    useEffect(() => {

        let authtokens = localStorage.getItem("authtoken");
        if (!authtokens) {
            navigate('/login')
        }
        else {
            let display = {
                headers: {
                    'token': authtokens,
                }
            }


            axios.get(`${BASE_URL}/all`, display)
                .then((res) => {

                    setRole(res.data.role)
                    if (res.data.role == 1) {
                        setShow(true)

                    }
                    else {
                        navigate('/login')
                    }
                })
                .catch((err) => {
                    console.log(err);

                });
        };

    }, [])

    useEffect(() => {
        let authtokens = localStorage.getItem("authtoken");
        let token = {
            headers: {
                token: authtokens,
            },
        };

        if (!authtokens) {
            navigate('/login')

        } else {

            let token = {
                headers: {
                    token: authtokens,

                },

            };
            axios.get(`${BASE_URL}/admin_get_apply_leave`)
                .then((res) => {
                    console.log(res.data, "check1")
                    setRequest(res.data)

                })
                .catch((err) => {
                    console.log(err);

                });
        }


    }, [])


    const list = (e, id, item, apply_leave_id) => {
        e.preventDefault();



        axios.post(`${BASE_URL}/update_leave/${id}`, { leave_type: item, apply_leave_id: apply_leave_id }

        )
            .then((res) => {
                window.location.reload();
                console.log(res.data, "checking")
                toast.success("Leave Approved")


            })
            .catch((err) => {
                console.log(err);

            });

    }

    const cancel_request = (e, id, apply_leave_id) => {

        e.preventDefault();
        console.log(id, apply_leave_id, "gfjhsd");
        axios.put(`${BASE_URL}/cancel_leave/${id}`, { apply_leave_id: apply_leave_id }

        )
            .then((res) => {
                console.log(res.data)
                toast.error("Leave Rejected")

            })
            .catch((err) => {
                console.log(err);

            });
    }


    return (
        <>

            <Header />
            <ToastContainer></ToastContainer>
            {request ?
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3 }}
                >
                    <Toolbar />
                    <Typography paragraph>

                        <h5 className="mt-4"><b>Leave Requests</b></h5>
                        <div className="leave">
                            <h6 className="sick_border"> Sick/Casual Leave Requests</h6>
                            <div className="col-sm-8 mt-4">
                                <table class="table ">
                                    <thead>
                                        <th>Emp Id</th>
                                        <th>Name</th>
                                        <th>Leave Type</th>

                                        <th>From Date</th>
                                        <th>To Date</th>

                                        <th>Reason</th>
                                    </thead>

                                    {request.length > 0 ?
                                        <tbody>

                                            {
                                                request?.map((element) => {
                                                    return (
                                                        <>
                                                            <tr>
                                                                <td>{element.userId?.emp_id}</td>
                                                                <td>{element.userId?.name}</td>
                                                                <td>{element.leave?.name}</td>
                                                                <td>{element.from_date}</td>
                                                                <td>{element.to_date}</td>
                                                                <td>{element.reason}</td>


                                                                {element.status == "approved" ? <td> <CheckIcon className="right" /></td>
                                                                    : element.status == "pending" ?
                                                                        <>
                                                                            <td><CheckIcon className="not_approve" onClick={(e) => { list(e, element.userId.id, element.leave.name, element._id) }} /></td>
                                                                            <td> <CloseIcon onClick={(e) => { cancel_request(e, element.userId.id, element._id) }} /></td>
                                                                        </>

                                                                        : <td><CloseIcon className="reject" /></td>
                                                                }



                                                            </tr>
                                                        </>
                                                    )
                                                })
                                            }


                                        </tbody>

                                        :
                                        <tr><td colspan="8"><h5 className="leave_no_found">No Record Found</h5></td></tr>
                                    }
                                </table>
                            </div>
                        </div>

                    </Typography>
                </Box>
                : ''
            }
        </>
    )
}
export default LeaveRequests;