import { useEffect, useState } from 'react'
import { getUserInfo } from '../../services/auth'
import styles from './board.module.css'
import { getTodaysDate } from '../../helper/utils'
import { useNavigate } from 'react-router-dom'
import { IoMdAdd } from "react-icons/io";
import TaskPopUp from '../taskPopUp/taskPopUp'
import { getTaskById, getUserTasks } from '../../services/tasks'
import { TaskDisplay } from '../taskDisplayItem/taskDisplay'
import { PiUsers } from "react-icons/pi";
import Popup from '../popup/popup'
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
    const [filter, setFilter] = useState("week")
    const [showAddPopUp, setShowAddPopUp] = useState(false)

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
        console.log("FILTER", filter)
    }, [filter])

    const filterMapping = {
        "today": {
            name: "Today",
            onClick: () => { setFilter("today") },
        },
        "week": {
            name: "This Week",
            onClick: () => { setFilter("week") },    
        },
        "month": {
            name: "This Month",
            onClick: () => { 
                console.log("MONTH")
                setFilter("month")
            },
        }
    }

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
            await getUserTasks(filter).then((res) => {
                if(res.status == "200") {
                    //filter data by filter before setting
                    if(filter == "today") {
                        res.data = res.data.filter((item) => {
                            let date = getTodaysDate()
                            return item.dueDate == date
                        })
                    }
                    setAllData(res.data)
                }
            }).catch(error => console.log(error))
            setRefreshData(false)
        }
        getData()
    }, [refreshData, filter])

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

    const addPeopleToBoard = (email) => {
        setShowAddPopUp(false)
        console.log("Add People: ", email)
    }

    return (
        <div className={styles.container}>
            <div className={styles.boardHeader}>
                <p>{`Welcome ! ${userData?.name}`}</p>
                <p>{getTodaysDate()}</p>
            </div>
            <div className={styles.boardHeader}>
                <p className={styles.headerText}>Board</p>
                <PiUsers 
                    style={{fontSize: "20px", marginRight: "10px", cursor: "pointer"}}
                    onClick={() => {setShowAddPopUp(true)}}
                />
                <select className={styles.filterContainer} value={filter} onChange={(e) => filterMapping[e.target.value].onClick()}>
                    {Object.keys(filterMapping).map((key, index) => 
                        <option key={index} value={key}>{filterMapping[key].name}</option>)
                    }
                </select>
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
            {showAddPopUp && <Popup 
                from={"addPeople"}
                isOpen={showAddPopUp}
                onClose={() => setShowAddPopUp(false)}
                message={"Add people to the board"}
                cancelButtonText={"Cancel"}
                confirmButtonText={"Add"}
                onConfirm={addPeopleToBoard}
            />}
        </div>
    )
}