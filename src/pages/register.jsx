import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { validate } from "email-validator"
import ErrorSlider from "../components/ErrorSlider"

export default function Register(){
    const [error, setError] = useState({visible: false})
    const navigate = useNavigate()
    const [data, setData] = useState({
        name: "",
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
        if(data.email === "" || data.password === "" || data.name === ""){
            toggleError("Fill every field correctly.")
            return
        }
        if(!emailValid){
            toggleError("Valid email required.")
            return
        }
        const response = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify(data)
        })
        const jsonData = await response.json()
        if(jsonData["error"]){
            if(jsonData["error"].includes("exists")){
                toggleError("Email already in use.")
            }else{
                toggleError("Couldn't create account, try again.")
            }
            
        }else{
            navigate("/login", {replace:true})
        }
    }

    return (
        <>
            <main>
                <div className="card">
                    <h1>iLearning</h1>
                    <h2>Sign up to iLearning</h2>
                    <form
                        onChange={handleChange}
                        onSubmit={onSubmit}
                    >
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="name" placeholder="Jonathan"/>
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" id="email" placeholder="hello@ilearning.com"/>
                        <label htmlFor="password">Password</label>
                        <input type="text" name="password" id="password" placeholder="******"/>
                        <button>Register</button>
                    </form>
                    <span>Already have an account? <a href="/login">Login here</a></span>
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