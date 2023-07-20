import { BASE_URL } from '../baseUrl'
import axios from 'axios'
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Button, Modal, Table } from 'antd';
import { Tabs } from 'antd';
import moment from 'moment';
import { DataContext } from '../context/DataContext';
// import { DataContext } from "../context/DataContext";
const { TabPane } = Tabs;

const CheckStatus = () => {

    const { fetchUser, setUser, user, fetchAllNotification, notifications, setNotifications, checkIn, checkOut } = useContext(DataContext)

    function callback(key) {
        if (key === "1") {
            const filterData = allUsers.filter((x) => x.userId.emp_id !== user.emp_id)
            if (filterData.length) {
                setCurrentStatus(filterData)
            }
        } else {
            const filterData = allUsers.filter((x) => x.userId.emp_id === user.emp_id)
            if (filterData.length) {
                setCurrentStatus(filterData)
            }
        }

    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    // const [role, setRole] = useState(false)
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {

        // alert("sdfd")
        let authtokens = localStorage.getItem("authtoken");
        let token = {
            headers: {
                token: authtokens
            },
        };


        axios.get(`${BASE_URL}/getstatus`, token)
            .then((res) => {
                setAllUsers(res.data)
                const filterData = res.data.filter((x) => x.userId.emp_id !== user.emp_id)
                if (filterData.length && user.role !== 0) {
                    setCurrentStatus(filterData)
                } else {
                    setCurrentStatus(res.data)
                }

            })
            .catch((err) => {
                console.log(err);
            });
    }, [])


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <>
                    {record.userId.name}
                </>
            )
        },
        {
            title: 'Date',
            dataIndex: 'age',
            key: 'age',
            render: (_, record) => (
                <>
                    {moment(record.checkIn).format('MMM DD')}
                </>
            )
        },

        {
            title: 'Check In',
            dataIndex: 'address',
            key: 'address',
            render: (_, record) => (
                <>
                    {moment(record.checkIn).format('MMM DD, yyyy hh:mm a')}
                </>
            )
        },
        {
            title: 'Check Out',
            dataIndex: 'address',
            key: 'address',
            render: (_, record) => (
                <>
                    {moment(record.checkOut).format('MMM DD, yyyy hh:mm a')}
                </>
            )
        },


    ];

    return (
        <>
            <Button className='status_btn' type="primary" onClick={showModal}>
                Check Status
            </Button>
            <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>

                <Tabs defaultActiveKey="1" onChange={callback}>
                    {user.role != 0 && (
                        <TabPane tab="Employee Status" key="1">
                            <Table columns={columns} dataSource={currentStatus} />
                        </TabPane>
                    )}
                    <TabPane tab="My Status" key="2" >
                        <Table columns={columns} dataSource={currentStatus} />
                    </TabPane>
                </Tabs>
            </Modal>
        </>

    )
}
export default CheckStatus;

