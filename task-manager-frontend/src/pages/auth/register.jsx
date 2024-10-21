import styles from './auth.module.css'
import AstroImage from '../../assets/astro.png'
import { useState } from 'react'
import Form from '../../components/form/form'

export default function Register({}) {
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
            },
        },
        {
            name: "email",
            placeholder: "Email",
            type: "email",
            value: formData?.email,
            onChange: (e) => {
                setFormData({...formData, email: e.target.value})
            },
        },
        {
            name: "password",
            placeholder: "Password",
            type: "password",
            value: formData?.password,
            onChange: (e) => {
                setFormData({...formData, password: e.target.value})
            },
        },
        {
            name: "confirmPassword",
            placeholder: "Confirm Password",
            type: "password",
            value: formData?.confirmPassword,
            onChange: (e) => {
                setFormData({...formData, confirmPassword: e.target.value})
            },
        }
    ]
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
                <p>Register</p>
                <Form formFields={formFields}/>
            </div>
        </div>
    )
}