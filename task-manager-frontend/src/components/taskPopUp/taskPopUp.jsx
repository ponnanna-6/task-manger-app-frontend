import { useState } from 'react';
import styles from './taskPopUp.module.css';
import { MdDelete } from "react-icons/md";
import { addTaskToDb } from '../../services/tasks';

export default function TaskPopUp({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        title: '',
        priority: '',
        assignedTo: '',
        checklist: [],
        dueDate: ''
    });

    const [newChecklistItem, setNewChecklistItem] = useState('');
    const [showChecklistInput, setShowChecklistInput] = useState(false);

    const handleAddChecklistItem = () => {
        setShowChecklistInput(true);
        if (newChecklistItem.trim() !== '') {
            setFormData({ ...formData, checklist: [...formData.checklist, newChecklistItem] });
            setNewChecklistItem('');
        }
    };

    const handleRemoveChecklistItem = (index) => {
        const updatedChecklist = formData.checklist.filter((_, i) => i !== index);
        setFormData({ ...formData, checklist: updatedChecklist });
    };

    const onSaveClick = async () => {
        await addTaskToDb(formData).then((res) => {
            if (res.status == "200") {
                onClose();
            }
        })
    }

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
                <div className={styles.formGroupColumn}>
                    <label className={styles.label}>Title&nbsp;<span style={{ color: 'red' }}>*</span></label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter Task Title"
                    />
                </div>

                <div className={styles.formGroupRow}>
                    <label className={styles.label}>Select Priority&nbsp;<span style={{ color: 'red' }}>*</span></label>
                    <div className={styles.radioGroup}>
                        {['HIGH PRIORITY', 'MODERATE PRIORITY', 'LOW PRIORITY'].map((priority, index) => (
                            <label key={index}>
                                <input
                                    type="radio"
                                    value={priority}
                                    checked={formData.priority === priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                />
                                {priority}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.formGroupRow}>
                    <label className={styles.label}>Assign To&nbsp;</label>
                    <input
                        type="email"
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        placeholder="Add an assignee"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Checklist&nbsp;<span style={{ color: 'red' }}>*</span></label>
                    <ul className={styles.checklist}>
                        {formData.checklist.map((item, index) => (
                            <li key={index}>
                                <input type="checkbox" />
                                {item}
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
                                onChange={(e) => setNewChecklistItem(e.target.value)}
                                placeholder="Add New Item"
                            />
                        )}
                        <button onClick={handleAddChecklistItem}>+ Add New</button>
                    </div>
                </div>

                <div className={styles.popupButtons}>
                    <div className={styles.formGroupRow}>
                        <input
                            type={"date"}
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            placeholder="Select due date"
                            className={styles.dateInput}
                        />
                    </div>

                    <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
                    <button onClick={onSaveClick} className={styles.saveButton}>Save</button>
                </div>
            </div>
        </div>
    );
}