import { Outlet, Navigate, useLocation} from "react-router-dom"

export default function AuthRequired(){
    const location = useLocation()
    const state = location.state
    if(state){
        const jsonState = JSON.parse(state)
        if(jsonState["message"] === "Logged in sucessfully."){
            return (
                <Outlet />
            )
        }else{
            return <Navigate 
                to="/login" 
                replace
            />
        }
    }else{
        return <Navigate 
            to="/login" 
            replace
        />
    }
}