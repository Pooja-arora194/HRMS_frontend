import { BASE_URL } from '../baseUrl'
import axios from 'axios'
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Tabs } from 'antd';
import LayoutTemplate from '../layout/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataContext } from '../context/DataContext';
import { useNavigate } from "react-router-dom";
import { LoaderContext } from "../App";
import { Table, Menu, Dropdown } from 'antd'
import moment from 'moment'

const MonthlyLeaveQuota = () => {
    const { user } = useContext(DataContext)
    const { showLoader, hideLoader } = useContext(LoaderContext)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [searchByName, setSearchByName] = useState('')
    const [employeeQuota, setEmployeeQuota] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [leaveDaysByUserId, setLeaveDaysByUserId] = useState({});
    const [showFilter, setShowFilter] = useState(false);
    // const [currentMonthRecords, setCurrentMonthRecords] = useState([]);
    console.log(employeeQuota, "employeeQuotaemployeeQuota")
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
        let tmp = [...allEmployees]
        const result = tmp.filter(value => value.name.toLowerCase().includes(searchByName.toLowerCase()))
        console.log(result, "searchsearch")
        setEmployeeQuota(result)
    }
    const clearFilter = () => {
        setEmployeeQuota(allEmployees)
        setShowFilter(false);
        setSearchByName('')
    }


    const allEmployeeLeaveQuota = (status) => {

        let authtokens = localStorage.getItem("authtoken");
        let token = {
            headers: {
                token: authtokens,

            },
        };

        if (!authtokens) {
            navigate('/')
        }
        else {
            showLoader()
            let authtokens = localStorage.getItem("authtoken");
            let token = {
                headers: {
                    token: authtokens,
                    "Content-Type": "application/json",

                },
            }


            axios.get(`${BASE_URL}/get_apply_leaves`, token)
                .then((res) => {
                    const filteredRecords = res.data.filter((record) => record.status === status);
                    setEmployeeQuota(filteredRecords);
                    setAllEmployees(filteredRecords);
                    calculateTotalLeaveDays(filteredRecords);
                    // filterCurrentMonthRecords(filteredRecords);
                })

                .catch((err) => {
                    console.log(err);
                }).finally(() => {

                    hideLoader()
                })
        }

    }

    useEffect(() => {

        showLoader()
        allEmployeeLeaveQuota("approved")

    }, [])

    const calculatePaidOff = (sick_leave, casual_leave) => {

        let s_count = 0
        if (sick_leave < 0) {
            s_count += sick_leave
        }
        if (casual_leave < 0) {
            s_count += casual_leave
        }

        return Math.abs(s_count)


    }

    const calculateEarnedLeave = (leave, from_date, to_date) => {
        if (leave === "Earned Leave") {
            return moment(from_date).diff(moment(to_date), 'days') + 1
        }
        return 0;
    };


    const calculateTotalLeaveDays = (employeeQuota) => {
        const leaveDaysByUserId = {};

        const currentMonth = moment().format('MMMM');

        for (let i = 0; i < employeeQuota.length; i++) {
            const { userId, from_date, to_date } = employeeQuota[i];
            const start = new Date(from_date);
            const end = new Date(to_date);

            const leaveDays = (end - start) / (1000 * 60 * 60 * 24) + 1;

            if (userId && userId.id) {
                const userIdValue = userId.id;
                const recordMonth = moment(from_date).format('MMMM');

                if (recordMonth === currentMonth) {
                    if (userIdValue in leaveDaysByUserId) {
                        leaveDaysByUserId[userIdValue] += leaveDays;
                    } else {
                        leaveDaysByUserId[userIdValue] = leaveDays;
                    }
                }
            }
        }

        setLeaveDaysByUserId(leaveDaysByUserId);
    };

    const calculate = (leave, id) => {
        const currentMonth = moment().format('MMMM');
        const currentMonthRecords = employeeQuota.filter((record) => {
            const recordMonth = moment(record.from_date).format('MMMM');
            return recordMonth === currentMonth;
        });

        const filtered = currentMonthRecords.filter((obj) => {
            return obj.userId.id === id;
        });

        return filtered.map((obj) => obj.leave);
    };



    const currentMonth = moment().format('MMMM');
    const employeeMap = new Map();

    employeeQuota.forEach((record) => {
        const recordMonth = moment(record.from_date).format('MMMM');
        if (recordMonth === currentMonth) {
            const employeeId = record.userId.id;
            if (!employeeMap.has(employeeId) || record.leave === 'Earned Leave') {
                employeeMap.set(employeeId, record);
            }
        }
    });

    const currentMonthRecords = Array.from(employeeMap.values());


    const columns = [
        {
            title: 'Name',
            dataIndex: 'userId',
            key: 'name',
            render: (userId) => {
                return userId ? userId.name : '';
            },
        },

        // {
        //     title: 'Leave Types',
        //     dataIndex: 'leave',
        //     key: 'leave',
        //     render: (leave) => {
        //         const leaveTypes = leave.split('/');
        //         return leaveTypes.join(' / ');
        //     },
        // },
        {
            title: 'Leave Types',
            dataIndex: 'leave',
            key: 'leave',
            render: (_, record, leave) => (
                <>

                    {calculate(record.leave, record.userId.id).join(' / ')}
                </>

            ),
            key: 'Casual Leave',
        },

        {
            title: 'Month',
            dataIndex: 'month',
            key: 'fromDate',
            render: (from_date) => {
                return moment(from_date).isValid() ? moment(from_date).format('MMMM YYYY') : 'N/A';
            },
        },

        {
            title: 'Earned Leave Taken',
            dataIndex: 'leave',
            key: 'earnedLeave',
            render: (_, record) => (
                <>

                    {calculateEarnedLeave(record.leave, record.to_date, record.from_date)}

                </>
            )
        },
        {
            title: 'Total Leave Taken',
            dataIndex: 'userId',
            key: 'totalLeaveDays',
            render: (userId) => {
                const totalLeaveDays = leaveDaysByUserId[userId.id];
                return totalLeaveDays || 0;
            },
        },

        {
            title: 'Paid Off',
            dataIndex: 'PO',
            key: 'PO',
            render: (_, record) => (
                <>

                    {calculatePaidOff(record.userId.leave?.sick_leave, record.userId.leave?.casual_leave)}

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

                        <h5 className="page-heading"><b>Monthly Leave Quota</b></h5>
                        <div className="row justify-content-between" style={{ alignItems: "center" }}>
                            <div className="col-md-5">
                                <input placeholder="Search By Name" className="add_userInputs" value={searchByName}
                                    onChange={(e) => {
                                        setSearchByName(e.target.value)
                                    }}
                                />
                            </div>

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
                                dataSource={currentMonthRecords}

                                pagination={false}
                            />
                            {/* </div> */}
                        </div>
                    </div>
                </LayoutTemplate >
            </div>


        </>

    )
}
export default MonthlyLeaveQuota;

