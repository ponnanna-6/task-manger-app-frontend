import { useState } from 'react';
import styles from './taskDisplay.module.css'
import { SlOptions } from "react-icons/sl";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { getDueData, isBeforeDueDate, writeShareLinkToClipboard } from '../../helper/utils';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { updateCheckListStatus, updateTaskState } from '../../services/tasks';

export function TaskDisplay({ task, onEditTask, deleteTask, setRefreshData, isPublic }) {
    const [showDropDown, setShowDropDown] = useState(false);
    const [showChecklist, setShowChecklist] = useState(false);

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
        "Delete": {
            name: "Delete",
            onClick: () => {
                setShowDropDown(false)
                deleteTask(task._id)
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
        }
    }

    const taskStates = [
        "BACKLOG",
        "TODO",
        "IN PROGRESS",
        "DONE"
    ]
    const toggleChecklistItem = async(index) => {
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

    return (
        <div
            className={styles.taskContainer}
            style={isPublic ? { width: '100%', maxHeight: '80%', overflow: 'auto' } : {}}
        >
            <div className={styles.header1}>
                <p className={styles.priority}><span style={{ color: colors[task?.priority], fontSize: '2vw' }}>.</span>{task?.priority}<span>&nbsp;&nbsp;&nbsp;&nbsp;{task?.assignedTo?.charAt(0).toUpperCase()}</span></p>

                {(showDropDown && !isPublic) && (
                    <div className={styles.dropDown}>
                        {Object.keys(dropDownOptions).map((option, index) => (
                            <p key={index} style={{ cursor: 'pointer' }} onClick={dropDownOptions[option].onClick}>{option}</p>
                        ))}
                    </div>
                )}
                {!isPublic && <SlOptions className={styles.dropDownDots} onClick={() => setShowDropDown(!showDropDown)} />}

            </div>
            <p className={styles.title}>{task.title}</p>
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
                    <div className={styles.checklistDropContainer} style={isPublic ? { width: '100%'} : {}}>
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
        </div>
    )
}