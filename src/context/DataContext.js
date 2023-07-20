import React, { createContext, useState, useEffect } from 'react'
import { BASE_URL } from '../baseUrl'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';


export const DataContext = createContext(null)

export default function DataContextProvider({ children }) {
    const [user, setuser] = useState({})
    const [token, setToken] = useState('')
    const [notifications, setNotifications] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        let token = localStorage.getItem('authtoken')
        if (token) {
            setToken(token)
        }
        setIsLoading(false)
        console.log("datacontext")
    }, [])

    async function fetchUser() {
        return new Promise((resolve, reject) => {
            let authtokens = localStorage.getItem("authtoken")
            // let token = {
            //     headers: {
            //         token: authtokens,
            //         "Content-Type": "application/json",
            //     },
            // };
            var config = {
                method: 'get',
                url: BASE_URL + `/getUserdata`,
                headers: {
                    'token': authtokens
                }
            };
            axios(config)
                .then((res) => {
                    setuser(res.data)
                    resolve(res.data)

                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                });
        })

    }

    async function fetchAllNotification() {
        return new Promise((resolve, reject) => {
            let authtokens = localStorage.getItem("authtoken");
            let display = {
                headers: {
                    'token': authtokens,
                }
            }
            axios.get(`${BASE_URL}/get_all_notification`, display)
                .then((res) => {
                    // const unreadNotifications = res.data.filter(notification => !notification.is_read);
                    // console.log(unreadNotifications, "UnreadNotifications");

                    // setNotifications(unreadNotifications);
                    // resolve(unreadNotifications);
                    console.log(res.data, "All")
                    setNotifications(res.data)
                    resolve(res.data)
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)

                });
        })
    }

    const checkIn = async () => {
        let authtokens = localStorage.getItem("authtoken");

        var config = {
            method: 'post',
            url: BASE_URL + '/checkin',
            headers: {
                'token': authtokens
            },
        };

        return axios(config)

    }
    const checkOut = async () => {
        let authtokens = localStorage.getItem("authtoken");

        var config = {
            method: 'post',
            url: BASE_URL + '/checkout',
            headers: {
                'token': authtokens
            },
        };

        return axios(config)
    }


    return (
        <DataContext.Provider value={{
            user, setuser, notifications, setNotifications, token, setToken, fetchUser, fetchAllNotification, checkIn, checkOut
        }}>
            {!isLoading && children}
        </DataContext.Provider>

    )
}
