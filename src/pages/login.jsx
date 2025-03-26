import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { validate } from "email-validator"

export default function Login(){
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

    async function onSubmit(event){
        event.preventDefault()
        const emailValid = validate(data.email)
        if(!emailValid){
            return
        }
        const response = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(data)
        })
        const jsonData = await response.json()
        if(jsonData["error"]){
            console.log("Email or password are incorrect.")
        }else{
            navigate("/", {replace:true, state: JSON.stringify(jsonData)})
        }
    }
    
    return (
        <div className="card">
            <h1>iLearning</h1>
            <h2>Sign in to app</h2>
            <form
                onChange={handleChange}
                onSubmit={onSubmit}
            >
                <label htmlFor="">Email</label>
                <input type="text" name="email" id="email" placeholder="hello@ilearning.com"/>
                <label htmlFor="">Password</label>
                <input type="password" name="password" id="password" placeholder="******"/>
                <button>Enter</button>
            </form>
            <span>Don't have an account? <a href="/register">Register here</a></span>
        </div>
    )
}