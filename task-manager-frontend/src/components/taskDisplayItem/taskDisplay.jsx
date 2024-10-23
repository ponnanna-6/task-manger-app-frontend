import { useState } from 'react';
import styles from './taskDisplay.module.css'
import { SlOptions } from "react-icons/sl";
import { FaChevronDown } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { getDueData, isBeforeDueDate } from '../../helper/utils';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

export function TaskDisplay({ task }) {
    const [showDropDown, setShowDropDown] = useState(false);
    const [showChecklist, setShowChecklist] = useState(false);

    const colors = {
        "HIGH PRIORITY": "red",
        "MEDIUM PRIORITY": "yellow",
        "LOW PRIORITY": "green"
    }

    const dropDownOptions = {
        "Edit": {
            name: "Edit",
            onClick: () => console.log("edit")
        },
        "Delete": {
            name: "Delete",
            onClick: () => console.log("delete")
        },
        "Share": {
            name: "Share",
            onClick: () => console.log("share")
        }
    }

    const taskStates = [
        "BACKLOG",
        "TODO",
        "IN PROGRESS",
        "DONE"
    ]
    return (
        <div className={styles.taskContainer}>
            <div className={styles.header1}>
                <p className={styles.priority}><span style={{ color: colors[task?.priority], fontSize: '2vw' }}>.</span>{task?.priority}<span>&nbsp;&nbsp;&nbsp;&nbsp;{task?.assignedTo?.charAt(0).toUpperCase()}</span></p>

                {showDropDown && (
                    <div className={styles.dropDown}>
                        {Object.keys(dropDownOptions).map((option, index) => (
                            <p key={index} style={{ cursor: 'pointer' }} onClick={dropDownOptions[option].onClick}>{option}</p>
                        ))}
                    </div>
                )}
                <SlOptions className={styles.dropDownDots} onClick={() => setShowDropDown(!showDropDown)} />

            </div>
            <p className={styles.title}>{task.title}</p>
            <div>
                <div className={styles.checklistHeaderRow}>
                    <p className={styles.checklistName}>{`CheckList (${task?.checklist?.length})`}</p>
                    {showChecklist 
                        ? <IoIosArrowUp className={styles.arrowIcon} onClick={() => setShowChecklist(!showChecklist)} /> 
                        : <IoIosArrowDown className={styles.arrowIcon} onClick={() => setShowChecklist(!showChecklist)} />}
                </div>
                {showChecklist && 
                    <div className={styles.checklistDropContainer}>
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
                    <div className={styles.dueDate} style={{ backgroundColor: isBeforeDueDate(task?.dueDate) ? 'red' : 'grey' }}>
                        <p>{getDueData(task?.dueDate)}</p>
                    </div>
                }
                <div className={styles.taskStatusDiv}>
                    {taskStates.map((state, index) => (
                        state !== task?.taskStatus ? (
                            <p key={index} className={styles.taskStatusItem}>{state}</p>
                        ) : null
                    ))}
                </div>

            </div>
        </div>
    )
}