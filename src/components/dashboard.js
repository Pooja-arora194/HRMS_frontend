import React, { useEffect, useState, useContext } from "react";
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
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
import { BASE_URL } from "../baseUrl";
import { Dropdown, Space } from 'antd';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Badge from '@mui/material/Badge';
import { Notification, diffBetweenTwoDates } from "../helpers/constant";
import { LoaderContext } from '../App.js'
import LayoutTemplate from "../layout/Layout";
import { DataContext } from "../context/DataContext";
import io from 'socket.io-client';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

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


function Dashboard(props) {
    const { user } = useContext(DataContext)
    const { showLoader, hideLoader } = useContext(LoaderContext)
    const navigate = useNavigate();
    const { window } = props;

    const hiddenFileInput = React.useRef(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);



    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const bull = (
        <Box
            component="span"
            sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
        >
            •
        </Box>
    );
    const container = window !== undefined ? () => window().document.body : undefined;
    const [reloadApi, setReloadApi] = useState(false)
    const [profileval, setProfileVal] = React.useState('');
    const [login, setLogin] = React.useState('');
    const [isActive, setIsActive] = useState([]);
    const [postpageid, setPostPageId] = useState('')
    const [editcontent, setEditContent] = useState('')
    const [openname, setOpenname] = useState(false);
    const [openedit, setOpenEdit] = useState(false);
    const [addpost, setAddPost] = useState('')
    const [addtitle, setAddTitle] = useState('')
    const [id, setId] = useState('')
    const [imageval, setImageVal] = useState('')
    const [allemployee, setAllEmployee] = useState([]);
    const [allpost, setAllPost] = useState([]);
    const [likeval, setLikeVal] = useState([]);
    const [edittitle, setEditTitle] = useState('');
    const [editdescription, setEditDescription] = useState('');
    const [updateimage, setUpdateImage] = useState('')
    const [updateId, setUpdateId] = useState('');
    const [openComment, setOpenComment] = useState([]);
    const [addcomment, setAddComment] = useState('')
    const [postid, setPostId] = useState('');
    const [editcomment, setEditComment] = useState(false);
    const [commentid, setCommentId] = useState('')
    const [anniversary, setAnniversary] = useState([])
    const [isModalOpenLike, setIsModalOpenLike] = useState(false);
    const [likeName, setLikeName] = useState([]);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const [isImportant, setIsImportant] = useState(false);


    const handleImportantChange = (event) => {
        setIsImportant(event.target.checked);
    };
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        setImageVal(fileUploaded)
    };


    const handlePost = async (e) => {
        setAddPost(e.target.value)
    }

    const handleTitlePost = async (e) => {
        setAddTitle(e.target.value)
    }

    const nameHandleCancel = () => {
        setOpenname(false);
    };


    const handleComment = async (e) => {
        setAddComment(e.target.value)
    }
    const editHandleCancel = () => {
        setOpenEdit(false);
    };


    const nameShowModal = () => {
        setOpenname(true);
    };


    const editShow = () => {
        setOpenEdit(true);
    };


    const handlesubmit = async (e) => {
        e.preventDefault();
    };

    const handleTitle = async (e) => {
        setEditTitle(e.target.value)
    }

    const handleDescription = async (e) => {
        setEditDescription(e.target.value)

    }
    const handleLikeOk = () => {
        setIsModalOpenLike(false);
    };

    const handleLikeCancel = () => {
        setIsModalOpenLike(false);
    };
    const showLikeModal = (e, element) => {
        setIsModalOpenLike(true);
        e.preventDefault();
        setLikeName(element)
    };



    const nameHandleOk = () => {
        if (!addpost) {
            toast.error('Please Input Post');
            return;
        }

        const formData = new FormData();
        formData.append("image", imageval);
        formData.append("description", addpost);
        formData.append("mark_as_important", isImportant);

        let authtokens = localStorage.getItem("authtoken");
        let headers = {
            token: authtokens,
        };

        axios
            .post(`${BASE_URL}/add_post`, formData, { headers })
            .then((res) => {
                setAddPost(res.data);
                let tmp = [...allpost];
                tmp.unshift({
                    x: {
                        title: res.data.data?.title,
                        description: res.data.data?.description,
                        image: res.data.data?.image,

                    },
                });
                setAllPost([...tmp]);
                setAddTitle("");
                setAddPost("");
                setImageVal("");
                setIsImportant(false)
            })
            .catch((err) => {
                console.log(err);
            });

        setAddPost("");
        setAddTitle("");
        setImageVal("");
        setOpenname(false);
    };


    const record = (value) => {
        setId(value.id)
        setUpdateId(value.id)
        setEditTitle(value.title)
        setEditDescription(value.description)
    }

    const editHandleOk = () => {


        const formData = new FormData();

        formData.append("image", updateimage);
        formData.append("description", editdescription);
        let authtokens = localStorage.getItem("authtoken");
        let headers = {
            token: authtokens,
            "Content-Type": "application/json",
        }

        axios.put(`${BASE_URL}/edit_post/${updateId}`, formData)
            .then((res) => {
                setEditTitle(res.data.title)
                setEditDescription(res.data.description)
                setReloadApi(!reloadApi)
            })
            .catch((err) => {
                console.log(err);
            });
        setEditTitle("")
        setEditDescription("")
        setOpenEdit(false);


    }

    const handleDelete = () => {
        const config = {
            header: {
                "Content-Type": "application/json",
            },
        };
        axios.delete(`${BASE_URL}/delete_post/${id}`, config)
            .then((res) => {
                const filter_data = allpost.filter((val) => val.x._id != id)
                setAllPost(filter_data)
                setReloadApi(!reloadApi)
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

        axios.get(`${BASE_URL}/all_post`, token)
            .then((res) => {
                setAllPost(res.data)
                console.log(res.data, "abcccccccccccccccccccc")
            })
            .catch((err) => {
                console.log(err);
            }).finally(() => {

                hideLoader()
            })

    }, [reloadApi])


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
                setReloadApi(!reloadApi)
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
            }).finally(() => {
                // hideLoader()
            })


    }



    const commentShowModal = (item, index) => {
        openComment[index] = true
        setOpenComment([...openComment])
        setPostId(item);

    };
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
                    setReloadApi(!reloadApi)
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        setAddComment('');
        openComment[index] = false
        setOpenComment([...openComment])
    }



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

    const showEditComment = (e, id, element) => {
        e.preventDefault();
        setCommentId(id)
        setPostPageId(element)
        setEditComment(true);
    };


    const editCommentOk = () => {

        const content = editcontent

        axios.put(`${BASE_URL}/edit_comment/`, { _id: commentid, post_id: postpageid, content: editcontent })
            .then((res) => {

            })
            .catch((err) => {
                console.log(err);
            });
        setEditComment(false);
        setReloadApi(!reloadApi)
    };

    const editCommentCancel = () => {
        setEditComment(false);
    };

    const commentCancelModal = (e, index) => {
        e.preventDefault()
        openComment[index] = false
        setOpenComment([...openComment])
    };
    const delete_comment = (e, id, element, commentIndex, postIndex) => {
        e.preventDefault();

        axios.post(`${BASE_URL}/delete_comment`, { _id: id, post_id: element })
            .then((res) => {
                toast.success("Deleted SuccessFully")
                let tmp = [...allpost]
                tmp[postIndex].x.comment.splice(commentIndex, 1)
                setAllPost([...tmp])
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const strAscending = [...anniversary].sort((a, b) =>
        moment(a.date_of_joining).format('DD/MM/YYYY') > moment(b.date_of_joining).format('DD/MM/YYYY') ? 1 : -1,

    );


    return (

        <LayoutTemplate >
            <ToastContainer></ToastContainer>
            <div className="container">
                <div className="row justify-content-around">
                    <div className="col-md-8">
                        {
                            user.role == 2 ?
                                <>
                                    <div className='col-7 col-sm-8 announcement'>
                                        <h5 className="page-heading">
                                            Create New Post
                                        </h5>
                                        <GoogleOAuthProvider clientId="916257071768-4vlndksvcv97c5ecmn2mqtd6a899n6ul.apps.googleusercontent.com">
                                            <GoogleLogin
                                                onSuccess={credentialResponse => {
                                                    console.log(credentialResponse);
                                                }}
                                                onError={() => {
                                                    console.log('Login Failed');
                                                }}
                                            />
                                        </GoogleOAuthProvider>
                                    </div>
                                    <Card key={1} sx={{ maxWidth: 1100, boxShadow: "none", borderRadius: 0 }} className="post">


                                        <CardContent>
                                            <textarea placeholder="Type Something Here" style={{ width: "100%", border: "none", padding: 10, outline: "none" }} rows="4" value={addpost} name="description" onChange={(e) => setAddPost(e.target.value)} />
                                        </CardContent>
                                        <CardContent>
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="row">
                                                        {/* <div className="col-6">
                                                            <img src="./attach-image.svg" style={{ paddingRight: 5 }} /> Attach Document
                                                        </div> */}
                                                        <div className="col-6" onClick={handleClick}>
                                                            <img src="./attach-image1.svg" style={{ paddingRight: 5 }} />Attach Image
                                                            <input
                                                                type="file"
                                                                ref={hiddenFileInput}
                                                                onChange={handleChange}
                                                                style={{ display: 'none' }} />
                                                            {imageval?.name && <span className="image-name">{imageval?.name}</span>}
                                                        </div>

                                                    </div>
                                                    <div>
                                                        <Checkbox {...label}
                                                            checked={isImportant}
                                                            onChange={handleImportantChange}

                                                        />
                                                        Mark As Important
                                                    </div>


                                                </div>
                                                <div className="col-6">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <button className="newpost_btn" onClick={nameHandleOk}>Post</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </>
                                :
                                ''
                        }
                        <div className='row announcement_main'>
                            <div className='col-7 col-sm-8 announcement'>
                                <h5 className="page-heading">
                                    Announcements
                                </h5>
                            </div>
                            <div className='col-4'>
                                <Typography>
                                    {/* {user?.role == 2 && <button className='newpost_btn' onClick={nameShowModal}>New Post</button>} */}
                                    <Modal
                                        open={openname}
                                        title="Add Post"
                                        onOk={nameHandleOk}
                                        onCancel={nameHandleCancel}
                                        footer={[

                                            <Button key="submit" type="primary" onClick={nameHandleOk}  >
                                                Submit
                                            </Button>,

                                        ]}
                                    >
                                        <label> Add Ttile</label>
                                        <input type="text" className="form-control" name="title" value={addtitle} onChange={(e) => handleTitlePost(e)}
                                        />
                                        <label> Add Description</label>
                                        <textarea className="form-control" value={addpost} name="description" onChange={(e) => handlePost(e)}
                                        ></textarea>
                                        <label> Add Image</label>
                                        <input type="file" name="image" className="form-control" onChange={(e) =>
                                            setImageVal(e.target.files[0])} />
                                    </Modal>


                                    <Modal
                                        open={openedit}
                                        title="Edit Post"
                                        onOk={editHandleOk}
                                        onCancel={editHandleCancel}

                                        footer={[

                                            <Button key="submit" type="primary" onClick={editHandleOk} >
                                                Submit
                                            </Button>,

                                        ]}
                                    >

                                        <label> Edit Post</label>
                                        <textarea className="form-control" name="description" value={editdescription}
                                            onChange={(e) => handleDescription(e)}
                                        ></textarea>
                                        <label> Edit Image</label>
                                        <input type="file" name="image" className="form-control" onChange={(e) =>
                                            setUpdateImage(e.target.files[0])} />
                                    </Modal>
                                </Typography>
                            </div>
                        </div>
                        {
                            allpost.map((element, index) => {
                                return (

                                    <Card key={index} sx={{ maxWidth: 1100, boxShadow: "none", borderRadius: 0 }} className="post mb-4">

                                        <CardHeader
                                            avatar={
                                                <Avatar className='avatar_img' sx={{ bgcolor: red[500] }} aria-label="recipe" alt={element.x?.posted_by?.name.toUpperCase()} src={BASE_URL + "/" + element.x?.posted_by?.image} >
                                                </Avatar>
                                            }
                                            action={
                                                <Dropdown menu={{ items }} trigger={['click']} onClick={(e) => { record(element.x) }}>
                                                    <a onClick={(e) => e.preventDefault()}>
                                                        {user?.role == 2 && <MoreVertIcon />}
                                                    </a>
                                                </Dropdown>

                                            } className="post_style"
                                            title={element.x?.posted_by?.name}
                                            subheader={moment(element.x.post_date).format("MMM DD, yyyy hh:mm a")}
                                        />

                                        <CardContent className="textarea_post">
                                            <Typography variant="body2" >
                                                {element.x.description}
                                            </Typography>
                                        </CardContent>
                                        <CardContent >
                                            {element.x.image ?

                                                <Typography variant="body2" color="text.secondary">
                                                    <img src={BASE_URL + "/" + element.x.image} width="100%" height="100%" alt="Image" />
                                                </Typography>
                                                :
                                                ''
                                            }
                                        </CardContent>
                                        <CardActions disableSpacing >
                                            <IconButton aria-label="add to favorites" >

                                                {!element?.isLike ? (
                                                    <>
                                                        <img src="./like-icon.svg"
                                                            onClick={(e) => { post_id(e, element.x._id, element?.isLike) }} style={{
                                                                backgroundColor: isActive ? 'white' : '',
                                                                color: isActive ? 'red' : '',
                                                            }} />

                                                    </>
                                                ) :
                                                    (

                                                        <FavoriteIcon key={index} onClick={(e) => { post_id(e, element.x._id, element?.isLike) }}
                                                            style={{
                                                                backgroundColor: isActive ? 'white' : '',
                                                                color: isActive ? 'red' : '',
                                                            }} />
                                                    )

                                                }

                                            </IconButton>
                                            {/* <span className="post-count">{element.x?.like?.length}</span> */}
                                            <span className="post-count" onClick={(e) => { showLikeModal(e, element.x?.like) }}>{element.x?.like?.length}</span>
                                            <Modal title="All Likes" open={isModalOpenLike} onCancel={handleLikeCancel}
                                                footer={[
                                                ]}>
                                                {
                                                    likeName.map((val, i) => {
                                                        return (
                                                            <>
                                                                <Card sx={{ minWidth: 100, marginTop: 2, padding: 0 }} className="card_events">
                                                                    <CardContent sx={{ paddingBottom: 0 }}>
                                                                        {/* <Typography sx={{ mb: 10, width: 200, height: 10 }} > */}
                                                                        <div className="row">
                                                                            <div className="col-2">
                                                                                <Avatar className='avatar_img' alt={val.name} src={BASE_URL + "/" + val.image} />
                                                                            </div>
                                                                            <div className="col-10">
                                                                                <div><h6> {val.name}</h6></div>

                                                                            </div>
                                                                        </div>


                                                                    </CardContent>
                                                                </Card>
                                                            </>
                                                        )
                                                    })}

                                                {likeName?.length < 1 ?
                                                    <>
                                                        <div className="noDataFound">No likes Found</div>
                                                    </>
                                                    : ''}

                                            </Modal>
                                            <IconButton aria-label="share">
                                                {/* <MapsUgcIcon onClick={(e) => { commentShowModal(element.x._id, index) }} /> */}
                                                <img src="./comment.svg" onClick={(e) => { commentShowModal(element.x._id, index) }} />


                                            </IconButton>
                                            <Modal className="mt-4"
                                                open={openComment[index]}
                                                title="Add Comment"
                                                onOk={() => commentHandleOk(index)}
                                                onCancel={(e) => commentCancelModal(e, index)}
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

                                                                <Card sx={{ minWidth: 200, marginTop: 4, padding: 0 }} className="card_events">
                                                                    <CardContent sx={{ paddingBottom: 0 }}>
                                                                        {/* <Typography sx={{ mb: 10, width: 200, height: 10 }} > */}
                                                                        <div className="row">
                                                                            <div className="col-2">

                                                                                <Avatar className='avatar_img' alt={item.userId?.name.toUpperCase()} src={BASE_URL + "/" + item.userId?.image} />

                                                                            </div>
                                                                            <div className="col-9">
                                                                                <div><h6> {item.userId?.name}</h6></div>
                                                                                <div>  {item.content}</div>
                                                                                <Modal
                                                                                    open={editcomment}
                                                                                    title="Edit Comment"
                                                                                    onOk={editCommentOk}
                                                                                    onCancel={editCommentCancel}
                                                                                    footer={[

                                                                                        <Button key="submit" type="primary" onClick={editCommentOk}>
                                                                                            Edit
                                                                                        </Button>,

                                                                                    ]}
                                                                                >
                                                                                    <label>Edit Comment</label>
                                                                                    <textarea name="content" className="form-control edit_comment" onChange={(e) => { setEditContent(e.target.value) }}></textarea>
                                                                                </Modal>
                                                                                {user._id == item.userId?.id
                                                                                    ? <div className="edit-post-icon">
                                                                                        <ModeEditIcon className="edit_comment"
                                                                                            onClick={(e) => { showEditComment(e, item._id, element.x._id) }}></ModeEditIcon>
                                                                                        <DeleteIcon className="delete_comment" onClick={(e) => { delete_comment(e, item._id, element.x._id, i, index) }}> </DeleteIcon>
                                                                                    </div>
                                                                                    :
                                                                                    <>

                                                                                    </>
                                                                                }
                                                                            </div>
                                                                        </div>

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
                                            <span className="post-count">{element.x?.comment?.length}</span>


                                        </CardActions>

                                    </Card>
                                )
                            })
                        }
                    </div>
                    <div className="col-md-3">
                        <h5 className='page-heading'>Upcoming Birthday's</h5>
                        {
                            allemployee?.length > 0 ? (

                                allemployee?.map((item, elem) => {
                                    let newDate2 = moment.utc(item.dob).format(" DD MMM");
                                    return (

                                        <>

                                            <Card key={elem} sx={{ minWidth: 200, borderRadius: 0, boxShadow: "none" }} className="card_events">
                                                <CardContent >

                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <Avatar className='avatar_img' alt={item.name.toUpperCase()} src={BASE_URL + "/" + item.image} />

                                                        </div>
                                                        <div className='col-8'>
                                                            <p className="birthday-card-name-heading"> {item.name}</p>
                                                            <div>
                                                                <p className="birthday-card-birthdate"> {newDate2}</p>
                                                            </div>
                                                        </div>
                                                    </div>


                                                </CardContent>
                                                <div className="line_"><hr /></div>

                                            </Card>
                                        </>
                                    )
                                })) :
                                (
                                    <>
                                        <Card sx={{ minWidth: 200, borderRadius: 0, boxShadow: "none" }} className="card_events">
                                            <CardContent sx={{ textAlign: "center" }} >
                                                No Record Found
                                            </CardContent>
                                        </Card>
                                    </>
                                )
                        }
                        <h4 className='page-heading'>Upcoming Work Anniversary's</h4>
                        {
                            strAscending?.length > 0 ? (

                                strAscending?.map((i, elem) => {

                                    return (

                                        <>
                                            <Card key={elem} sx={{ minWidth: 200, borderRadius: 0, boxShadow: "none" }} className="card_events">
                                                <CardContent>

                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <Avatar className='avatar_img' alt={i.name.toUpperCase()} src={BASE_URL + "/" + i.image} />
                                                        </div>
                                                        <div className='col-8'>
                                                            <p className="birthday-card-name-heading"> {i.name}</p>
                                                            <div className="difference">
                                                                <p className="birthday-card-birthdate"> {moment(i.date_of_joining).format("MMM DD, YYYY")}</p>
                                                            </div>
                                                            <div className="difference">
                                                                <p className="birthday-card-birthdate">{i.difference} Work Anniversary </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="line_"><hr /></div>
                                                </CardContent>
                                            </Card>
                                        </>
                                    )
                                }))
                                : (
                                    <>
                                        <Card sx={{ minWidth: 200, borderRadius: 0, boxShadow: "none" }} className="card_events">
                                            <CardContent sx={{ textAlign: "center" }} >
                                                No Record Found
                                            </CardContent>
                                        </Card>
                                    </>
                                )
                        }
                    </div>
                </div>
            </div>
        </LayoutTemplate>
    );
}



export default Dashboard;