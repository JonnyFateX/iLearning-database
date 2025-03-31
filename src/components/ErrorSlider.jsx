import { HiOutlineXMark } from "react-icons/hi2";

import "./ErrorSlider.css"

export default function ErrorSlider({visible, toggleError, children}){
    return (
        <div className={`error-card ${visible? "error-visible": "error-hidden"}`}>
            <h1>{children}</h1>
            <button onClick={toggleError}>
                <HiOutlineXMark className="error-icon"/>
            </button>
        </div>
    )
}