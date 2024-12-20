import { useState } from "react";
import styles from "./taskPopUp.module.css";
import { MdDelete } from "react-icons/md";
import { addTaskToDb, editTaskInDb } from "../../services/tasks";
import { formatDate, validateEmail } from "../../helper/utils";
import Select from 'react-dropdown-select'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { alertToast, errorToast } from "../../helper/toast";
import ActivityIndicator from "../activityIndicator/activityIndicator";

export default function TaskPopUp({ isOpen, onClose, isEdit, editTaskData, setRefreshData, userData}) {
    if (!isOpen) return null;
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: isEdit ? editTaskData.title : "",
        priority: isEdit ? editTaskData.priority : "",
        assignedTo: isEdit ? editTaskData.assignedTo : [],
        checklist: isEdit ? editTaskData.checklist : [],
        dueDate: isEdit && editTaskData.dueDate
            ? editTaskData.dueDate
            : "",
    });

    const [error, setError] = useState({
        title: false,
        priority: false,
        assignedTo: false,
        dueDate: false,
        checklist: false,
    });

    const getColor = (priority) => {
        switch (priority) {
            case 0:
                return "red";
            case 1:
                return "yellow";
            case 2:
                return "green";
            default:
                return "black";
        }
    };

    const [currentError, setCurrentError] = useState({ name: "", message: "" });

    const errorFormData = {
        title: {
            message: "Title is required",
            isValid: formData.title.length > 0,
            onError: () => {
                setError((prevError) => ({ ...prevError, title: true }));
            },
        },
        priority: {
            message: "Priority is required",
            isValid: formData.priority.length > 0,
            onError: () => {
                setError((prevError) => ({ ...prevError, priority: true }));
            },
        },
        assignedTo: {
            message: "Enter a valid email id",
            isValid: formData.assignedTo.length == 0 || formData.assignedTo.length > 0,
            onError: () => {
                setError((prevError) => ({ ...prevError, assignedTo: true }));
            },
        },
        dueDate: {
            message: "Due date is required",
            isValid: formData.dueDate == "" || formData.dueDate.length > 0,
            onError: () => {
                setError((prevError) => ({ ...prevError, dueDate: true }));
            },
        },
        checklist: {
            message: "Checklist is required",
            isValid: formData.checklist.length > 0,
            onError: () => {
                setError((prevError) => ({ ...prevError, checklist: true }));
            },
        },
    };

    const [newChecklistItem, setNewChecklistItem] = useState({
        checked: false,
        message: ""
    });
    const [showChecklistInput, setShowChecklistInput] = useState(false);

    const handleAddChecklistItem = () => {
        setError({ ...error, checklist: false });
        setCurrentError({ name: "", message: "" });
        setShowChecklistInput(true);
        if (newChecklistItem.message.trim() !== "") {
            setFormData({
                ...formData,
                checklist: [...formData.checklist, newChecklistItem],
            });
            setNewChecklistItem({
                checked: false,
                message: ""
            });
        }
    };

    const handleRemoveChecklistItem = (index) => {
        const updatedChecklist = formData.checklist.filter((_, i) => i !== index);
        setFormData({ ...formData, checklist: updatedChecklist });
    };

    const toggleChecklistItem = (index) => {
        const updatedChecklist = formData.checklist.map((item, i) => 
            i === index ? { ...item, checked: !item.checked } : item
        );
        setFormData({ ...formData, checklist: updatedChecklist });
    };

    const onSaveClick = async () => {
        let isError = false;
        const updatedError = { ...error };

        Object.keys(errorFormData).forEach((key) => {
            if (!errorFormData[key].isValid) {
                errorFormData[key].onError();
                updatedError[key] = true;
                isError = true;
                setCurrentError({ name: key, message: errorFormData[key].message })
            }
        });

        setError(updatedError);

        if (isError) {
            return;
        }

        if (isEdit) {
            setIsLoading(true);
            await editTaskInDb(editTaskData?._id, formData).then((res) => {
                if (res.status == "200") {
                    setIsLoading(false);
                    alertToast("Task updated successfully")
                    setRefreshData(true)
                    onClose();
                } else {
                    errorToast("Error while updating task")
                    onClose();
                }
            });
        } else {
            setIsLoading(true);
            await addTaskToDb(formData).then((res) => {
                if (res.status == "200") {
                    setIsLoading(false);
                    alertToast("Task added successfully")
                    setRefreshData(true)
                    onClose();
                } else {
                    errorToast("Error while adding task")
                    onClose();
                }
            });
        }
    };

    const onChangeInput = (e, param) => {
        if(param == "assignedTo") {
            setFormData({ ...formData, [param]: e });
            setCurrentError({ name: "", message: "" });
        } else {
            setFormData({ ...formData, [param]: e.target.value });
            setCurrentError({ name: "", message: "" });
        }
    };
    
    return (
        <div className={styles.popupOverlay}>
            {isLoading && <ActivityIndicator/>}
            {!isLoading && <div className={styles.popupContentOuter}>
                <div className={styles.popupContent}>
                    <div className={styles.formGroupColumn}>
                        <label className={styles.label}>
                            Title&nbsp;<span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => onChangeInput(e, "title")}
                            placeholder="Enter Task Title"
                        />
                    </div>

                    {currentError?.name == "title" && <div className={styles.error}>{currentError?.message}</div>}

                    <div className={styles.formGroupRow}>
                        <label className={styles.label} style={{marginRight: "10px"}}>
                            Select Priority&nbsp;<span style={{ color: "red" }}>*</span>
                        </label>
                        <div className={styles.radioGroup}>
                            {["HIGH PRIORITY", "MODERATE PRIORITY", "LOW PRIORITY"].map((priority, index) => (
                                <label
                                    key={index}
                                    className={styles.radioContainer}
                                    style={formData.priority === priority ? { backgroundColor: "#EEECEC" } : {}}
                                >
                                    <input
                                        type="radio"
                                        value={priority}
                                        checked={formData.priority === priority}
                                        onChange={(e) => onChangeInput(e, "priority")}
                                    />
                                    <span className={styles.checkmark} style={{backgroundColor: getColor(index)}}>&nbsp;</span>
                                    <span className={styles.radioText}>{priority}</span>
                                </label>
                            ))}
                        </div>
                    </div>


                    {currentError?.name == "priority" && <div className={styles.error}>{currentError?.message}</div>}

                    <div className={styles.formGroupRow}>
                        <label className={styles.label}>Assign To&nbsp;</label>
                        <Select
                            multi
                            options={userData}
                            values={isEdit ? editTaskData.assignedTo : []}
                            dropdownHandleRenderer={({ state }) => (
                                <span>{state.dropdown ? '–' : '+'}</span>
                            )}
                            onChange={(value) => onChangeInput(value, "assignedTo")}
                            labelField="email"
                            valueField="email"
                            className={styles.selectContainer}
                            placeholder="Add a assignee"
                        />
                    </div>

                    {currentError?.name == "assignedTo" && <div className={styles.error}>{currentError?.message}</div>}

                    <div className={styles.formGroupColumn}>
                        <label className={styles.label} style={{marginBottom: "10px"}}>
                            {`Checklist (${formData.checklist.filter(item => item.checked).length}/${formData.checklist.length})`}<span style={{ color: "red" }}>&nbsp;*</span>
                        </label>
                        <ul className={styles.checklist}>
                            {formData.checklist.map((item, index) => (
                                <li key={index} className={styles.checklistItem}>
                                    <span style={{display: "flex", alignItems: "center", flexDirection: "row", width: "90%"}}>
                                        <input 
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={() => toggleChecklistItem(index)}
                                            style={{marginRight: "10px", accentColor: "#17A2B8"}}
                                        />
                                        <p className={styles.checklistText}>{item.message}</p>
                                    </span>
                                    
                                    <MdDelete
                                        className={styles.deleteButton}
                                        onClick={() => handleRemoveChecklistItem(index)}
                                    />
                                </li>
                            ))}
                        </ul>

                        <div className={styles.addChecklist}>
                            {showChecklistInput && (
                                <input
                                    type="text"
                                    value={newChecklistItem?.message}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleAddChecklistItem();
                                        }
                                    }}
                                    onChange={(e) => setNewChecklistItem({...newChecklistItem, message: e.target.value})}
                                    placeholder="Add New Item"
                                />
                            )}
                            <button onClick={handleAddChecklistItem}>+ Add New</button>
                        </div>
                    </div>

                    {currentError?.name == "checklist" && <div className={styles.error}>{currentError?.message}</div>}

                    <div className={styles.popupButtons}>
                        <div className={styles.formGroupRow} onClick={() => document.getElementById('date-input').showPicker()}>
                            <input
                                id="date-input"
                                type={"date"}
                                value={formData.dueDate ? formatDate(formData.dueDate) : "Select due date"}
                                onChange={(e) => onChangeInput(e, "dueDate")}
                                placeholder="Select due date"
                                className={styles.dateInput}
                                style={{color: '#707070', backgroundImage: 'none'}}
                            />
                        </div>

                        <div style={{ gap: "10px" }}>
                            <button onClick={onClose} className={styles.cancelButton}>
                                Cancel
                            </button>
                            <button onClick={onSaveClick} className={styles.saveButton}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
}