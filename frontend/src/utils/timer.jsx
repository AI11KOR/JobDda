import React, { useState, useEffect, useRef } from 'react';


const TimeBox = ({ isCounting, onTimeout }) => {
    const [timeLeft, setTimeLeft] = useState(180);
    const calledTimeoutRef = useRef(false);
    const timeRef = useRef(null);

    useEffect(() => {
        if(isCounting) {
            if(timeRef.current) return;

            setTimeLeft(180);
            calledTimeoutRef.current = false;

            timeRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if(prev <= 1) {
                        clearInterval(timeRef.current);
                        timeRef.current = null;

                        if(!calledTimeoutRef.current) {
                            onTimeout();
                            calledTimeoutRef.current = true;
                        }
                        return 0;
                    }
                    return prev - 1;
                })
            }, 1000);
        }

        return () => {
            if(!isCounting && timeRef.current) {
                clearInterval(timeRef.current);
                timeRef.current = null;
            }
        };
    }, [isCounting, onTimeout])

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div style={{ color: 'red', fontSize: '12px' }}>
            남은시간 {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
    )
}

export default TimeBox;