import { useEffect, useRef, useState } from 'react';
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
import { alertToast, errorToast, linkCopiedToast } from '../../helper/toast';
import ActivityIndicator from '../activityIndicator/activityIndicator';

export function TaskDisplay({ task, onEditTask, deleteTask, setRefreshData, isPublic, collapse }) {
    const [showDropDown, setShowDropDown] = useState(false);
    const [showChecklist, setShowChecklist] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setShowDropDown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef, buttonRef]);

    const updateState = async (state) => {
        setIsLoading(true)
        const res = await updateTaskState(task._id, state)
        if (res.status == 200) {
            setIsLoading(false)
            setRefreshData(true)
        } else {
            setIsLoading(false)
            errorToast("Could not update task status")
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
        "MODERATE PRIORITY": "#17A2B8",
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
                    linkCopiedToast('Link Copied')
                } else {
                    errorToast('Failed to copy link')
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
        setIsLoading(true)
        const res = await updateCheckListStatus(task._id, updatedChecklist)
        if (res.status == 200) {
            setIsLoading(false)
            setRefreshData(true)
        } else {
            setIsLoading(false)
            errorToast("Could not update checklist")
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
            className={isPublic ? styles.taskContainerPublic : styles.taskContainer}
        >   
            {isLoading && <ActivityIndicator />}
            {!isLoading && <>

                <div className={styles.header1}>
                    <div className={styles.priorityContainer}>
                        <p className={styles.priority}><span style={{ color: colors[task?.priority], fontSize: '25px' }}>.</span>{task?.priority}</p>

                        {task?.assignedTo.length > 0 && !isPublic &&
                            <div style={{height: "0.8vw", flexDirection: "row", display: "flex", gap: "0.2vw"}}>
                                {task?.assignedTo.map((item, index) => (
                                    <EmailIcon email={item?.email} key={index} />
                                ))}
                            </div>
                        }
                    </div>

                    {(showDropDown && !isPublic) && (
                        <div ref={dropdownRef} className={styles.dropDown}>
                            {Object.keys(dropDownOptions).map((option, index) => (
                                <p key={index} className={styles.dropDownOptionText} style={{ cursor: 'pointer', color: option === "Delete" ? "red" : "black" }} onClick={dropDownOptions[option].onClick}>{option}</p>
                            ))}
                        </div>
                    )}
                    {!isPublic &&
                        <button ref={buttonRef} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                            <SlOptions
                                className={styles.dropDownDots} onClick={() => setShowDropDown(!showDropDown)}
                            />
                        </button>
                    }

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
                                <div key={index} className={isPublic ? styles.checklistItemContainerPublic : styles.checklistItemContainer}>
                                    <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onChange={() => !isPublic && toggleChecklistItem(index)}
                                        className={styles.customCheckbox}
                                        style={{ marginRight: '0.5vw' }}
                                    />
                                    <p className={isPublic ? styles.checklistItemTextPublic : styles.checklistItemText} onClick={() => !isPublic && toggleChecklistItem(index)}>{item.message}</p>
                                </div>
                            ))}
                        </div>
                    }
                </div>

                <div className={styles.footer}>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5vw', alignItems: 'center'}}>
                        {isPublic && task.dueDate && <p className={styles.dueDateName}>Due Date: </p>}
                        <div className={styles.dueDate} style={{ backgroundColor: task.dueDate ? setDueDateColor(task?.dueDate) : 'transparent' }}>
                            <p>{task.dueDate ? getDueData(task?.dueDate) : '\u00A0'}</p>
                        </div>
                    </div>
                    {!isPublic && (
                        <div className={styles.taskStatusDiv}>
                            {taskStates.map((state, index) => (
                                state !== task?.taskStatus ? (
                                    <div className={styles.taskStatusItem} key={index}>
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
            </>}
        </div>
    )
}