import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { validate } from "email-validator"
import ErrorSlider from "../components/ErrorSlider"

export default function Login(){
    const [error, setError] = useState({visible: false})
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "",
        password: ""
    })

    function handleChange(event) {
        setData(prevData => {
            return {
                ...prevData,
                [event.target.name]: event.target.value
            }
        })
    }

    function toggleError(message){
        if(error.visible){
            setError(prevError => {
                return {...prevError, visible: false}
            })
        } else{
            setError({visible: true, message: message})
            setTimeout(() => {
                setError(prevError => {
                    return {...prevError, visible: false}
                })
            }, 5000)
        }
    }

    async function onSubmit(event){
        event.preventDefault()
        const emailValid = validate(data.email)
        if(!emailValid){
            toggleError("Email not valid.")
            return
        }
        const response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(data)
        })
        const jsonData = await response.json()
        if(jsonData["error"]){
            toggleError("Email or password are incorrect.")
        }else{
            navigate("/", {replace:true, state: JSON.stringify(jsonData)})
        }
    }
    
    return (
        <>
            <main>
                <div className="card">
                    <h1>iLearning</h1>
                    <h2>Sign in to app</h2>
                    <form
                        onChange={handleChange}
                        onSubmit={onSubmit}
                    >
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" id="email" placeholder="hello@ilearning.com"/>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="******"/>
                        <button>Enter</button>
                    </form>
                    <span>Don't have an account? <a href="/register">Register here</a></span>
                </div>
            </main>
            {
                error.message?
                <ErrorSlider 
                    visible={error.visible} 
                    toggleError={toggleError}
                >
                    {error.message}
                </ErrorSlider>
                :
                null
            }
        </>
        
        
    )
}