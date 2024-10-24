import { useState } from 'react';
import styles from './taskDisplay.module.css'
import { SlOptions } from "react-icons/sl";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { getDueData, isBeforeDueDate, writeShareLinkToClipboard } from '../../helper/utils';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { updateTaskState } from '../../services/tasks';

export function TaskDisplay({ task, onEditTask, setRefreshData, isPublic }) {
    const [showDropDown, setShowDropDown] = useState(false);
    const [showChecklist, setShowChecklist] = useState(false);

    const updateState = async (state) => {
        console.log(state, task?._id)
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
            return "red"
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
                console.log(task._id)
                onEditTask(task._id)
                setShowDropDown(false)
            }
        },
        "Delete": {
            name: "Delete",
            onClick: () => {
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
        }
    }

    const taskStates = [
        "BACKLOG",
        "TODO",
        "IN PROGRESS",
        "DONE"
    ]

    return (
        <div
            className={styles.taskContainer}
            style={isPublic ? { width: '100%'} : {}}
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
                    <p className={styles.checklistName}>{`CheckList (${task?.checklist?.length})`}</p>
                    {!isPublic && (
                        showChecklist
                            ? <IoIosArrowUp className={styles.arrowIcon} onClick={() => setShowChecklist(!showChecklist)} />
                            : <IoIosArrowDown className={styles.arrowIcon} onClick={() => setShowChecklist(!showChecklist)} />
                    )}
                </div>
                {(showChecklist || isPublic) &&
                    <div className={styles.checklistDropContainer} style={isPublic ? { width: '100%', overflowY: "scroll" } : {}}>
                        {task?.checklist?.map((item, index) => (
                            <div>
                                <input type="checkbox" />
                                <p>{item}</p>
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
                                <p key={index} className={styles.taskStatusItem} onClick={() => updateState(state)}>{state}</p>
                            ) : null
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}