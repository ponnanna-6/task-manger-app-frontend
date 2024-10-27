import styles from './settings.module.css'
import { useEffect, useState } from 'react'
import Form from '../form/form'
import { useNavigate } from 'react-router-dom'
import { getUserInfo, updateUserInfo } from '../../services/auth'
import { logOutUser, validateEmail } from '../../helper/utils'
import { alertToast, errorToast } from '../../helper/toast'

export default function Settings({}) {
    const navigate = useNavigate()

    useEffect(() => {
        const getData = async() => {
            await getUserInfo().then((res) => {
                if(res.status == "200") {
                    setFormData({...formData, name: res.data?.name, email: res.data?.email})
                }
            })
            .catch(error => navigate('/login'))
        }
        getData()
    }, [])
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [error, setError] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false
    })

    const formFields = [
        {
            name: "name",
            placeholder: "Name",
            type: "text",
            value: formData?.name,
            onChange: (e) => {
                setFormData({...formData, name: e.target.value})
                setError({...error, name: false})
            },
        },
        {
            name: "email",
            placeholder: "Update Email",
            type: "email",
            value: formData?.email,
            onChange: (e) => {
                setFormData({...formData, email: e.target.value})
                setError({...error, email: false})
            },
        },
        {
            name: "password",
            placeholder: "Old Password",
            type: "password",
            value: formData?.password,
            showPassword: false,
            onChange: (e) => {
                setFormData({...formData, password: e.target.value})
                setError({...error, password: false})
            },
        },
        {
            name: "confirmPassword",
            placeholder: "New Password",
            type: "password",
            value: formData?.confirmPassword,
            showPassword: false,
            onChange: (e) => {
                setFormData({...formData, confirmPassword: e.target.value})    
                setError({...error, confirmPassword: false})
            },
        }
    ]

    const errorMessages = {
        name: {
            message: "Enter your name",
            isValid: formData?.name.length > 0,
            onError: () => {
                setError((error)=>({...error, name: true}))
            }
        },
        email: {
            message: "Enter valid email address",
            isValid: validateEmail(formData?.email),
            onError: () => {
                setError((error)=>({...error, email: true}))
            }
        }, 
        password: {
            message: "Password should be min 8 characters",
            isValid: formData.password.length >= 8 || formData.password == "",
            onError: () => {
                setError((error)=>({...error, password: true}))
            }
        },
        confirmPassword: {
            message: "Password should be min 8 characters",
            isValid: formData.confirmPassword.length >= 8 || formData.confirmPassword == "",
            onError: () => {
                setError((error)=>({...error, confirmPassword: true}))
            }
        },
    }

    const onSubmit = async(e) => {
        e.preventDefault()
        let isError = false
        Object.keys(errorMessages).map((key) => {
            if(!errorMessages[key].isValid) {
                isError = true
                errorMessages[key].onError()
            }
        })
        if(!isError){
            const res = await updateUserInfo({name: formData.name, email:formData.email, password:formData.password, newPassword: formData.confirmPassword})
            
            if(res.status == 200) {
                alertToast(res.data.message)
                setFormData({...formData, password:"", confirmPassword:""})
                logOutUser()
            } else{
                errorToast(res.message)
                setFormData({...formData, password:"", confirmPassword:""})
            }
        } else {
            console.log(error)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.container2}>
                <p className={styles.headerText}>Settings</p>
                <Form 
                    formFields={formFields}
                    errorMessages={errorMessages}
                    error={error}
                    onSubmit={onSubmit}
                    buttonText={"Update"}
                />
            </div>
        </div>
    )
}