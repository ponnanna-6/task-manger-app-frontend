import { useEffect, useState } from 'react';
import styles from './taskDisplay.module.css'
import { SlOptions } from "react-icons/sl";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { getDueData, isBeforeDueDate, writeShareLinkToClipboard } from '../../helper/utils';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { updateCheckListStatus, updateTaskState } from '../../services/tasks';
import EmailIcon from '../emailIcon/emailIcon';
import Popup from '../popup/popup';

export function TaskDisplay({ task, onEditTask, deleteTask, setRefreshData, isPublic, collapse }) {
    const [showDropDown, setShowDropDown] = useState(false);
    const [showChecklist, setShowChecklist] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);

    const updateState = async (state) => {
        const res = await updateTaskState(task._id, state)
        if (res.status == 200) {
            setRefreshData(true)
        } else {
            alert("Could not update task")
        }
    }
    const setDueDateColor = (dueDate) => {
        if (task?.taskStatus === "DONE") {
            return "green"
        }
        if (isBeforeDueDate(dueDate)) {
            return "#CF3636"
        } else {
            return "grey"
        }
    }

    const colors = {
        "HIGH PRIORITY": "red",
        "MEDIUM PRIORITY": "yellow",
        "LOW PRIORITY": "green"
    }

    const dropDownOptions = {
        "Edit": {
            name: "Edit",
            onClick: () => {
                onEditTask(task._id)
                setShowDropDown(false)
            }
        },
        "Share": {
            name: "Share",
            onClick: () => {
                const linkCopied = writeShareLinkToClipboard(task._id)
                if (linkCopied) {
                    alert('Link copied')
                } else {
                    alert('Failed to copy link')
                }
                setShowDropDown(false)
            }
        },
        "Delete": {
            name: "Delete",
            onClick: () => {
                setShowDropDown(false)
                setDeletePopup(true)
            }
        }
    }

    const taskStates = [
        "BACKLOG",
        "TODO",
        "IN PROGRESS",
        "DONE"
    ]
    const toggleChecklistItem = async (index) => {
        const updatedChecklist = task.checklist.map((item, i) =>
            i === index ? { ...item, checked: !item.checked } : item
        );

        const res = await updateCheckListStatus(task._id, updatedChecklist)
        if (res.status == 200) {
            setRefreshData(true)
        } else {
            alert("Could not update task")
        }
    };

    useEffect(() => {
        setShowChecklist(false)
    }, [collapse])
    
    const deleteConfirm = () => {
        setDeletePopup(false)
        deleteTask(task._id)
    }

    return (
        <div
            className={styles.taskContainer}
            style={isPublic ? { width: '100%', maxHeight: '80%', overflow: 'auto' } : {}}
        >
            <div className={styles.header1}>
                <div className={styles.priorityContainer}>
                    <p className={styles.priority}><span style={{ color: colors[task?.priority], fontSize: '2vw' }}>.</span>{task?.priority}</p>

                    {task?.assignedTo.length>0 &&
                        <div style={{ width: "1vw", height: "0.8vw", flexDirection: "row", display: "flex", gap: "0.2vw", borderRadius: "50%"}}>  
                            {task?.assignedTo.map((item, index) => (
                            <EmailIcon email={item?.email} key={index} />
                            ))}
                        </div>
                    }
                </div>

                {(showDropDown && !isPublic) && (
                    <div className={styles.dropDown}>
                        {Object.keys(dropDownOptions).map((option, index) => (
                            <p key={index} style={{ cursor: 'pointer', color: option === "Delete" ? "red" : "black" }} onClick={dropDownOptions[option].onClick}>{option}</p>
                        ))}
                    </div>
                )}
                {!isPublic && <SlOptions className={styles.dropDownDots} onClick={() => setShowDropDown(!showDropDown)} />}

            </div>
            <p
                className={styles.title}
            >
                {task.title}
            </p>

            <div>
                <div className={styles.checklistHeaderRow}>
                    <p className={styles.checklistName}>{`Checklist (${task?.checklist?.filter(item => item.checked).length}/${task.checklist.length})`}</p>
                    {!isPublic && (
                        showChecklist
                            ? <IoIosArrowUp className={styles.arrowIcon} onClick={() => setShowChecklist(!showChecklist)} />
                            : <IoIosArrowDown className={styles.arrowIcon} onClick={() => setShowChecklist(!showChecklist)} />
                    )}
                </div>
                {(showChecklist || isPublic) &&
                    <div className={styles.checklistDropContainer} style={isPublic ? { width: '100%' } : {}}>
                        {task?.checklist?.map((item, index) => (
                            <div key={index} className={styles.checklistItemContainer}>
                                <input
                                    type="checkbox"
                                    checked={item.checked}
                                    onChange={() => !isPublic && toggleChecklistItem(index)}
                                />
                                <p>{item.message}</p>
                            </div>
                        ))}
                    </div>
                }
            </div>

            <div className={styles.footer}>
                {task.dueDate &&
                    <div className={styles.dueDate} style={{ backgroundColor: setDueDateColor(task?.dueDate) }}>
                        <p>{getDueData(task?.dueDate)}</p>
                    </div>
                }
                {!isPublic && (
                    <div className={styles.taskStatusDiv}>
                        {taskStates.map((state, index) => (
                            state !== task?.taskStatus ? (
                                <div className={styles.taskStatusItem}>
                                    <p key={index} onClick={() => updateState(state)}>{state}</p>
                                </div>
                            ) : null
                        ))}
                    </div>
                )}

            </div>
            
            <Popup
                onConfirm={deleteConfirm}
                isOpen={deletePopup}
                onClose={() => setDeletePopup(false)}
                message="Are you sure you want to Delete Task?"
                cancelButtonText={"Cancel"}
                confirmButtonText={"Yes, Delete"}
            />
        </div>
    )
}