import { useState } from 'react';
import styles from './popup.module.css';
import { validateEmail } from '../../helper/utils';

export default function Popup({message, cancelButtonText, confirmButtonText, isOpen, onClose, onConfirm, from}) {
    if (!isOpen) return null;
    const [email, setEmail] = useState("");
    const [errorEmail, setErrorEmail] = useState(false);

    const onAddPeople = (email) => {
        if(!validateEmail(email)) {
            setErrorEmail(true);
            return;
        } else {
            onConfirm(email);
        }
    }

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
                <p className={styles.popupText}>{message}</p>
                {from == "addPeople" && 
                    <div>
                    <input 
                        className={styles.inputContainer}
                        type="email"
                        placeholder="Enter the email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrorEmail(false);
                        }}
                    />
                        {errorEmail && <p className={styles.error}>Enter valid email address</p>}
                    </div>
                }
                {from == "addPeople" 
                    ? <div className={styles.popupButtons} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <button className={styles.closeButton} onClick={onClose}>{cancelButtonText}</button>
                        <button className={styles.confirmButton} onClick={() => onAddPeople(email)}>{confirmButtonText}</button>
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
