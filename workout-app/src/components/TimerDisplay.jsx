import React from 'react';

const formatTime = (seconds) => {
    const rounded = Math.ceil(seconds);
    const mins = Math.floor(rounded / 60).toString().padStart(2, '0');
    const secs = (rounded % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

export const TimerDisplay = ({
    type,
    isWork,
    isActive,
    time,
    totalTime,
    repetition,
    totalRepetitions
}) => {
    const percentage = (time / totalTime) * 100;
    const drain = 100 - Math.max(0, Math.min(100, percentage));

    const style = getComputedStyle(document.body);
    const colors = {
        primary: style.getPropertyValue('--primary-color').trim(),
        rest: style.getPropertyValue('--rest-color').trim(),
        background: style.getPropertyValue('--background-color').trim(),
        text: style.getPropertyValue('--text-color').trim(),
        white: style.getPropertyValue('--white').trim()
    };

    const background = isActive
        ? (isWork
            ? `linear-gradient(to bottom, ${colors.background} ${drain}%, ${colors.primary} ${drain}%)`
            : `linear-gradient(to bottom, ${colors.background} ${drain}%, ${colors.rest} ${drain}%)`
          )
        : colors.background; // No fill, just background color

    const titleStyle = isActive
        ? { backgroundImage: `linear-gradient(to bottom, ${colors.text} ${drain}%, ${colors.white} ${drain}%)` }
        : { color: '#808080' }; // Medium grey text
    
    return (
        <div 
            id={`${type}-interval-display`} 
            className={`interval-display ${isActive ? '' : 'inactive'}`} 
            style={{ background }}
        >
            <h2 style={titleStyle}>
                {type.toUpperCase()}
                {isWork && <span id="rep-counter">({repetition}/{totalRepetitions})</span>}
            </h2>
            <p className="interval-time" style={titleStyle}>
                {formatTime(time)}
            </p>
        </div>
    );
};
