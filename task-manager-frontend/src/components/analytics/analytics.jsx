import { useEffect, useState } from 'react'
import styles from './analytics.module.css'
import { getUserAnalytics } from '../../services/analytics'
import { FaCircle } from "react-icons/fa";
export default function Analytics({ }) {
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState({})

    const [tasksContainer, setTasksContainer] = useState([
        {   
            id: "BACKLOG",
            name: "Backlog Tasks",
            count: 0,
        },
        {
            id: "TODO",
            name: "To-Do Tasks",
            count: 0,
        },
        {
            id: "IN PROGRESS",
            name: "In-Progress Tasks",
            count: 0,
        },
        {
            id: "DONE",
            name: "Completed Tasks",
            count: 0,
        },
    ])

    const [priorityContainer, setPriorityContainer] = useState([
        {
            id: "HIGH PRIORITY",
            name: "High Priority Tasks",
            count: 0,
        },
        {
            id: "MODERATE PRIORITY",
            name: "Medium Priority Tasks",
            count: 0,
        },
        {
            id: "LOW PRIORITY",
            name: "Low Priority Tasks",
            count: 0,
        },
        {
            id: "DUE DATE",
            name: "Due Date Tasks",
            count: 0,
        },
    ])

    useEffect(() => {
        const getData = async () => {
            await getUserAnalytics().then((res) => {
                if (res.status == 200) {
                    setData(res.data)
                } else {
                    alert(res.message)
                }
            })
        }
        getData()
    }, [])


    useEffect(() => {
        if(Object.keys(data).length > 0) {
            let updatedPriorityContainer = [...priorityContainer]
            updatedPriorityContainer.map((item) => {
                item.count = data?.priority[item.id]
            })

            setPriorityContainer(updatedPriorityContainer)

            let updatedTasksContainer = [...tasksContainer]
            updatedTasksContainer.map((item) => {
                item.count = data?.status[item.id]
            })
            setTasksContainer(updatedTasksContainer)
            setIsLoading(false)
        }
    }, [data])

    return (
        <div className={styles.container}>
            <p className={styles.headerText}>Analytics</p>
            {!isLoading &&
                <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-evenly", alignItems: "center", marginTop: "10vh"}}>
                    <div className={styles.subContainer}>
                        {tasksContainer.map((item, index) => (
                            <div key={index} className={styles.taskContainer}>
                                <p className={styles.taskName}><span><FaCircle color='#90C4CC'/></span>&nbsp;&nbsp;{item.name}</p>
                                <p className={styles.taskCount}>{item.count}</p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.subContainer}>
                        {priorityContainer.map((item, index) => (
                            <div key={index} className={styles.taskContainer}>
                                <p className={styles.taskName}><span><FaCircle color='#90C4CC'/></span>&nbsp;&nbsp;{item.name}</p>
                                <p className={styles.taskCount}>{item.count}</p>
                            </div>
                        ))}
                    </div>
                </div>}
        </div>
    )
}