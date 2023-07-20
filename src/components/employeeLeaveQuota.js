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
import { Table, Modal, Button } from 'antd'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import moment from 'moment'
const EmployeeLeaveQuota = () => {
    const { user } = useContext(DataContext)
    const { showLoader, hideLoader } = useContext(LoaderContext)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [searchByName, setSearchByName] = useState('')
    const [employeeQuotas, setEmployeeQuotas] = useState([]);
    const [allEmployeesData, setAllEmployeesData] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [excelFile, setExcelFile] = useState('');
    const [Leaves, setLeaves] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [id, setId] = useState('')
    const [fill_Casual_leave, set_fill_Casual_leave] = useState('')
    const [fill_Sick_leave, set_fill_Sick_leave] = useState('')
    const [fill_Earned_leave, set_fill_Earned_leave] = useState('')


    const showModalOpen = (e, id) => {
        e.preventDefault()
        setId(id)
        let filtered_data = allEmployeesData.filter(x => x.id == id)
        filtered_data = filtered_data[0]
        console.log(filtered_data, "filtered_datafiltered_data")
        set_fill_Casual_leave(filtered_data.leave.casual_leave)
        set_fill_Sick_leave(filtered_data.leave.sick_leave)
        set_fill_Earned_leave(filtered_data.leave.earned_leave)
        setIsOpen(true);

    };
    const handleOkButton = () => {
        setIsOpen(false);
    };

    const handleCancelButton = () => {
        setIsOpen(false);
    };



    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk1 = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
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
        let tmp = [...allEmployeesData]
        const result = tmp.filter(value => value.name.toLowerCase().includes(searchByName.toLowerCase()))
        console.log(result, "searchsearch")
        setEmployeeQuotas(result)
    }
    const clearFilter = () => {
        setEmployeeQuotas(allEmployeesData)
        setShowFilter(false);
        setSearchByName('')
    }


    const allEmployeeLeaveQuota = () => {

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


            axios.get(`${BASE_URL}/getAllUserdata`, token)
                .then((res) => {

                    setEmployeeQuotas(res.data)
                    setAllEmployeesData(res.data)
                    const filterData = res.data.filter((x) => x.emp_id !== user.emp_id)

                    if (filterData.length) {
                        setEmployeeQuotas(filterData)
                    } else {
                        setEmployeeQuotas(res.data)
                    }


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
        allEmployeeLeaveQuota()

    }, [])



    const handleExcelFile = () => {
        showLoader()
        const file = excelFile;
        const formData = new FormData();

        formData.append("file", excelFile);

        let authtokens = localStorage.getItem('authtoken');

        let axiosSheet = {
            headers: {
                'token': authtokens,

            }
        };

        axios.post(`${BASE_URL}/excel_uploader`, formData, axiosSheet)
            .then((res) => {
                toast.success("File Successfully Uploaded");
                window.location.reload()
                console.log(res.data, "excelsheets");
            })
            .catch((err) => {
                console.log(err);
            }).finally(() => {
                hideLoader()
            })
        setIsModalOpen(false);

    }
    // const calculatePaidOff = (sick_leave, casual_leave) => {

    //     let s_count = 0
    //     if (sick_leave < 0) {
    //         s_count += sick_leave
    //     }
    //     if (casual_leave < 0) {
    //         s_count += casual_leave
    //     }
    //     return Math.abs(s_count)

    // }


    const updateLeaves = async (req, res) => {

        let authtokens = localStorage.getItem('authtoken');

        let token = {
            headers: {
                'token': authtokens,

            }
        };

        const casual_leave = fill_Casual_leave;
        const sick_leave = fill_Sick_leave;
        const earned_leave = fill_Earned_leave;


        if (!casual_leave && !sick_leave && !earned_leave) {
            console.log('No values provided. Leave data will not be updated.');
            hideLoader();
            setIsOpen(false);
            return;
        }

        axios.put(`${BASE_URL}/update_all_Leaves/${id}`, { casual_leave: fill_Casual_leave, sick_leave: fill_Sick_leave, earned_leave: fill_Earned_leave }, token)

            .then((res) => {
                toast.success("Leaves Updated Successfully");
                console.log(res.data, "dataaaaaaaaaaaa")
                window.location.reload()
            })
            .catch((err) => {
                console.log(err);
            }).finally(() => {

                hideLoader()
            })
        setIsOpen(false);
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    {record.name}

                </>
            )
        },
        {
            title: 'Earned Leave',
            dataIndex: 'EL',
            key: 'EL',
            render: (_, record) => (
                <>
                    {record.leave.earned_leave > 0 ? record.leave.earned_leave : 0}
                </>
            )
        },
        {
            title: 'Casual Leave',
            dataIndex: 'CL',
            key: 'CL',
            render: (_, record) => (
                <>
                    {record.leave.casual_leave > 0 ? record.leave.casual_leave : 0}

                </>
            )
        },
        {
            title: 'Sick Leave',
            dataIndex: 'SL',
            key: 'SL',
            render: (_, record) => (
                <>
                    {record.leave.sick_leave > 0 ? record.leave.sick_leave : 0}

                </>
            )
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <>

                    <EditOutlinedIcon onClick={(e) => { showModalOpen(e, record._id) }} />
                    <Modal title="Edit Leaves Record" open={isOpen} onOk={handleOkButton} onCancel={handleCancelButton}
                        footer={[

                            <Button key="submit" type="primary" onClick={updateLeaves}>
                                Submit
                            </Button>

                        ]}>


                        <div className="row mt-4" >
                            <div className="col-md-6 border_div">
                                <label className="addUserLabel">Casual Leave</label><br />
                                <input type="text" name="casual_leave" onChange={(e) => set_fill_Casual_leave(e.target.value)} value={fill_Casual_leave} />
                            </div>

                        </div>
                        <div className="row mt-4" >
                            <div className="col-md-6 border_div">
                                <label className="addUserLabel">Sick Leave</label><br />
                                <input type="text" name="sick_leave" onChange={(e) => set_fill_Sick_leave(e.target.value)} value={fill_Sick_leave} />

                            </div>
                        </div>
                        <div className="row mt-4" >
                            <div className="col-md-6 border_div">
                                <label className="addUserLabel">Earn Leave</label><br />
                                <input type="text" name="earned_leave" onChange={(e) => set_fill_Earned_leave(e.target.value)} value={fill_Earned_leave} />

                            </div>
                        </div>

                    </Modal>

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

                        <h5 className="page-heading upload_btn"><b>All Leave Quota</b>
                            <div className="uploadIcon">


                                <>
                                    <img src='/plus.png' onClick={showModal}></img>
                                    <Modal title="Upload Your Excel Sheet  " open={isModalOpen} onOk={handleOk1} onCancel={handleCancel}

                                        footer={[

                                            <Button key="submit" type="primary" onClick={handleExcelFile}>
                                                Submit
                                            </Button>,

                                        ]}
                                    >
                                        <input type="file" name="file" onChange={(e) =>
                                            setExcelFile(e.target.files[0])} />
                                    </Modal>
                                </>

                            </div>
                        </h5>

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


                            <Table
                                columns={columns}
                                dataSource={employeeQuotas}

                            />

                        </div>

                    </div>
                </LayoutTemplate >
            </div >


        </>

    )
}
export default EmployeeLeaveQuota;

