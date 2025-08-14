import React, { useState, useEffect, useRef } from 'react';
import styles from './PostModal.module.css'

const PostModal = ({ onClose, children }) => {
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default PostModal;