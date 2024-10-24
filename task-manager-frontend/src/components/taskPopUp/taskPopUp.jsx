import { useState } from "react";
import styles from "./taskPopUp.module.css";
import { MdDelete } from "react-icons/md";
import { addTaskToDb, editTaskInDb } from "../../services/tasks";
import { validateEmail } from "../../helper/utils";

export default function TaskPopUp({ isOpen, onClose, isEdit, editTaskData, setRefreshData }) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        title: isEdit ? editTaskData.title : "",
        priority: isEdit ? editTaskData.priority : "",
        assignedTo: isEdit ? editTaskData.assignedTo : "",
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
            isValid: formData.assignedTo.length == "" || validateEmail(formData.assignedTo),
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

    const [newChecklistItem, setNewChecklistItem] = useState("");
    const [showChecklistInput, setShowChecklistInput] = useState(false);

    const handleAddChecklistItem = () => {
        setError({ ...error, checklist: false });
        setCurrentError({ name: "", message: "" });
        setShowChecklistInput(true);
        if (newChecklistItem.trim() !== "") {
            setFormData({
                ...formData,
                checklist: [...formData.checklist, newChecklistItem],
            });
            setNewChecklistItem("");
        }
    };

    const handleRemoveChecklistItem = (index) => {
        const updatedChecklist = formData.checklist.filter((_, i) => i !== index);
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
                console.log(key)
                setCurrentError({ name: key, message: errorFormData[key].message })
            }
        });

        setError(updatedError);

        if (isError) {
            return;
        }

        if (isEdit) {
            await editTaskInDb(editTaskData?._id, formData).then((res) => {
                if (res.status == "200") {
                    alert('updated sucessfully')
                    setRefreshData(true)
                    onClose();
                } else {
                    alert("Could not update task")
                    onClose();
                }
            });
        } else {
            await addTaskToDb(formData).then((res) => {
                if (res.status == "200") {
                    alert('added sucessfully')
                    setRefreshData(true)
                    onClose();
                } else {
                    alert("Could not add task")
                    onClose();
                }
            });
        }
    };

    const onChangeInput = (e, param) => {
        setFormData({ ...formData, [param]: e.target.value });
        setCurrentError({ name: "", message: "" });
    };

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContentOuter}>
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
                        <label className={styles.label}>
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
                        <input
                            type="email"
                            value={formData.assignedTo}
                            onChange={(e) => onChangeInput(e, "assignedTo")}
                            placeholder="Add an assignee"
                        />
                    </div>

                    {currentError?.name == "assignedTo" && <div className={styles.error}>{currentError?.message}</div>}

                    <div className={styles.formGroupColumn}>
                        <label className={styles.label}>
                            {`Checklist (0/${formData.checklist.length})`}<span style={{ color: "red" }}>*</span>
                        </label>
                        <ul className={styles.checklist}>
                            {formData.checklist.map((item, index) => (
                                <li key={index}>
                                    <span>
                                        <input type="checkbox" />
                                        {item}
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
                                    value={newChecklistItem}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleAddChecklistItem();
                                        }
                                    }}
                                    onChange={(e) => setNewChecklistItem(e.target.value)}
                                    placeholder="Add New Item"
                                />
                            )}
                            <button onClick={handleAddChecklistItem}>+ Add New</button>
                        </div>
                    </div>

                    {currentError?.name == "checklist" && <div className={styles.error}>{currentError?.message}</div>}

                    <div className={styles.popupButtons}>
                        <div className={styles.formGroupRow}>
                            <input
                                type={"date"}
                                value={formData.dueDate}
                                onChange={(e) => onChangeInput(e, "dueDate")}
                                placeholder="Select due date"
                                className={styles.dateInput}
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
            </div>
        </div>
    );
}