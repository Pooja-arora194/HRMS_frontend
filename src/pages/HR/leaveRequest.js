import React, { useEffect, useState, useContext } from "react";

import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "../../baseUrl";
import { useNavigate } from "react-router-dom";
import { LoaderContext } from '../../App.js'
import { Table, Menu, Dropdown } from 'antd'
import moment from 'moment'
import LayoutTemplate from "../../layout/Layout";
import MoreVertIcon from '@mui/icons-material/MoreVert';


function LeaveRequest() {
    const { showLoader, hideLoader } = useContext(LoaderContext)
    const navigate = useNavigate();
    const [request, setRequest] = useState([]);
    const [value, setValue] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [leaveData, setLeaveData] = useState([])
    const [leaveId, setLeaveId] = useState('');
    const [searchByName, setSearchByName] = useState('')
    const [allData, setAllData] = useState([])
    const [showFilter, setShowFilter] = useState(false);

    const showModal = (e, id) => {
        e.preventDefault();
        setLeaveId(id)
        setOpen(true);
    };

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
        let tmp = [...allData]
        const result = tmp.filter(value => value.userId.name.toLowerCase().includes(searchByName.toLowerCase()))
        console.log(result, "search")
        setLeaveData(result)
    }
    const clearFilter = () => {
        setLeaveData(allData)
        setSearchByName('')
        setShowFilter(false);
    }


    const columns = [
        {
            title: 'Emp ID',
            dataIndex: ['userId', 'emp_id'],
            key: 'name',

        },
        {
            title: 'Name',
            dataIndex: ['userId', 'name'],
            key: 'name',
        },
        {
            title: 'Date From',
            // dataIndex: 'from_date',
            render: (_, record) => (
                moment(record.from_date).format('DD MMM YYYY')
            ),
            key: 'from_date',
        },

        {
            title: 'Date To',
            key: 'to_date',
            render: (_, record) => (
                moment(record?.to_date).isValid() ?
                    <>
                        {moment(record?.to_date).format('DD MMM YYYY')}
                    </>
                    :
                    <>
                        N/A
                    </>
            ),
        },
        {
            title: 'Leave',
            dataIndex: 'leave',
            key: 'leave',
        },
        {
            title: 'Days',
            key: 'leave_type',
            render: (_, record) => (

                moment(record?.to_date).diff(moment(record?.from_date), 'days') + 1 > 0 ?
                    <>{moment(record?.to_date).diff(moment(record?.from_date), 'days') + 1 + " Days"}</>
                    :
                    <>half Day</>
            ),
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
        },

        {
            title: '',
            key: 'action',
            render: (_, record) => (
                // <Space size="middle">
                record.status == "approved" ? <td> <button className="approved-btn-disabled" disabled>Approved</button></td>
                    : record.status == "pending" ?
                        <>
                            <td>
                                {/* <CheckIcon className="not_approve" onClick={(e) => { list(e, element.userId.id, element.leave.name, element._id) }} /> */}
                                <button className="approved-btn" onClick={(e) => { list(e, record.userId.id, record.leave.name, record._id) }}>Approve</button>
                            </td>
                            <td>
                                {/* <CloseIcon onClick={(e) => { cancel_request(e, element.userId.id, element._id) }} /> */}
                                <button className="deny-btn" onClick={(e) => { cancel_request(e, record.userId.id, record._id) }} >Deny</button>
                            </td>
                        </>

                        : <button className="deny-btn-disabled" disabled>Rejected</button>
            ),
        },
        {
            title: '',
            key: 'reason',
            render: (_, record) => (

                <>
                    {record.status == 'pending' ? ""
                        :
                        <>
                            <Dropdown

                                overlay={(
                                    <Menu>

                                        {record.status == "approved" ?
                                            <Menu.Item key="0" disabled>
                                                Approve
                                            </Menu.Item>
                                            :
                                            <Menu.Item key="0" onClick={(e) => { list(e, record.userId.id, record.leave.name, record._id) }}>
                                                Approve
                                            </Menu.Item>
                                        }
                                        {record.status == "rejected" ?
                                            <Menu.Item key="1" disabled>
                                                Deny
                                            </Menu.Item>
                                            :
                                            <Menu.Item key="1" onClick={(e) => { DenyLeave(e, record._id) }}>
                                                Deny
                                            </Menu.Item>
                                        }


                                    </Menu>
                                )}
                                trigger={['click']}>
                                <a className="ant-dropdown-link"
                                    onClick={e => e.preventDefault()}>
                                    <MoreVertIcon />

                                </a>
                            </Dropdown>

                        </>
                    }
                </>

            ),
        },
    ];
    const DenyLeave = (e, apply_leave_id) => {
        let authtokens = localStorage.getItem("authtoken");
        let token = {
            headers: {
                token: authtokens,
                "Content-Type": "application/json",

            },
        }
        console.log(apply_leave_id)
        axios.put(`${BASE_URL}/edit_leave_deny/${apply_leave_id}`, {}, token)
            .then((res) => {
                console.log("res", res.data)
                allLeaves()
                setOpen(false)

            })
            .catch((err) => {
                console.log(err);
            });
    }
    const allLeaves = () => {
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
                    setRequest(res.data)
                    setLeaveData(res.data)
                    setAllData(res.data)
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
        allLeaves()

    }, [])


    const list = (e, id, item, apply_leave_id) => {
        // e.preventDefault();



        axios.post(`${BASE_URL}/update_leave/${id}`, { leave_type: item, apply_leave_id: apply_leave_id }

        )
            .then((res) => {

                toast.success("Leave Approved")
                allLeaves();
            })
            .catch((err) => {
                console.log(err);

            });

    }

    const cancel_request = (e, id, apply_leave_id) => {

        e.preventDefault();


        axios.put(`${BASE_URL}/cancel_leave/${id} `, { apply_leave_id: apply_leave_id }

        )
            .then((res) => {
                toast.success("Leave Rejected")
                allLeaves()

            })
            .catch((err) => {
                console.log(err);

            });
    }


    return (
        <LayoutTemplate>
            <ToastContainer></ToastContainer>
            <div className="container">
                <h5 className="page-heading"><b>Leave Requests</b></h5>
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
                    <h6 className="sick-leave-title-border"> Sick/Casual Leave Requests</h6>

                    <Table
                        columns={columns}
                        dataSource={leaveData}

                    />

                </div>
            </div>
        </LayoutTemplate>
    )
}
export default LeaveRequest;