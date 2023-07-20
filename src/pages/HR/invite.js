import React, { useEffect, useState, useContext } from "react";

import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import Header from "../utils/header";
import { BASE_URL } from "../../baseUrl";
import CheckIcon from '@mui/icons-material/Check';
import { LoaderContext } from '../../App.js'
import LayoutTemplate from "../../layout/Layout";

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



function Invite() {
    const { showLoader, hideLoader } = useContext(LoaderContext)
    const navigate = useNavigate();
    const [request, setRequest] = useState([]);

    const [role, setRole] = useState('')
    const [show, setShow] = useState(false)



    useEffect(() => {

        let authtokens = localStorage.getItem("authtoken");
        if (!authtokens) {
            navigate('/')
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
                    if (res.data.role == 2 || res.data.role == 1) {
                        setShow(true)
                    }
                    else {
                        navigate('/')
                    }
                })
                .catch((err) => {
                    console.log(err);

                })

        };

    }, [])



    useEffect(() => {
        showLoader()
        axios.get(`${BASE_URL}/all_add_employee`)
            .then((res) => {
                setRequest(res.data)
            })
            .catch((err) => {
                console.log(err);

            }).finally(() => {

                hideLoader()
            })


    }, [])

    const invite = (e, id) => {
        e.preventDefault();
        axios.post(`${BASE_URL}/invite`, { _id: id })
            .then((res) => {
                window.location.reload();
                toast.success("Invite Sent")


            })
            .catch((err) => {
                console.log(err);

            });

    }




    return (
        <LayoutTemplate>
            <ToastContainer></ToastContainer>
            <div className="container">
                <h5 className="mt-4"><b> Employee Invite</b></h5>
                <div className="leave">

                    <div className="col-sm-10 mt-4">
                        <table class="table ">
                            <thead>
                                <th>Emp Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Action</th>
                            </thead>
                            {request.length > 0 ?
                                <tbody>
                                    {
                                        request.map((element) => {
                                            return (
                                                <>
                                                    <tr>
                                                        <td>{element.name}</td>
                                                        <td>{element.emp_id}</td>
                                                        <td>{element.email}</td>
                                                        {element.invite_status == "true" ? <td> <CheckIcon /></td>
                                                            : <td><button className="btn btn-primary inviteBtn" onClick={(e) => { invite(e, element._id) }}>Invite Link</button></td>
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
            </div>
        </LayoutTemplate>

    )
}
export default Invite;
