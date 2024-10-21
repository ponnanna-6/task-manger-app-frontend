import { useEffect, useState } from 'react'
import { getUserInfo } from '../../services/auth'
import styles from './board.module.css'
import { getTodaysDate } from '../../helper/utils'
export default function Board ({}) {
    const [userData, setUserData] = useState({})

    useEffect(() => {
        const getUserData = async() => {
            await getUserInfo().then((res) => {
                if(res.status == "200") {
                    setUserData(res.data)
                }
            })
            .catch(error => navigate('/login'))
        }
        getUserData()
    }, [])
    console.log(userData)
    return (
        <div className={styles.container}>
            <div className={styles.boardHeader}>
                <p>{`Welcome ! ${userData?.name}`}</p>
                <p>{getTodaysDate()}</p>
            </div>
            <div className={styles.boardHeader}>
                <p className={styles.headerText}>Board</p>
                <p>This week</p>
            </div>
            <div className={styles.tasksContainer}>
                <div className={styles.taskCategory}></div>
                <div className={styles.taskCategory}></div>
                <div className={styles.taskCategory}></div>
                <div className={styles.taskCategory}></div>
                <div className={styles.taskCategory}></div>
                <div className={styles.taskCategory}></div>
                <div className={styles.taskCategory}></div>
            </div>
        </div>
    )
}