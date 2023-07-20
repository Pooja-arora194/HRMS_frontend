import React, { useEffect, useState, useContext } from "react";

import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "../baseUrl.js";
import { useNavigate } from "react-router-dom";
import { LoaderContext } from "../App";
import { Table, Menu, Dropdown } from 'antd'
import moment from 'moment'
import LayoutTemplate from "../layout/Layout";
import Unauthorized from "../pages/Unauthorized.js"
import { DataContext } from "../context/DataContext.js";


function MonthlyStatus() {
    const { user } = useContext(DataContext)
    const { showLoader, hideLoader } = useContext(LoaderContext)
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [searchByName, setSearchByName] = useState('')

    const [currentStatus, setCurrentStatus] = useState([]);

    const [allUsers, setAllUsers] = useState([]);
    const [showFilter, setShowFilter] = useState(false);



    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 3000);
    };
    const search = () => {
        setShowFilter(searchByName !== '');
        if (!searchByName) {
            toast.error("Please Enter Name")
            return
        }
        let tmp = [...allUsers]
        const result = tmp.filter(value => value.userId.name.toLowerCase().includes(searchByName.toLowerCase()))
        console.log(result, "search")
        setCurrentStatus(result)
    }
    const clearFilter = () => {
        setCurrentStatus(allUsers)
        setShowFilter(false);
        setSearchByName('')
    }


    const allMonthStatus = () => {
        let authtokens = localStorage.getItem("authtoken");
        let token = {
            headers: {
                token: authtokens,
            },
        };

        if (!authtokens) {
            navigate('/');
        } else {
            showLoader();
            let authtokens = localStorage.getItem("authtoken");
            let token = {
                headers: {
                    token: authtokens,
                    "Content-Type": "application/json",
                },
            };

            axios
                .get(`${BASE_URL}/getallstatus`, token)
                .then((res) => {
                    const filteredData = res.data.filter((x) => x.userId && x.userId.emp_id !== user.emp_id && x.userId.role !== 1);

                    if (filteredData.length) {
                        setCurrentStatus(filteredData);
                        setAllUsers(filteredData);
                    } else {
                        setCurrentStatus([]);
                    }

                    console.log(res.data, "abcccccgvjhhjhjk");
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    hideLoader();
                });
        }
    };


    useEffect(() => {

        showLoader()
        allMonthStatus()

    }, [])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    {record?.userId?.name}
                </>
            )
        },
        {
            title: 'Date',
            dataIndex: 'age',
            key: 'age',
            render: (_, record) => (
                <>
                    {moment(record.checkIn).format('MMM DD')}
                </>
            )
        },

        {
            title: 'Check In',
            dataIndex: 'address',
            key: 'address',
            render: (_, record) => (
                <>
                    {moment(record.checkIn).format('MMM DD, yyyy hh:mm a')}
                </>
            )
        },
        {
            title: 'Check Out',
            dataIndex: 'address',
            key: 'address',
            render: (_, record) => (
                <>
                    {moment(record.checkOut).format('MMM DD, yyyy hh:mm a')}
                </>
            )
        },

    ];





    return (

        <>

            <div >

                <LayoutTemplate>
                    < ToastContainer ></ToastContainer >
                    <div className="container">
                        <h5 className="page-heading"><b>Monthly Status</b></h5>
                        <div className="row justify-content-between" style={{ alignItems: "center" }}>
                            <div className="col-md-5">
                                <input placeholder="Search By Name" className="add_userInputs" value={searchByName}
                                    onChange={(e) => {
                                        setSearchByName(e.target.value)
                                    }}
                                />
                            </div>
                            {/* <div className="col-md-3">
                        <input placeholder="Search By Name" className="add_userInput"/>
                    </div> */}
                            <div className="col-md-5">
                                <div className="row justify-content-between">
                                    <div className="col-md-5">
                                        <button className="search-leave-record-btn" onClick={search}>Search</button>
                                    </div>
                                    {showFilter && (
                                        <div className="col-md-5">
                                            <button className="clear-filter-btn" onClick={clearFilter}>Clear Filter</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="leave request1">

                            {/* <div className="col-sm-8 mt-4"> */}

                            <Table
                                columns={columns}
                                dataSource={currentStatus}
                            // pagination={false}
                            />
                            {/* </div> */}
                        </div>
                    </div>
                </LayoutTemplate >
            </div>


        </>
    )


}
export default MonthlyStatus;