import { Routes, Route } from "react-router";

import AuthRequired from "./AuthRequired";
import Login from './pages/login'
import Register from './pages/register'
import Table from './pages/table'
import './index.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthRequired/>}>
        <Route index element={<Table/>}/>
      </Route>
      <Route path="login" element={<Login/>}></Route>
      <Route path="register" element={<Register/>}></Route>
    </Routes>
  )
}