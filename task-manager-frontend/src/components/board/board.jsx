import { useEffect, useState } from 'react'
import { getUserInfo } from '../../services/auth'
import styles from './board.module.css'
import { getTodaysDate } from '../../helper/utils'
import { useNavigate } from 'react-router-dom'
import { IoMdAdd } from "react-icons/io";
import TaskPopUp from '../taskPopUp/taskPopUp'
export default function Board ({}) {
    const [userData, setUserData] = useState({})
    const [addtask, setAddtask] = useState(false)

    const boardDivisions = [
        {id: 0, name: 'Backlog'},
        {id: 1, name: 'To Do'},
        {id: 2, name: 'In Progress'},
        {id: 3, name: 'Done'},
    ]
    const navigate = useNavigate()
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
                <p onClick={() => {setAddtask(true)}}>This week</p>
            </div>
            <div className={styles.tasksContainer}>
                {boardDivisions.map((item, index) => (
                    <div key={index} className={styles.taskCategory}>
                        <div className={styles.taskCategoryHeader}>
                            <p>{item.name}</p>
                            {item.id == 1 && <IoMdAdd onClick={() => {setAddtask(true)}} className={styles.addIcon}/>}
                        </div>
                    </div>
                ))}
            </div>
            <TaskPopUp 
                isOpen={addtask}
                onClose={() => {setAddtask(false)}}
                onConfirm={() => {setAddtask(false)}}
                message="Add Task"
                cancelButtonText="Cancel"
                confirmButtonText="Save"
            />
        </div>
    )
}