import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Avatar from '@mui/material/Avatar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from "../../baseUrl";
import Dashboard from '../../components/dashboard';
import Profile from '../UserDashboard/profile';
import Setting from '../../components/setting';
import axios from "axios";
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Button, Modal } from 'antd';
import { Notification } from '../../helpers/constant'
const drawerWidth = 240;

function Header({ window, component }) {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [profile, setProfile] = useState('');
    const [role, setRole] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [notificationsCount, setNotificationsCount] = useState(0)



    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };





    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const logout = () => {
        localStorage.removeItem('authtoken');
        navigate('/')
    };


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
            axios.get(`${BASE_URL}/profile`, token)
                .then((res) => {
                    console.log(res.data)
                    setProfile(res.data)


                })
                .catch((err) => {
                    console.log(err);
                });
        }



    }, [])

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
                    console.log(res.data.role, "abcccccc")
                })
                .catch((err) => {
                    console.log(err);

                });
            axios.get(`${BASE_URL}/get_all_notification`, display)
                .then((res) => {
                    // setRole(res.data.role)
                    console.log(res.data, "All")
                    setNotifications(res.data)
                    let tempCount = 0
                    for (let x of res.data) {
                        if (!x.is_read) {
                            tempCount++
                        }
                    }
                    setNotificationsCount(tempCount)

                })
                .catch((err) => {
                    console.log(err);

                });
        };

    }, [])

    const read_notification = (e, element) => {
        e.preventDefault();
        let authtokens = localStorage.getItem("authtoken");
        if (!authtokens) {
            navigate('/')
        }
        let display = {
            headers: {
                'token': authtokens,
            }
        }
        axios.put(`${BASE_URL}/is_mark_read/${element}`, null, display)
            .then((res) => {
                console.log(res.data)
                if (res.data.redirect) {

                    navigate('/leaverequest')
                    let tmp = [...notifications]
                    var index = tmp.findIndex(p => p._id == element);
                    tmp.splice(index, 1)
                    setNotifications([...tmp])

                } else {
                    navigate('/leaves')
                    let tmp = [...notifications]
                    var index = tmp.findIndex(p => p._id == element);
                    tmp.splice(index, 1)
                    setNotifications([...tmp])


                }
                handleCancel()

            })
            .catch((err) => {
                console.log(err);

            });
    }

    const drawer = (
        <div>
            {/* <Toolbar /> */}
            <img src="./logo.png" style={{padding:10}} ></img>

            <Divider className='nav_divider text-center' />
            {role == 2 ?
                <List className='side_links'>

                    {[
                        <Link to="/dashboardpage">Dashboard </Link>,
                        <Link to="/profile">Profile </Link>,
                        <Link to="/leaves">Leave Quota</Link>,
                        <Link to="/applyleave">Apply Leave </Link>,
                        <Link to="/leaverequest">Leave Request</Link>,
                        <Link to="/adduser">Add Employee</Link>,
                        <Link to="/invite">Employee List</Link>,
                        // <Link to="/addproject">Add Project</Link>,

                        // <Link to="/employee_list">Employee Records</Link>,


                    ].map((text, index) => (

                        <ListItemButton>
                            <ListItemIcon>

                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>

                    ))}
                </List>
                : role == 1 ?

                    <List className='side_links'>
                        {[<Link to="/dashboardpage">Dashboard</Link>, <Link to="/profile" className="header_toggle">Profile</Link>, <Link to="/admin_leave_request">Leave Request</Link>, <Link to="/adduser">Add Employee</Link>, <Link to="/invite">Employee List</Link>, 
                        // <Link to="/employee_list">Employee Records</Link>
                    ].map((text, index) => (

                            <ListItemButton>
                                <ListItemIcon>

                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>

                        ))}
                    </List>


                    :
                    role == 0 ?

                        <List className='side_links'>
                            {[<Link to="/dashboard">Dashboard</Link>,
                            <Link to="/profile">Profile</Link>,
                            <Link to="/leaves">Leaves</Link>,
                            <Link to="/applyleave">Apply Leave</Link>].map((text, index) => (

                                <ListItemButton>
                                    <ListItemIcon>

                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>

                            ))}
                        </List>
                        : <>
                        </>
            }

        </div >
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar
                    className='main_header1'>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">

                    </Typography>
                    <div className="applyleavedec">
                        <Link to="/applyleave">
                            <img src="apply Leave.svg" ></img>
                            &nbsp;    Apply Leave  &nbsp;
                        </Link>
                        <Badge badgeContent={notifications.length} color="primary">
                            <NotificationsIcon color="white" onClick={showModal} />
                        </Badge>
                        <Modal title="Notifications" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
                            {notifications?.map((item, index) => {
                                return <>

                                    <div className={item.is_read ? "notificationCard" : "notificationCard unReadNotification"}>
                                        {/* {item.type == "pending" ? `${item.userId.name} ${Notification['pending']}` : item.type == "approved" ? `` : ``} */}
                                        <p onClick={(e) => { read_notification(e, item._id) }}>{`${item.userId.name} ${Notification[item.type]}`} </p>
                                    </div>
                                </>
                            })}
                            {notifications?.length < 1 ?
                                <>
                                    <div className="noDataFound">No Notification Found</div>
                                </>
                                : ''}


                        </Modal>
                    </div>
                    <div className="avatar_dropdown">
                        <Avatar alt={profile.name} src={BASE_URL + "/" + profile.image} />
                        <div className="employe_info">

                            <p>{profile.name} </p>
                        </div>
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label"></InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select">
                                    <MenuItem value={10}>
                                        <Link to="/profile">Profile</Link></MenuItem>

                                    <MenuItem value={20} onClick={logout}>Logout</MenuItem>

                                </Select>
                            </FormControl>
                        </Box>
                    </div>
                </Toolbar>
            </AppBar>
            <Box
                className='allNav'

                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    className='allNav'

                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    className='allNav'

                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open

                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                {/* {<props.component />} */}
                {/* {component} */}
                {/* <Toolbar /> */}

            </Box>
        </Box>
    );
}

Header.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default Header;
