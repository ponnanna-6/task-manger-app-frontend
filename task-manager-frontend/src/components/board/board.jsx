import { useEffect, useState } from 'react'
import { getAllUsers, getUserInfo } from '../../services/auth'
import styles from './board.module.css'
import { getTodaysDate } from '../../helper/utils'
import { useNavigate } from 'react-router-dom'
import { IoMdAdd } from "react-icons/io";
import { VscCollapseAll } from "react-icons/vsc";
import TaskPopUp from '../taskPopUp/taskPopUp'
import { deleteTaskById, getTaskById, getUserTasks } from '../../services/tasks'
import { TaskDisplay } from '../taskDisplayItem/taskDisplay'
import { PiUsers } from "react-icons/pi";
import Popup from '../popup/popup'
import { shareBoard } from '../../services/acess'
import { getBoardData } from '../../services/board'
import { all } from 'axios'
import EmailIcon from '../emailIcon/emailIcon'
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
    const [boardData, setBoardData] = useState({})
    const [allUserData, setAllUserData] = useState([])
    const [collapsedCategories, setCollapsedCategories] = useState({
        0: false,
        1: false,
        2: false,
        3: false
    });
    

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

            await getBoardData().then((res) => {
                if(res.status == "200") {
                    setBoardData(res.data)
                }
            })
            .catch(error => console.log(error))

            await getAllUsers().then((res) => {
                if(res.status == "200") {
                    setAllUserData(res.data)
                }
            })
            .catch(error => console.log(error))
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
        }
        setRefreshData(false)
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

    const deleteTask = async(id) => {
        await deleteTaskById(id).then((res) => {
            if(res.status == "200") {
                setRefreshData(true)
                alert("Task deleted successfully")
            }
        }).catch(error => console.log(error))
    }

    const addPeopleToBoard = async(email) => {
        await shareBoard(email).then((res) => {
            console.log(res)
            if(res.status == "200") {
                alert("Board shared successfully")
                setShowAddPopUp(false)
                setRefreshData(true)
            } else {
                alert(res.message)
            }
        }).catch(error => alert(error))
    }

    const toggleCollapse = (categoryId) => {
        setCollapsedCategories((prevState) => ({
            ...prevState,
            [categoryId]: !prevState[categoryId]
        }));
    };
    

    return (
        <div className={styles.container}>
            <div className={styles.boardHeader}>

            </div>
            <div className={styles.boardHeader}>
                <p className={styles.welcomeText}>{`Welcome ! ${userData?.name}`}</p>
                <p className={styles.dateText}>{getTodaysDate()}</p>
            </div>
            <div className={styles.boardHeader}>
                <div style={{display: "flex", alignItems: "center", flexDirection: "row", gap: "10px"}}>
                    <p className={styles.headerText}>Board</p>
                    <PiUsers 
                        style={{
                            fontSize: "1.3vw",
                            cursor: "pointer",
                            marginLeft: "0.3vw",
                            color: "#707070"
                        }}
                        onClick={() => {setShowAddPopUp(true)}}
                    />
                    <label className={styles.addPeopleText} onClick={() => setShowAddPopUp(true)}>Add People</label>
                    <div style={{ flexDirection: "row", display: "flex", gap: "0.2vw" }}>  
                    {boardData?.emailList && 
                        boardData.emailList.map((item, index) => (
                            <EmailIcon email={item} key={index} />
                        ))
                    }
                    </div>
                </div>
                
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
                            {item.id == 1 && 
                                <IoMdAdd 
                                    onClick={() => {
                                        setAddtask(true)
                                        setIsEdit(false)
                                    }}
                                    className={styles.addIcon}
                                />
                            }
                            <VscCollapseAll className={styles.collapseIcon} onClick={() => toggleCollapse(item.id)}/>
                        </div>
                        <div className={styles.tasks}>
                            {mappingData[item.id].map((task, index) => (
                                <TaskDisplay 
                                    key={index}
                                    task={task}
                                    onEditTask={onEditTask}
                                    deleteTask={deleteTask}
                                    setRefreshData={setRefreshData}
                                    collapse = {collapsedCategories[item.id]}
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
                userData={allUserData}
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