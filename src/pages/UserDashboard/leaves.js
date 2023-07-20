import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Calendar, Card, Table, Modal, Menu, Dropdown } from 'antd';
import { BASE_URL } from '../../baseUrl';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { LoaderContext } from '../../App.js'
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import LayoutTemplate from '../../layout/Layout';
import { DataContext } from "../../context/DataContext";
import MoreVertIcon from '@mui/icons-material/MoreVert';


import { CardContent } from '@mui/material';
function Leaves() {
    const { showLoader, hideLoader } = useContext(LoaderContext)
    const { setUser, user } = useContext(DataContext)
    const navigate = useNavigate();
    const [leavevalue, setLeaveValue] = useState([]);
    const [pendingLeave, setPendingLeave] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [allData, setAllData] = useState([])
    const [leaveData, setLeaveData] = useState([])
    const [request, setRequest] = useState([]);
    const [open, setOpen] = useState(false);





    const openModel = () => {
        setIsModalOpen(true)
    }
    const closeModal = () => {
        setIsModalOpen(false)
    }
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

        let authtokens = localStorage.getItem("authtoken");
        let token = {
            headers: {
                token: authtokens,
                "Content-Type": "application/json",

            },
        };

        if (!authtokens) {
            navigate('/')
        }
        else {
            showLoader()
            allLeaves()
            axios.get(`${BASE_URL}/single_user_apply_leave`, token)
                .then((res) => {
                    setLeaveValue(res.data)
                    axios.get(`${BASE_URL}/profile`, token)
                        .then((res) => {
                            setPendingLeave(res.data)
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
                .catch((err) => {
                    console.log(err);
                }).finally(() => {

                    hideLoader()
                })
        }

    }, [])


    return (
        <LayoutTemplate>
            <div className='container class-leave-quota'>
                <div className='row justify-content-end'>
                    <div className='col-4'>
                        <div className='row '>
                            <div className='col-md-6 mt-2'>
                                {/* <button className='leave-approve-btn' onClick={openModel}>Leave Approval</button> */}
                            </div>
                            <div className='col-md-6 mt-2'>
                                <Link to="/applyleave">
                                    <button className='apply-leave-btn'>Apply Leaves</button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
                <h4 className='page-heading'>Leave Balance</h4>
                <div className='row justify-content-between'>
                    <div className='col-md-7 mb-2'>
                        <Card sx={{ minWidth: 200, borderRadius: 0, boxShadow: "none", padding: "none" }} bodyStyle={{ padding: "0" }} className="leave-balance-div">
                            <CardContent sx={{ boxShadow: "none", padding: 3 }} >
                                <div className='row'>
                                    <div className='col-4 leave-card-text '>Leaves</div>
                                    <div className='col-4 leave-card-text text-align-center'>Pending</div>
                                    {/* <div className='col-4 leave-card-text text-align-center'>Availed</div> */}
                                </div>
                            </CardContent>
                            <CardContent sx={{ boxShadow: "none", padding: 3, background: '#F2F2F2' }}>
                                <div className='row'>
                                    <div className='col-4 leave-card-text'>Earned Leaves</div>
                                    <div className='col-4 leave-card-count'>{user.leave?.earned_leave > 0 ? user.leave?.earned_leave : 0}</div>
                                    {/* <div className='col-4 leave-card-count'>-</div> */}
                                </div>
                            </CardContent>
                            <CardContent sx={{ boxShadow: "none", padding: 3 }}>
                                <div className='row'>
                                    <div className='col-4 leave-card-text'>Sick Leaves</div>
                                    <div className='col-4 leave-card-count'>{user.leave?.sick_leave > 0 ? user.leave?.sick_leave : 0}</div>
                                    {/* <div className='col-4 leave-card-count'>-</div> */}
                                </div>
                            </CardContent>
                            <CardContent sx={{ boxShadow: "none", padding: 3, background: '#F2F2F2' }}>
                                <div className='row'>
                                    <div className='col-4 leave-card-text'>Casual Leaves</div>
                                    <div className='col-4 leave-card-count'>{user.leave?.casual_leave > 0 ? user.leave?.casual_leave : 0}</div>
                                    {/* <div className='col-4 leave-card-count'>-</div> */}
                                </div>
                            </CardContent>
                        </Card>
                        <h4 className='page-heading'>Leaves Update</h4>
                        {
                            leavevalue?.length > 0 ?
                                (
                                    leavevalue.map((item, index) => {
                                        return <Card key={index} sx={{ minWidth: 200, borderRadius: "0px", boxShadow: "none", padding: "none" }} bodyStyle={{ padding: "0" }} className="leave-balance-div">
                                            <CardContent sx={{ boxShadow: "none", padding: 3 }} >
                                                <div className='row'>
                                                    <div className='col-4 leave-type '>{item.leave}</div>
                                                    <div className='col-4 from-to-date text-align-center'> {moment(item.from_date).format('DD MMM YYYY')} {item.to_date && '-'} {item.to_date && moment(item.to_date).format('DD MMM YYYY')}</div>
                                                    <div className='col-4 status text-align-center'>
                                                        <span
                                                            className={item.status == 'pending' || item.status == 'rejected' ? 'status-pending' : "status-approved"}
                                                        >{item.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    })
                                ) :
                                (
                                    <Card sx={{ minWidth: 200, borderRadius: "0px", boxShadow: "none", padding: "none" }} bodyStyle={{ padding: "0" }} className="leave-balance-div">
                                        <CardContent sx={{ boxShadow: "none", padding: 3 }} >
                                            No Record Found
                                        </CardContent>
                                    </Card>
                                )

                        }
                    </div>
                    <div className='col-md-4'>
                        <Calendar fullscreen={false} />

                    </div>
                </div>
            </div>
            <Modal title="Notifications" open={isModalOpen}
                bodyStyle={{ height: "100vh", marginRight: "auto" }}
                width="70%"
                zIndex={9999}
                onOk={null} onCancel={closeModal} footer={null} >
                <Table
                    columns={columns}
                    dataSource={leaveData}
                // pagination={false}
                />
            </Modal>


        </LayoutTemplate>
    )
}
export default Leaves