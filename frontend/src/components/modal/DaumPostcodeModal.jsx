import React, { useState, useEffect, useRef } from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode'
import PostModal from './PostModal'

const DaumPostcodeModal = ({ onClose, onComplete }) => {
    const handleComplete = (data) => {
        onComplete(data);
        onClose();
    }

    return (
        <PostModal onClose={onClose}>
            <DaumPostcodeEmbed onComplete={handleComplete} />
        </PostModal>
    )
}

export default DaumPostcodeModal;