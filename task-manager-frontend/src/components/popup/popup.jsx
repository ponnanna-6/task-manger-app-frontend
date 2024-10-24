import { useState } from 'react';
import styles from './popup.module.css';

export default function Popup({message, cancelButtonText, confirmButtonText, isOpen, onClose, onConfirm, from}) {
    if (!isOpen) return null;
    const [email, setEmail] = useState("");

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
                <p className={styles.popupText}>{message}</p>
                {from == "addPeople" && <input 
                    className={styles.inputContainer}
                    type="email"
                    placeholder="Enter the email"
                    onChange={(e) => setEmail(e.target.value)}
                    />
                }
                {from == "addPeople" 
                    ? <div className={styles.popupButtons} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <button className={styles.closeButton} onClick={onClose}>{cancelButtonText}</button>
                        <button className={styles.confirmButton} onClick={() => onConfirm(email)}>{confirmButtonText}</button>
                    </div>
                    : <div className={styles.popupButtons}>
                        <button className={styles.confirmButton} onClick={onConfirm}>{confirmButtonText}</button>
                        <button className={styles.closeButton} onClick={onClose}>{cancelButtonText}</button>
                    </div>
                }
            </div>
        </div>
    );
}
