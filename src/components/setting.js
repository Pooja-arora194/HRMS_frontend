import React, { useEffect, useState, useContext } from "react";
import Avatar from '@mui/material/Avatar';
import { Button, Modal } from 'antd';
import axios from "axios";
import Header from "../pages/utils/header";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import moment from "moment";
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import { BASE_URL } from "../baseUrl";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoaderContext } from "../App";
import LayoutTemplate from "../layout/Layout";
import { DataContext } from "../context/DataContext";
import { EyeOutlined, EyeInvisibleOutlined, DeleteOutlined } from '@ant-design/icons';

const Setting = () => {
  const { fetchUser } = useContext(DataContext)
  const { showLoader, hideLoader } = useContext(LoaderContext)


  const navigate = useNavigate();
  const [isModified, setIsModified] = useState(false);
  const [open, setOpen] = useState(false);
  const [fillname, setName] = useState('')
  const [fillemail, setEmail] = useState('')
  const [fillpassword, setPassword] = useState('')
  const [fillphone, setPhone] = useState('')
  const [filldob, setDob] = useState(new Date())
  const [imageval, setImageVal] = useState('')
  const [image, setImage] = useState('')
  const [changePassword, setChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordType, setPasswordType] = useState("password");
  const [isInputDisabled, setInputDisabled] = useState(true);
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text")
      return;
    }
    setPasswordType("password")
  }


  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));

  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  }));


  const handlesubmit = async (e) => {
    e.preventDefault();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
  };


  const handleName = async (e) => {
    setName(e.target.value)
  }

  // const handleEmail = async (e) => {
  //   setEmail(e.target.value)

  // }

  const handlePassword = async (e) => {

    setPassword(e.target.value)

  }

  const handlePhone = async (e) => {
    const limit = 10;
    setPhone(e.target.value.slice(0, limit))
    // setPhone(e.target.value)
    setIsModified(true);
  }

  const handleDob = async (e) => {
    setIsModified(true);
    setDob(e.target.value)

  }

  const handleOk = () => {

    const image = imageval;


    const formData = new FormData();

    formData.append("image", imageval);

    let authtokens = localStorage.getItem('authtoken');

    let axoisimage = {
      headers: {
        'token': authtokens,

      }
    };

    axios.post(`${BASE_URL}/imageupload`, formData, axoisimage)
      .then((res) => {
        window.location.reload()

      })

      .catch((err) => {
        console.log(err);
      });
    setOpen(false);


  }
  const handleDeleteImage = () => {
    let authtokens = localStorage.getItem('authtoken');
    let axoisimage = {
      headers: {
        'token': authtokens,

      }
    };
    axios.delete(`${BASE_URL}/delete_image`, axoisimage)

      .then((res) => {
        toast.success(res.data.message);
        window.location.reload()
        setImage('');
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  const changePasswordCancel = () => {
    setChangePassword(false);
  };

  const changePasswordShow = () => {
    setChangePassword(true);
  };


  const changePasswordOk = () => {

    let authtokens = localStorage.getItem("authtoken");
    let axiostoken = {
      headers: {
        token: authtokens,
      },
    };

    const old_password = oldPassword;
    const new_password = newPassword;
    const confirm_password = confirmPassword;

    if (!old_password || !new_password || !confirm_password) {
      toast.error("All fields are required")
      return
    }


    axios.post(`${BASE_URL}/change_password`, {
      old_password: oldPassword, new_password: newPassword,

      confirm_password: confirmPassword
    }, axiostoken)
      .then((res) => {
        toast.success(res.data.message)
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setChangePassword(false);


      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message)

      });
  }


  const update_records = async (req, res) => {
    showLoader()

    let authtokens = localStorage.getItem('authtoken');

    let token = {
      headers: {
        'token': authtokens,

      }
    };

    const name = fillname;
    const email = fillemail;
    const password = fillpassword;
    const phonenumber = fillphone;
    const dob = filldob;

    axios.put(`${BASE_URL}/edit_profile`, { name: fillname, email: fillemail, phonenumber: fillphone, password: fillpassword, dob: filldob }, token)

      .then((res) => {

        setName(res.data.name)
        setEmail(res.data.email)
        setDob(res.data.dob)
        setPhone(res.data.phonenumber)
        fetchUser()
        navigate('/profile')
      })
      .catch((err) => {
        console.log(err);
      }).finally(() => {
        hideLoader()
      })

  }



  useEffect(() => {

    let authtokens = localStorage.getItem("authtoken");
    let token = {
      headers: {
        token: authtokens,
      },
    };

    if (!authtokens) {
      navigate('/login')
    }
    else {

      axios.get(`${BASE_URL}/profile`, token)
        .then((res) => {

          setName(res.data.name)
          setEmail(res.data.email)

          setPhone(res.data.phonenumber)
          setDob(res.data.dob)
          setImage(BASE_URL + "/" + res.data.image)
        })
        .catch((err) => {
          console.log(err);
        });
    }


  }, [])


  return (
    <LayoutTemplate>
      <ToastContainer></ToastContainer>

      <div className="container">

        <h2 class="add-user-heading">Profile > Edit Profile</h2>
        <form onSubmit={handlesubmit} className="">
          <div className="row mt-4 justify-content-between  edit_page">
            <div className="col-md-2">
              <Stack direction="row" spacing={2}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <SmallAvatar className="small_avatar" >
                      <EditIcon className="edit_icon" onClick={showModal} />
                    </SmallAvatar>
                  }
                >
                  <Avatar alt={fillname} src={image} className="edit_profile avatar_img" sx={{ width: 150, height: 150 }} />
                </Badge>

              </Stack>
              <Modal
                open={open}
                title="Image"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                  <>
                    <div className="d-flex justify-content-between">
                      <div onClick={handleDeleteImage} className="btn text-danger btn-sm d-flex justify-center align-items-center gap-2">  <DeleteOutlined /> Delete Current Picture</div>

                      <Button key="submit" type="primary" onClick={handleOk}>
                        Submit
                      </Button>
                    </div>
                  </>
                ]}
              >
                <input type="file" name="image" onChange={(e) =>
                  setImageVal(e.target.files[0])} />

              </Modal>
            </div>
            <div className="col-md-4">
              <label className="addUserLabel">Name</label>
              <input type="text" name="name" onChange={(e) => handleName(e)} value={fillname} disabled={isInputDisabled} className="add_userInput" placeholder="Enter Name" />

            </div>
            <div className="col-md-4">
              <label className="addUserLabel">Phone Number</label>
              <input type="text" name="phonenumber" onChange={(e) => handlePhone(e)} value={fillphone} className="add_userInput" placeholder="Enter Phone Number" />


            </div>
          </div>
          <div className="row justify-content-between  edit_page">
            <div className="col-2">

            </div>
            <div className="col-md-4">
              <label className="addUserLabel">Email Id</label>
              <input type="email" name="email" value={fillemail} disabled={isInputDisabled} className="add_userInput" placeholder="Enter Email Id" />


            </div>
            <div className="col-md-4">
              <label className="addUserLabel">Date Of Birth</label>
              <input type="date" name="dob" maxlength="4"
                pattern="[1-9][0-9]{3}"
                max="9999-12-30" value={moment(filldob).format('YYYY-MM-DD')} onChange={(e) => handleDob(e)} className="add_userInput" placeholder="Enter Date of Birth" />

            </div>
          </div>
          <div className="row mt-3 justify-content-between  edit_page">
            <div className="col-md-2">

            </div>
            <div className="col-md-4 password-type mt-4">
              <label className="addUserLabel">Password</label>
              <Button key="submit" className="form-control" onClick={changePasswordShow}>
                Change Password
              </Button>
              <Modal
                open={changePassword}
                title="Change Password"
                onOk={changePasswordOk}
                onCancel={changePasswordCancel}
                footer={[

                  <Button key="submit" type="primary" onClick={changePasswordOk}>
                    Submit
                  </Button>,

                ]}
              >
                <label>Old Password</label>
                <input type="password" name="old_password" onChange={(e) => { setOldPassword(e.target.value) }} className="form-control" placeholder="Enter Your Current Password" />
                <label>New Password</label>
                <input type="password" name="new_password" onChange={(e) => { setNewPassword(e.target.value) }} className="form-control" placeholder="Enter New Password" />
                <label>Confirm Password</label>
                <div className="password_eye1">
                  <input type={passwordType} name="confirm_password" onChange={(e) => { setConfirmPassword(e.target.value) }} className="form-control" placeholder="Confirm Password" />
                  <div className="input-group-btn eye_btn1">
                    <button className="btn" onClick={togglePassword}>
                      {passwordType === "password" ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                    </button>
                  </div>
                </div>

              </Modal>
            </div>

            <div className="col-4">

            </div>
          </div>
          <div className="row justify-content-between   edit_page">
            <div className="col-md-2">

            </div>
            <div className="col-md-4">
              <div className="submit_btn_val mt-4">
                <input type="submit" value="update" disabled={!isModified} className="update-setting-btn" onClick={update_records} />
              </div>

            </div>
            <div className="col-4">

            </div>
          </div>
        </form >

      </div >
    </LayoutTemplate >
  )
}

export default Setting;