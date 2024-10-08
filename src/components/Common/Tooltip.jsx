import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { HorizontalWrapper } from "./Wrapper";

const Wrapper = styled(HorizontalWrapper)`
    gap: 5px;

    & > i {
        cursor: help;
    }
`;

const TextWrapper = styled.div`
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    animation: fadeIn 0.3s ease-in-out;
    background-color: #fff;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;

    &::before {
        content: '';
        position: absolute;
        top: -10px; /* 삼각형의 높이만큼 위로 이동 */
        left: 10px; /* 삼각형의 위치 조정 */
        border-width: 0 10px 10px 10px; /* 삼각형의 크기 설정 */
        border-style: solid;
        border-color: transparent transparent #fff transparent; /* 삼각형의 색상 설정 */
    }

    & > span {
        line-height: 1.5;

        & > i {
            color: #007BFF;
        }
    }
`;

export default function Tooltip({ title, text }) {

    const [ textPosition, setTextPosition ] = useState(null);

    const wrapperRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const handleMouseOver = () => {
            if (wrapperRef.current && textRef.current) {
                textRef.current.style.top = `${textPosition.bottom + 20}px`;
                textRef.current.style.left = `${textPosition.right + -30}px`;
                textRef.current.style.display = 'block';
            }
        };

        const handleMouseOut = () => {
            if (textRef.current) {
                textRef.current.style.display = 'none';
            }
        };

        const iconElement = wrapperRef.current;
        if (iconElement) {
            if (!textPosition) {
                const iconRect = wrapperRef.current.getBoundingClientRect();
                setTextPosition({ bottom: iconRect.bottom, right: iconRect.right });
            }

            iconElement.addEventListener('mouseover', handleMouseOver);
            iconElement.addEventListener('mouseout', handleMouseOut);
        }

        return () => {
            if (iconElement) {
                iconElement.removeEventListener('mouseover', handleMouseOver);
                iconElement.removeEventListener('mouseout', handleMouseOut);
            }
        };
    }, [ textPosition ]);

    return (
        <Wrapper ref={ wrapperRef }>
            <span>{ title }</span>

            <i className="fa-solid fa-circle-question"></i>
            {
                createPortal(
                    <TextWrapper ref={ textRef }><span>{ text }</span></TextWrapper>,
                    document.body
                )
            }
            
        </Wrapper>
    )
}