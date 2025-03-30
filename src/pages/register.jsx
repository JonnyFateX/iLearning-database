import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { validate } from "email-validator"

export default function Register(){
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

    async function onSubmit(event){
        event.preventDefault()
        const emailValid = validate(data.email)
        if(!emailValid){
            return
        }
        const response = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify(data)
        })
        const jsonData = await response.json()
        if(jsonData["error"]){
            console.log("Couldn't create user, try again.")
        }else{
            navigate("/login", {replace:true})
        }
    }

    return (
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
    )
}