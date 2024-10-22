import { useState } from 'react';
import styles from './popup.module.css';

export default function Popup({message, cancelButtonText, confirmButtonText, isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
                <p className={styles.popupText}>{message}</p>
                <div className={styles.popupButtons}>
                    <button className={styles.confirmButton} onClick={onConfirm}>{confirmButtonText}</button>
                    <button className={styles.closeButton} onClick={onClose}>{cancelButtonText}</button>
                </div>
            </div>
        </div>
    );
}
