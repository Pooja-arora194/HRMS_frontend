
import cloneDeep from "lodash/cloneDeep";
import throttle from "lodash/throttle";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import React, { useState, useEffect, useContext } from "react";
import DataTable from 'react-data-table-component';
import axios from 'axios'
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { BASE_URL } from "../baseUrl";
import { LoaderContext } from '../App.js'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Modal, Button, Dropdown, Menu } from 'antd'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useTable } from 'react-table'
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import LayoutTemplate from "../layout/Layout";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import { message, Popconfirm } from 'antd';
import moment from 'moment'
import { DataContext } from "../context/DataContext"

const tableHead = {
    name: "Name",
    parentId: "Employee Id",
    campaignType: "Email Id",
    status: "Mobile No",
    channel: "Designation",
    action: "Actions"
};



const EmployeeLists = () => {

    const { user } = useContext(DataContext)
    const { showLoader, hideLoader } = useContext(LoaderContext)
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState([]);
    const [employeelist, setEmployeeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [fillname, setName] = useState('')
    const [fillemail, setEmail] = useState('')
    const [fillphone, setPhone] = useState('')
    const [fillempID, setEmpID] = useState('')
    const [filldoj, setEmpDoj] = useState('')
    const [fillprofile, setProfile] = useState('')
    const [filldesignation, setDesignation] = useState('')
    const [filldob, setDob] = useState(new Date())
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userId, setUserId] = useState('');
    const [show, setShow] = useState(false);
    const [searchByName, setSearchByName] = useState('')
    const [searchByDesignation, setSearchByDesignation] = useState('')
    const [showFilter, setShowFilter] = useState(false);

    const cancel = (e) => {
        console.log(e);

    };

    const showModal = () => {

        setIsModalOpen(true);

    }

    const hideButton = () => {
        setShow(true);
    };


    const handleOk = () => {
        setIsModalOpen(false);
    };

    const checkId = (id) => {
        // setEmployeeList(id);
        let filtered_data = employeelist.filter(x => x.id == id)

        filtered_data = filtered_data[0]
        console.log(filtered_data, "filtered_datafiltered_data")
        setName(filtered_data.name)
        setEmail(filtered_data.email)
        setDesignation(filtered_data.designation)
        setDob(filtered_data.dob)
        setPhone(filtered_data.phonenumber)
        setEmpID(filtered_data.emp_id)
        setEmpDoj(filtered_data.date_of_joining)
        setProfile(filtered_data.profile)
        setUserId(id)
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const [collection, setCollection] = React.useState([]);
    const EmployeeList = () => {
        let authtokens = localStorage.getItem("authtoken");
        let token = {
            headers: {
                token: authtokens,
                "Content-Type": "application/json",
            },
        };

        axios.get(`${BASE_URL}/employee_list`, token)
            .then((res) => {
                if (res.data.length) {
                    setEmployeeList(res.data)
                    setCollection(res.data.slice(0, countPerPage))

                }

            })
            .catch((err) => {
                console.log(err);
            }).finally(() => {

                hideLoader()
            })
    }

    const SmallAvatar = styled(Avatar)(({ theme }) => ({
        width: 25,
        height: 25,
        border: `2px solid ${theme.palette.background.paper}`,
    }));


    const countPerPage = 10;
    const [value, setValue] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);


    const searchData = React.useRef(
        throttle(val => {
            const query = val.toLowerCase();
            setCurrentPage(1);
            const data = cloneDeep(
                employeelist
                    .filter(item => item.name.toLowerCase().indexOf(query) > -1)
                    .slice(0, countPerPage)
            );

            setCollection(data);
        }, 400)
    );


    React.useEffect(() => {
        if (!value) {
            updatePage(1);
        } else {
            searchData.current(value);
        }
    }, [value]);


    const updatePage = (p) => {
        setCurrentPage(p);
        const to = countPerPage * p;
        const from = to - countPerPage;
        setCollection(cloneDeep(employeelist.slice(from, to)));
        // console.log(employeelist.slice(from, to), "po")
    };


    useEffect(() => {
        showLoader()

        EmployeeList()
    }, [])

    const tableRows = rowData => {
        const { key, index } = rowData;
        const tableCell = Object.keys(tableHead);
        // const columnData = tableCell.map((keyD, i) => {
        //   return <td key={i}>{key[keyD]}</td>;

        // });

        // return <tr key={index}>{columnData}</tr>;
    };

    // const tableData = () => {
    //   return collection.map((key, index) => tableRows({ key, index }));
    // };

    const headRow = () => {
        return Object.values(tableHead).map((title, index) => (
            <td key={index} className="pt-3 "><b>{title}</b></td>
        ));
    };

    const confirm = (e) => {
        console.log(e);

        let authtokens = localStorage.getItem("authtoken");
        let token = {
            headers: {
                token: authtokens,
                "Content-Type": "application/json",

            },
        };

        axios.put(`${BASE_URL}/employee_remove/${userId}`, {}, token)
            .then((res) => {
                console.log(res.data, "employee_list")
                EmployeeList()
            })
            .catch((err) => {
                console.log(err);
            });

        message.success('Successfully Deleted');
    };
    const update_profile = async (req, res) => {


        let authtokens = localStorage.getItem('authtoken');

        let token = {
            headers: {
                'token': authtokens,

            }
        };

        const name = fillname;
        const email = fillemail;
        const designation = filldesignation;
        const phonenumber = fillphone;
        const dob = filldob;
        const emp_id = fillempID;
        const date_of_joining = filldoj;
        const profile = fillprofile;

        axios.put(`${BASE_URL}/update_all_profile/${userId}`, { name: fillname, email: fillemail, phonenumber: fillphone, designation: filldesignation, dob: filldob, emp_id: fillempID, date_of_joining: filldoj, profile: fillprofile }, token)

            .then((res) => {

                setName(res.data?.data?.name)
                setEmail(res.data?.data?.email)
                setDesignation(res.data?.data?.designation)
                setDob(res.data?.data?.dob)
                setPhone(res.data?.data?.phonenumber)
                setEmpID(res.data?.data?.emp_id)
                setEmpDoj(res.data?.data?.date_of_joining)
                setProfile(res.data?.data?.profile)
                setIsModalOpen(false);


            })
            .catch((err) => {
                console.log(err);
            }).finally(() => {
                EmployeeList();
                handleOk()
                hideLoader()
            })

    }

    const filter_records = () => {
        setShowFilter(searchByName !== '');

        if (searchByName != '') {


            let tmp = [...employeelist]
            const result = tmp.filter(value => value.name.toLowerCase().includes(searchByName.toLowerCase()))
            setCollection(result)
            // setSearchByName('')

        }

        if (searchByDesignation != '') {
            let tmp = [...collection]
            const result = tmp.filter(value => value.designation.toLowerCase().includes(searchByDesignation.toLowerCase()))
            setCollection(result)
            // setSearchByDesignation('')

        }
        if (searchByDesignation != '' && searchByName != '') {
            let tmp = [...collection]
            const result = tmp.filter(value => value.name.toLowerCase().includes(searchByName.toLowerCase()))
            result.filter(value => value.designation.toLowerCase().includes(searchByDesignation.toLowerCase()))
            setCollection(result)


            console.log(result, "setallresult")
        }
    }
    const clearFilterData = () => {
        EmployeeList();
        setSearchByName('')
        setSearchByDesignation('')
        setShowFilter(false);
    }

    return (
        <>
            <LayoutTemplate>
                <ToastContainer></ToastContainer>
                <div className="container Emp_list">
                    <h5>Employee List</h5>
                    <div className="row filter mt-4">
                        <div className="search-box col-md-3">
                            <input type="text" name="search" className="form-control search-input" placeholder="Search By Name"
                                onChange={(e) => { setSearchByName(e.target.value) }} value={searchByName} />

                        </div>
                        <div className="designation-box col-md-3">
                            {
                                user.role == 2 ?
                                    <>
                                        <select className="form-control designation-box" name="designation"
                                            onChange={(e) => { setSearchByDesignation(e.target.value) }} value={searchByDesignation}
                                        >
                                            <option selected>Select Designation</option>
                                            <option value="Full Stack Developer">Full Stack Developer</option>
                                            <option value="Php Developer">Php Developer</option>
                                            <option value="Designer">Designer</option>
                                            <option value="SEO">SEO</option>
                                            <option value="BDE">BDE</option>

                                            <option value="other">Other</option>

                                        </select>
                                    </>
                                    : user.role == 1 ?
                                        <>
                                            <select className="form-control designation-box" name="designation"
                                                onChange={(e) => { setSearchByDesignation(e.target.value) }} value={searchByDesignation}
                                            >
                                                <option selected>Select Designation</option>
                                                <option value="Full Stack Developer">Full Stack Developer</option>
                                                <option value="Php Developer">Php Developer</option>
                                                <option value="Designer">Designer</option>
                                                <option value="SEO">SEO</option>
                                                <option value="BDE">BDE</option>
                                                <option value="HR">HR</option>
                                                <option value="other">Other</option>

                                            </select>
                                        </>
                                        : ""

                            }
                        </div>
                        <div className="search-btn-box col-md-3">
                            <button className="btn btn-default search-btn-box" onClick={filter_records}>Search</button>

                        </div>

                        {showFilter && (
                            <div className="clear-btn-box col-md-3">
                                <button className="clear-filter" onClick={clearFilterData}>Clear Filter</button>
                            </div>
                        )}
                    </div>

                    <div className="row container employee_data">
                        <table className="container employee_list">
                            <thead>
                                <tr>{headRow()}</tr>
                            </thead>
                            {collection.length > 0 ?
                                <tbody>
                                    {
                                        collection?.map((item, i) => {
                                            return (
                                                <>
                                                    <tr
                                                    >
                                                        <td>{item?.name}</td>
                                                        <td>{item?.emp_id}</td>
                                                        <td>{item?.email}</td>
                                                        <td>{item?.phonenumber}</td>
                                                        <td>{item?.designation}</td>



                                                        <td> <Dropdown
                                                            overlay={(
                                                                <Menu>
                                                                    <Menu.Item key="0" onClick={showModal}>
                                                                        <EditOutlinedIcon />
                                                                        Edit

                                                                    </Menu.Item>
                                                                    <Menu.Item key="1" >

                                                                        <Popconfirm
                                                                            title="Delete the record"
                                                                            description="Are you sure to delete this record?"
                                                                            onConfirm={confirm}
                                                                            onCancel={cancel}
                                                                            okText="Yes"
                                                                            cancelText="No"
                                                                        >
                                                                            <DeleteOutlineIcon />Delete
                                                                        </Popconfirm>
                                                                    </Menu.Item>
                                                                </Menu>
                                                            )}
                                                            trigger={['click']}>
                                                            <a className="ant-dropdown-link"
                                                                onClick={e => e.preventDefault()}>
                                                                <MoreVertIcon onClick={(e) => { checkId(item._id) }} />

                                                            </a>
                                                        </Dropdown>
                                                        </td>
                                                        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}

                                                            footer={[
                                                                <button className="Save_changes btn btn-primary" value="submit" onClick={update_profile} >Save Changes

                                                                </button>
                                                            ]} >


                                                            <Modal
                                                                open={open}
                                                                title="Image"

                                                                footer={[

                                                                    <Button key="submit" type="primary"  >
                                                                        Submit
                                                                    </Button>,

                                                                ]}
                                                            >
                                                                <input type="file" name="image"
                                                                />

                                                            </Modal>
                                                            <div className="row mt-4" >
                                                                <div className="col-md-6 border_div">
                                                                    <label className="addUserLabel">Name</label><br />
                                                                    <input type="text" name="name" onChange={(e) => setName(e.target.value)} value={fillname} />


                                                                </div>
                                                                <div className="col-md-6 border_div">
                                                                    <label className="addUserLabel">Employee ID</label><br />
                                                                    <input type="text" name="employeeid" onChange={(e) => setEmpID(e.target.value)} value={fillempID} />


                                                                </div>


                                                            </div>
                                                            <div className="row mt-4" >
                                                                <div className="col-md-6 border_div">
                                                                    <label className="addUserLabel">Email</label><br />
                                                                    <input type="text" name="email" onChange={(e) => setEmail(e.target.value)} value={fillemail} />


                                                                </div>
                                                                <div className="col-md-6 border_div">
                                                                    <label className="addUserLabel">Phonenumber</label><br />
                                                                    <input type="tel" name="phonenumber" onChange={(e) => setPhone(e.target.value)} maxLength={10} value={fillphone} />


                                                                </div>


                                                            </div>
                                                            <div className="row mt-4" >
                                                                <div className="col-md-6 border_div">
                                                                    <label className="addUserLabel">Designation</label><br />
                                                                    <input type="text" name="position" onChange={(e) => setDesignation(e.target.value)} value={filldesignation} />


                                                                </div>
                                                                <div className="col-md-6 border_div">
                                                                    <label className="addUserLabel">Birthday</label><br />

                                                                    <input type="date" name="dob" value={moment(filldob).format('YYYY-MM-DD')} maxlength="4"
                                                                        pattern="[1-9][0-9]{3}"
                                                                        max="9999-12-30" onChange={(e) => setDob(e.target.value)} />


                                                                </div>


                                                            </div>
                                                            <div className="row mt-4" >
                                                                <div className="col-md-6 border_div">
                                                                    <label className="addUserLabel">Date Of Joining</label><br />
                                                                    <input type="date" name="date_of_joining" value={moment(filldoj).format('YYYY-MM-DD')} maxlength="4"
                                                                        pattern="[1-9][0-9]{3}"
                                                                        max="9999-12-30" onChange={(e) => setEmpDoj(e.target.value)} />
                                                                </div>
                                                                <div className="col-md-6 border_div">
                                                                    <label className="addUserLabel">Profile</label><br />

                                                                    <select className="add_userInputs1" name="profile" onChange={(e) => setProfile(e.target.value)}
                                                                        value={fillprofile} >

                                                                        <option value="team_leader">Team Leader</option>
                                                                        <option value="employee">Employee</option>
                                                                    </select>


                                                                </div>


                                                            </div>

                                                        </Modal>
                                                    </tr>
                                                </>
                                            )
                                        })
                                    }
                                </tbody>
                                : <div className="col-12">No Records Found</div>
                            }
                        </table>
                    </div>
                    <Pagination
                        pageSize={countPerPage}
                        onChange={updatePage}
                        current={currentPage}
                        total={employeelist.length}
                    />
                </div>

            </LayoutTemplate>
        </>
    );
};
export default EmployeeLists;



