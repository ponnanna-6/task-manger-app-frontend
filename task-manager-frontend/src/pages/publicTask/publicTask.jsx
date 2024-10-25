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
    const { id } = useParams();
    const [task, setTask] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getData = async() => {
            await getPublicTask(id).then((res) => {
                setTask(res.data)
                setIsLoading(false)
            }).catch((err) => {
                alert(err)
            })
        }

        getData()
    },[])

    return (
        <div className={styles.container}>
            {!isLoading && <TaskDisplay task={task} isPublic={true}/>}
        </div>
    )
}