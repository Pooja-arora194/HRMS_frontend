import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../utils/header";
import Dashboard from "../../components/dashboard";
import { BASE_URL } from "../../baseUrl";

function Dashboards() {
    const navigate = useNavigate();
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
                    "Content-Type": "application/json",
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

                });
        };

    }, [])

    return (
        <>
            {show ?
                <div >
                    <Dashboard />
                </div>
                : ''
            }

        </>





    )
}
export default Dashboards;
