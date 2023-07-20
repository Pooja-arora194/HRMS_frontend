import React, { useEffect, useState, useContext } from "react";
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import axios from "axios";
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate, Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import { Notification } from '../helpers/constant'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button, Modal } from 'antd';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CardHeader from '@mui/material/CardHeader';
import { styled } from '@mui/material/styles';
import { IconButtonProps } from '@mui/material/IconButton';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import * as moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';
import MenuIcon from '@mui/icons-material/Menu';

import { Dropdown, Space } from 'antd';
import { BASE_URL } from "../baseUrl";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { LoaderContext } from '../App.js'

const drawerWidth = 300;


interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


function UserDashboard(props) {
    const [notifications, setNotifications] = useState([])
    const [notificationsCount, setNotificationsCount] = useState(0)
    const { showLoader, hideLoader } = useContext(LoaderContext)
    const navigate = useNavigate();
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
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
                } else {
                    navigate('/leaves')

                }
                navigate('/leaverequest')
                let tmp = [...notifications]
                var index = tmp.findIndex(p => p._id == element);
                tmp.splice(index, 1)
                setNotifications([...tmp])
                handleCancel()

            })
            .catch((err) => {
                console.log(err);

            });
    }
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
    const bull = (
        <Box
            component="span"
            sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
        >
            •
        </Box>
    );
    const container = window !== undefined ? () => window().document.body : undefined;
    const [expanded, setExpanded] = React.useState(false);
    const [profileval, setProfileVal] = React.useState('');
    const [login, setLogin] = React.useState('');
    const [isActive, setIsActive] = useState([]);
    const [openname, setOpenname] = useState(false);
    const [openedit, setOpenEdit] = useState(false);
    const [addpost, setAddPost] = useState('');
    const [addtitle, setAddTitle] = useState('');
    const [id, setId] = useState('');
    const [imageval, setImageVal] = useState('');
    const [allemployee, setAllEmployee] = useState([]);
    const [allpost, setAllPost] = useState([]);
    const [likeval, setLikeVal] = useState([]);
    const [event, setEvent] = useState([]);
    const [openComment, setOpenComment] = useState([]);
    const [addcomment, setAddComment] = useState('')
    const [postid, setPostId] = useState('');
    const [anniversary, setAnniversary] = useState([])
    const handlePost = async (e) => {
        setAddPost(e.target.value)
    }

    const handleTitlePost = async (e) => {
        setAddTitle(e.target.value)
    }

    const nameHandleCancel = () => {
        setOpenname(false);
    };



    const editHandleCancel = () => {
        setOpenEdit(false);
    };


    const nameShowModal = () => {
        setOpenname(true);
    };


    const editShow = () => {
        setOpenEdit(true);
    };

    const nameHandleOk = () => {


        const description = addpost;
        const title = addtitle
        const image = imageval;

        const formData = new FormData();
        formData.append("title", addtitle);
        formData.append("description", addpost);
        formData.append("image", imageval);
        const config = {
            header: {
                "Content-Type": "application/json",
            },
        };

        axios.post(`${BASE_URL}/add_post`, formData, config)
            .then((res) => {

                setAddPost(res.data)

            })
            .catch((err) => {
                console.log(err);
            });
        setAddPost('');
        setAddTitle('')
        setImageVal('');
        setOpenname(false);

    }
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };


    const editHandleOk = () => {

    }

    useEffect(() => {


        let authtokens = localStorage.getItem("authtoken");
        let token = {
            headers: {
                token: authtokens,
                "Content-Type": "application/json",
            },
        };

        axios.get(`${BASE_URL}/profile`, token)
            .then((res) => {

                setProfileVal(res.data)
                setLogin(true)

            })
            .catch((err) => {
                console.log(err);
            });

    }, [])

    useEffect(() => {
        axios.get(`${BASE_URL}/employee_birthday`)
            .then((res) => {
                setAllEmployee(res.data)

            })
            .catch((err) => {
                console.log(err);
            });

    }, [])


    useEffect(() => {
        axios.get(`${BASE_URL}/employee_anniversary`)
            .then((res) => {
                setAnniversary(res.data)
                console.log(res.data, "annivery")
            })
            .catch((err) => {
                console.log(err);
            });

    }, [])



    const record = (id) => {
        setId(id)
    }

    const handleDelete = () => {
        axios.delete(`${BASE_URL}/delete_post/${id}`)
            .then((res) => {
                const filter_data = allpost.filter((x) => x._id != id)
                setAllPost(filter_data)
            })
            .catch((err) => {
                console.log(err);
            });
    }


    useEffect(() => {
        showLoader()
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
            axios.get(`${BASE_URL}/all_post`, token)
                .then((res) => {
                    console.log(res.data)
                    setAllPost(res.data)

                })
                .catch((err) => {
                    console.log(err);
                }).finally(() => {

                    hideLoader()
                })

        }


    }, [])

    const logout = () => {
        localStorage.removeItem('authtoken');
        setLogin(false);
        navigate('/')
    };


    const post_id = (e, element, isLike) => {
        e.preventDefault();


        let authtokens = localStorage.getItem("authtoken");
        let token = {
            headers: {
                token: authtokens,
                "Content-Type": "application/json",
            },
        };
        showLoader()
        axios.post(`${BASE_URL}/like/${element}`, {}, token)
            .then((res) => {
                setLikeVal(res.data)
                const filterrecord = allpost.map((val) => {

                    if (val.x._id == element) {
                        val.isLike = !isLike
                    }
                    return val
                })
                setAllPost(filterrecord)
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                hideLoader()
            })

    }

    const commentShowModal = (item, index) => {
        openComment[index] = true
        setOpenComment([...openComment])
        setPostId(item);

    };
    const handleComment = async (e) => {
        setAddComment(e.target.value)
    }
    const commentHandleOk = (index) => {


        const content = addcomment
        if (content.length > 0) {

            let authtokens = localStorage.getItem("authtoken");
            let token = {
                headers: {
                    token: authtokens,
                },
            };

            const formData = new FormData();
            formData.append("content", addcomment);

            axios.post(`${BASE_URL}/comment/${postid}`, { content: content }, token)
                .then((res) => {

                })
                .catch((err) => {
                    console.log(err);
                });
        }
        setAddComment('');
        openComment[index] = false
        setOpenComment([...openComment])
    }

    const monthDiff = (

    ) => {

        const past_date = new Date();
        const current_date = new Date(date_of_joining);
        const difference = (past_date.getFullYear() * 12 + past_date.getMonth()) - (current_date.getFullYear() * 12 + current_date.getMonth());
        let months;
        // const months = (difference / 12 | 0) + " years and " + difference % 12 + " months"
        if (difference >= 12) {
            return (
                months = (difference / 12 | 0) + " years and " + difference % 12 + " months"
            )
        } else if (difference < 0) {
            return (
                months = 0 + " months"
            )
        } else {
            return (
                months = difference % 12 + " months"
            )
        }
        return months;
    }




    const drawer = (
        <div>

            {/* <Toolbar /> */}
            <List>
                <img src="logo.png" style={{ padding: 10 }}></img>
                <Divider className='nav_divider' />
                <div className='avatar'>
                    <Avatar className='avatar_img' alt={profileval.name} src={profileval.image} />

                </div>
                <div className='profile_name'>
                    <h5 className='mt-4 '>{profileval.name}</h5>
                    <h5 className='mt-1'>#{profileval.emp_id}</h5>
                </div>
                <div className='profile_details'>
                    <div className='row user_info'>
                        <p>Designation </p><p className="fade_info">{profileval.designation}</p>
                        <p>Email </p><p className="fade_info">{profileval.email}</p>
                        <p>Phone No </p><p className="fade_info">{profileval.phonenumber}</p>
                        <p>Tenure </p><p className="fade_info">{monthDiff(profileval.date_of_joining)}</p>
                        <p>Birthday </p><p className="fade_info">{moment(profileval.dob).format('DD-MMM-YYYY')}</p>


                    </div>
                </div>
                <div className='logout_button mt-4'>
                    <button className='btn btn-primary' onClick={logout}>Logout</button>

                </div>
            </List>
        </div >
    );
    const items: MenuProps['items'] = [
        {
            label: <h6 onClick={editShow}>Edit </h6>,
            key: '0',
        },
        {
            label: <h6 onClick={handleDelete}>Delete </h6>,
            key: '1',
        },
        {

        },

    ];




    return (
        <>
            <Box sx={{ display: 'flex' }} className="dashboard_page">
                {/* <CssBaseline /> */}
                <AppBar
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },

                    }}
                >
                    <Toolbar
                        className='main_header'
                    >
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
                            {/* Responsive drawer */}
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
                            <Avatar alt={profileval.name} src={profileval.image} />
                            <div className="employe_info">
                                <p>{profileval.username}</p>
                                <p>{profileval.name}</p>
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
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    <Drawer
                        container={container}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        className='left_nav'
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                        className='left_nav'

                    >
                        {drawer}
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{ p: 3, width: { sm: `calc(100% - ${drawerWidth * 2}px)` } }}
                >
                    <Toolbar />
                    <div className='row announcement_main'>
                        <div className='col-sm-10 announcement'>
                            <Typography>
                                Announcements
                            </Typography>
                        </div>
                        <div className='col-sm-2'>
                            <Typography>


                                <Modal
                                    open={openedit}
                                    title="Add Post"
                                    onOk={editHandleOk}
                                    onCancel={editHandleCancel}
                                    footer={[

                                        <Button key="submit" type="primary" onClick={editHandleOk}  >
                                            Submit
                                        </Button>,

                                    ]}
                                >
                                    <label> Edit Ttile</label>
                                    <input type="text" className="form-control" name="title"
                                    />
                                    <label> Edit Description</label>
                                    <textarea className="form-control" name="description"
                                    ></textarea>
                                    <label> Edit Image</label>
                                    <input type="file" name="image" className="form-control" />
                                </Modal>
                            </Typography>
                        </div>
                    </div>
                    {

                        allpost.map((element, index) => {
                            return (

                                <Card key={index} sx={{ maxWidth: 1100, marginTop: 10 }} className="post">
                                    <CardHeader
                                        avatar={
                                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                                R
                                            </Avatar>
                                        }
                                        action={
                                            <Dropdown menu={{ items }} trigger={['click']} onClick={(e) => { record(element.id) }}>
                                                <a onClick={(e) => e.preventDefault()}>

                                                    {/* <MoreVertIcon /> */}

                                                </a>
                                            </Dropdown>

                                        } className="post_style"
                                        title={element.x.title}
                                        subheader={moment(element.x.post_date).format('DD/MM/YYYY')}
                                    />

                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">
                                            {element.x.description}
                                        </Typography>
                                    </CardContent>
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">
                                            <img src={BASE_URL + "/" + element.x.image} />
                                        </Typography>
                                    </CardContent>
                                    <CardActions disableSpacing >
                                        <IconButton aria-label="add to favorites" >
                                            {element?.isLike ? (

                                                <FavoriteIcon key={index}

                                                    onClick={(e) => { post_id(e, element.x._id, element?.isLike) }} style={{
                                                        backgroundColor: isActive ? 'white' : '',
                                                        color: isActive ? 'red' : '',
                                                    }} />
                                            ) :
                                                (

                                                    <FavoriteIcon key={index} onClick={(e) => { post_id(e, element.x._id, element?.isLike) }} />
                                                )

                                            }


                                        </IconButton>
                                        <IconButton aria-label="share">




                                            <MapsUgcIcon onClick={(e) => { commentShowModal(element.x._id, index) }} />
                                            <Modal className="mt-4"
                                                open={openComment[index]}
                                                title="Add Comment"
                                                onOk={() => commentHandleOk(index)}
                                                onCancel={() => commentHandleOk(index)}
                                                footer={[

                                                    <Button key="submit" type="primary" onClick={() => commentHandleOk(index)}  >
                                                        Add Comment
                                                    </Button>,

                                                ]}
                                            >

                                                {
                                                    element.x.comment?.map((item, i) => {
                                                        return (
                                                            <>

                                                                <Card sx={{ minWidth: 200, marginTop: 4 }} className="card_events">
                                                                    <CardContent>


                                                                        <Typography sx={{ mb: 3, width: 200, height: 20 }} >
                                                                            <div className="row">
                                                                                <div className="col-4">
                                                                                    <Avatar className='avatar_img' alt="Remy Sharp" src={item.userId.image} />
                                                                                </div>
                                                                                <div className="col-8">
                                                                                    {item.userId.name}
                                                                                </div>
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="col-4">

                                                                                </div>
                                                                                <div className="col-8">
                                                                                    <h6>  {item.content}</h6>
                                                                                </div>

                                                                            </div>

                                                                        </Typography>
                                                                    </CardContent>
                                                                </Card>


                                                            </>
                                                        )
                                                    })
                                                }
                                                <br />
                                                <textarea className="form-control" name="content" value={addcomment} onChange={(e) => handleComment(e)}
                                                ></textarea>

                                            </Modal>

                                        </IconButton>

                                    </CardActions>

                                </Card>
                            )
                        })
                    }



                </Box>


                <Box
                    component="sidebar"
                    sx={{ width: { sm: drawerWidth } }}
                    className="sidebar">
                    {/* <h4>Events</h4>
                {
                    event.map((i) => {

                        return (

                            <Card sx={{ minWidth: 200, marginTop: 4 }} className="card_events">
                                <CardContent>


                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        <h5><b>{i.event_title} Event</b></h5>
                                        <h6>  {moment.utc(i.event_date).format("MMM DD, YYYY")}</h6>
                                        <Divider className='event_divider' />
                                    </Typography>

                                    <Typography sx={{ fontSize: 14, }} color="text.secondary" gutterBottom>
                                        {i.event_description}
                                    </Typography>
                                    <Typography className="mt-5">

                                    </Typography>
                                </CardContent>
                            </Card>
                        )
                    })
                } */}


                    <h6 className='mt-4'><b>Upcomming Birthday's</b></h6>

                    {
                        allemployee?.map((item, elem) => {
                            let newDate2 = moment.utc(item.dob).format("MMM DD, YYYY");
                            return (

                                <>

                                    <Card key={elem} sx={{ minWidth: 200, marginTop: 4 }} className="card_events">
                                        <CardContent>

                                            <div className='row'>
                                                <div className='col-sm-4 col-2'>
                                                    <Avatar className='avatar_img' alt={item.name} src={BASE_URL + "/" + item.image} />

                                                </div>
                                                <div className='col-sm-8 col-10'>
                                                    {item.name}
                                                    <div>
                                                        {newDate2}</div>
                                                </div>
                                            </div>


                                        </CardContent>
                                    </Card>
                                </>
                            )
                        })
                    }

                    <h6 className='mt-4'><b>Upcomming Work Anniversary's </b></h6>
                    {
                        anniversary?.map((i, elem) => {

                            return (

                                <>

                                    <Card key={elem} sx={{ minWidth: 200, marginTop: 4 }} className="card_events">
                                        <CardContent>

                                            <div className='row'>
                                                <div className='col-sm-4'>
                                                    <Avatar className='avatar_img' alt={i.name} src={BASE_URL + "/" + i.image} />
                                                </div>
                                                <div className='col-sm-8'>
                                                    {i.name}
                                                    <div className="difference pt-1">
                                                        {moment(i.date_of_joining).format("MMM DD, YYYY")}

                                                    </div>
                                                    <div className="difference pt-2">
                                                        <b>{i.difference} </b> Anniversary
                                                    </div>
                                                </div>
                                            </div>


                                        </CardContent>
                                    </Card>
                                </>
                            )
                        })
                    }



                </Box>

                {/* Sidebar end */}


            </Box >

        </>

    );
}

UserDashboard.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default UserDashboard;