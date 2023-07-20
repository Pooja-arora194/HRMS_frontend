import React, { useEffect, useState, useContext } from "react";
import Header from "../utils/header";
import { UserOutlined } from '@ant-design/icons';
import Avatar from '@mui/material/Avatar';
import { Dayjs } from 'dayjs';
import { Calendar, theme } from 'antd';
import { CalendarMode } from 'antd/es/calendar/generateCalendar'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from "axios";
import moment from "moment";
import { BASE_URL } from "../../baseUrl";
import { Navigate } from "react-router-dom";
import { LoaderContext } from '../../App.js'
import LayoutTemplate from "../../layout/Layout";

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

function Profile() {
    const { showLoader, hideLoader } = useContext(LoaderContext)
    const [profile, setProfile] = useState('');

    const [diff, setDiff] = useState();
    const { token } = theme.useToken();


    const onPanelChange = (value, mode) => {
    };

    const wrapperStyle = {
        // width: 300,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };



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
            Navigate('/')
        }
        else {

            axios.get(`${BASE_URL}/profile`, token)
                .then((res) => {
                    setProfile(res.data)


                })
                .catch((err) => {
                    console.log(err);
                }).finally(() => {

                    hideLoader()
                })
        }



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

    const monthDiff = (date_of_joining) => {

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



    return (

        <LayoutTemplate>
            <div className="container">

                <div className="row ">
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-4">
                                {/* <Avatar size={130} src={BASE_URL + "/" + profile.image} /> */}
                                <Avatar className='avatar_img' alt={profile.name} src={BASE_URL + "/" + profile.image}
                                    sx={{ width: 150, height: 150 }} />
                                <p className="pt-4"><b>{profile.name}</b></p>
                                <p> #{profile.emp_id}</p>
                                <a href="/setting">
                                    <button className="edit-profile-btn">Edit Profile   </button>
                                </a>

                            </div>

                            <div className="col-md-4 text-start">
                                <label><b>Position</b></label>
                                <p className="pt-3"> {profile.designation}</p>
                                <label><b>Email</b></label>
                                <p className="pt-3 EMAIL"> {profile.email}</p>
                                <label><b>Phone Number</b></label>
                                <p className="pt-3"> {profile.phonenumber}</p>

                            </div>
                            <div className="col-md-4 text-start">
                                <label><b>Tenure</b></label>
                                <p className="pt-3">    {monthDiff(profile.date_of_joining)}</p>
                                <label><b>Birthday</b></label>
                                <p className="pt-3"> {moment(profile.dob).format('DD-MMM-YYYY')}</p>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-4">
                        <div style={wrapperStyle} className="mt-4" >
                            <Calendar fullscreen={false} onPanelChange={onPanelChange} />
                        </div>
                        {
                            profile.role !== 1 ?
                                <div className="col-md-12">
                                    <label className="text-start mt-3"><b>Leave Quota</b></label>
                                    <div className="row mt-3 p-2">
                                        <div className="col-sm-6">
                                            Casual Leave
                                        </div>
                                        <div className="col-sm-6">
                                            {profile.leave?.casual_leave >= 0 ? profile.leave?.casual_leave : 0}
                                        </div>
                                    </div>
                                    <div className="row mt-3 p-2">
                                        <div className="col-sm-6">
                                            Sick Leave
                                        </div>
                                        <div className="col-sm-6">
                                            {profile.leave?.sick_leave >= 0 ? profile.leave?.sick_leave : 0}
                                            {/* {profile.leave?.sick_leave} */}
                                        </div>
                                    </div>
                                    <div className="row mt-3 p-2">
                                        <div className="col-sm-6">
                                            Paid Off
                                        </div>
                                        <div className="col-sm-6">
                                            {calculatePaidOff(profile.leave?.sick_leave, profile.leave?.casual_leave)}
                                        </div>
                                    </div>
                                </div>
                                : <>
                                </>
                        }
                    </div>
                </div>
            </div>
        </LayoutTemplate>
    )


}
export default Profile;