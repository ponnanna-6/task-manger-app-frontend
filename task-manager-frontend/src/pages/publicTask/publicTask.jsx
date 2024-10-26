import styles from './publicTask.module.css'
import AstroImage from '../../assets/astro.png'
import { useEffect, useState } from 'react'
import Form from '../../components/form/form'
import { useNavigate, useParams } from 'react-router-dom'
import { getIdFromToken, validateEmail } from '../../helper/utils'
import { loginUser } from '../../services/auth'
import { getPublicTask } from '../../services/tasks'
import { TaskDisplay } from '../../components/taskDisplayItem/taskDisplay'
import logo from '../../assets/logo.svg'

export default function PublicTask({}) {
    const { id } = useParams();
    const [task, setTask] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getData = async() => {
            await getPublicTask(id).then((res) => {
                if(res.status == "200") {
                    setTask(res.data)
                } else {
                    alert(res.message)
                }
            }).catch((err) => {
                console.log(err)
            }).finally(() => {
                setIsLoading(false)
            })
        }

        getData()
    },[])

    return (
        <div className={styles.container}>
            <div className={styles.appNameContainer}>
                <img src={logo} alt="Logo"/>
                <p >Pro-Manage</p>
            </div>
            {!isLoading && <TaskDisplay task={task} isPublic={true}/>}
        </div>
    )
}