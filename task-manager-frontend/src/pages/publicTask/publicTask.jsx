import styles from './publicTask.module.css'
import AstroImage from '../../assets/astro.png'
import { useEffect, useState } from 'react'
import Form from '../../components/form/form'
import { useNavigate, useParams } from 'react-router-dom'
import { getIdFromToken, validateEmail } from '../../helper/utils'
import { loginUser } from '../../services/auth'
import { getPublicTask } from '../../services/tasks'
import { TaskDisplay } from '../../components/taskDisplayItem/taskDisplay'

export default function PublicTask({}) {
    const navigate = useNavigate()
    const { id } = useParams();
    const [task, setTask] = useState({})

    useEffect(() => {
        const getData = async() => {
            await getPublicTask(id).then((res) => {
                setTask(res.data)
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
        }

        getData()
    },[])

    return (
        <div className={styles.container}>
            <TaskDisplay task={task} isPublic={true}/>
        </div>
    )
}