import styles from './auth.module.css'
import AstroImage from '../../assets/astro.png'
import { useState } from 'react'
import Form from '../../components/form/form'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../../services/auth'
import { validateEmail } from '../../helper/utils'

export default function Register({}) {
    const navigate = useNavigate()
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
            placeholder: "Email",
            type: "email",
            value: formData?.email,
            onChange: (e) => {
                setFormData({...formData, email: e.target.value})
                setError({...error, email: false})
            },
        },
        {
            name: "password",
            placeholder: "Password",
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
            placeholder: "Confirm Password",
            type: "password",
            value: formData?.confirmPassword,
            showPassword: false,
            onChange: (e) => {
                setFormData({...formData, confirmPassword: e.target.value})
                if(formData?.password == e.target.value) {      
                    setError({...error, confirmPassword: false})
                }
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
            isValid: formData.password.length >= 8,
            onError: () => {
                setError((error)=>({...error, password: true}))
            }
        },
        confirmPassword: {
            message: "Passwords do not match",
            isValid: formData.password === formData.confirmPassword,
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
            const res = await registerUser(formData)
            
            if(res.status == 200) {
                alert(res.message)
                navigate('/login')
            } else{
                alert(res.message)
            }
        } else {
            console.log(error)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.container1}>
                <div className={styles.circleContainer}>
                </div>
                <img src={AstroImage} alt='Asto image' className={styles.imageStyle}/>
                <p className={styles.imageBigText}>Welcome aboard my friend</p>
                <p className={styles.imageSmallText}>just a couple of clicks and we start</p>
            </div>
            <div className={styles.container2}>
                <p className={styles.headerText}>Register</p>
                <Form 
                    formFields={formFields}
                    errorMessages={errorMessages}
                    error={error}
                    onSubmit={onSubmit}
                    buttonText={"Register"}
                />
                <p className={styles.lightText}>Have an account ?</p>
                <button className={styles.buttonStyle} onClick={() => navigate('/login')}>Login</button>
            </div>
        </div>
    )
}