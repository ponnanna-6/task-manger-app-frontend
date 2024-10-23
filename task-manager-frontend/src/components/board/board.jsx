import { useEffect, useState } from 'react'
import { getUserInfo } from '../../services/auth'
import styles from './board.module.css'
import { getTodaysDate } from '../../helper/utils'
import { useNavigate } from 'react-router-dom'
import { IoMdAdd } from "react-icons/io";
import TaskPopUp from '../taskPopUp/taskPopUp'
import { getTaskById, getUserTasks } from '../../services/tasks'
import { TaskDisplay } from '../taskDisplayItem/taskDisplay'
export default function Board ({}) {
    const navigate = useNavigate()

    const [addtask, setAddtask] = useState(false)
    const [allData, setAllData] = useState([])
    const [backlogData, setBacklogData] = useState([])
    const [todoData, setTodoData] = useState([])
    const [inprogressData, setInprogressData] = useState([])
    const [doneData, setDoneData] = useState([])
    const [userData, setUserData] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [editTaskData, setEditTaskData] = useState({})
    const [refreshData, setRefreshData] = useState(false)

    const mappingData = {
        0: backlogData,
        1: todoData,
        2: inprogressData,
        3: doneData
    }

    const nameMapping = {
        0: 'BACKLOG',
        1: 'TODO',
        2: 'IN PROGRESS',
        3: 'DONE'
    }


    const boardDivisions = [
        {id: 0, name: 'Backlog'},
        {id: 1, name: 'To Do'},
        {id: 2, name: 'In Progress'},
        {id: 3, name: 'Done'},
    ]

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


    useEffect(() => {
        const getData = async() => {
            await getUserTasks().then((res) => {
                if(res.status == "200") {
                    setAllData(res.data)
                }
            }).catch(error => console.log(error))
            setRefreshData(false)
        }
        getData()
    }, [refreshData])

    useEffect(() => {
        if(allData) {
            setBacklogData(allData.filter((item) => item.taskStatus == nameMapping[0]))
            setTodoData(allData.filter((item) => item.taskStatus == nameMapping[1]))
            setInprogressData(allData.filter((item) => item.taskStatus == nameMapping[2]))
            setDoneData(allData.filter((item) => item.taskStatus == nameMapping[3]))
        }
    }, [allData])

    const onEditTask = async(id) => {
        await getTaskById(id).then((res) => {
            if(res.status == "200") {
                setEditTaskData(res.data)        
                setIsEdit(true)
                setAddtask(true)
            }
        }).catch(error => console.log(error))
    }

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
                        <div className={styles.tasks}>
                            {mappingData[item.id].map((task, index) => (
                                <TaskDisplay 
                                    key={index}
                                    task={task}
                                    onEditTask={onEditTask}
                                    setRefreshData={setRefreshData}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <TaskPopUp 
                isOpen={addtask}
                isEdit={isEdit}
                onClose={() => {setAddtask(false)}}
                editTaskData={editTaskData}
                setRefreshData={setRefreshData}
            />
        </div>
    )
}