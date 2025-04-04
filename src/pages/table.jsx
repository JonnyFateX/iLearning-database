import {
    MaterialReactTable,
    useMaterialReactTable
  } from 'material-react-table';
import { useState, useMemo, useEffect } from 'react';
import { FaLock, FaUnlock, FaTrash, FaCheck } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router';
import ErrorSlider from "../components/ErrorSlider"

export default function Table(){
    const [message, setMessage] = useState({visible: false})
    const location = useLocation()
    const navigate = useNavigate()
    const [fetchTrigger, setFetchTrigger] = useState(false)
    const [rowSelection, setRowSelection] = useState({})
    const [data, setTableData] = useState([
        {
            id: "1",
            name: "Jonathan",
            email: "jonathanmtzcon@gmail.com",
            blockStatus: "0",
            lastSeen: "Tue Mar 25 2025 22:11:41 GMT-0600"
        },
    ])
    const columns = useMemo(() => [
        {
            header: 'Name',
            accessorKey: 'name', 
        },
        {
            header: 'Email',
            accessorKey: 'email', 
        },
        {
            header: 'Status',
            accessorKey: 'blockStatus',
            accessorFn: (row) => {
                if(row.blockStatus === 1){
                    return (
                        <span className='table-blocked'><FaLock style={{color: "red"}}/> Blocked</span>
                    )
                }else{
                    return (
                        <span className='table-blocked'><FaCheck style={{color: "green"}}/> Available</span>
                    )
                }
            }, 
        },
        {
            header: 'Last Seen',
            accessorKey: 'lastSeen', 
            accessorFn: (row) => {
                const newDate = new Date(row.lastSeen)
                return newDate.toLocaleTimeString() + "\n" + newDate.toLocaleDateString('en-US')
            }
        },
        ], []
    )

    const table = useMaterialReactTable({
        columns,
        data,
        enableRowSelection: true,
        enableColumnOrdering: true,
        enableGlobalFilter: false,
        onRowSelectionChange: setRowSelection,
        state: {rowSelection}
    })
    

    useEffect(() => {  
        fetch("/api/users")
                .then(res => res.json())
                .then(data => {
                    if(data){
                        setTableData(data)
                    }else{
                        setTableData([])
                    }
                })
    }, [fetchTrigger])

    useEffect(() => {  
        const handleBeforeUnload = (event) => {
            window.history.replaceState({}, '')
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, [])

    if(data === null){
        return <h1>Retrieving users...</h1>
    }
        
    if(data.length === 0){
        return <h1>No users found.</h1>
    }

    if(data){
        function toggleMessage(message){
            if(message.visible){
                setMessage(prevMessage => {
                    return {...prevMessage, visible: false}
                })
            } else{
                setMessage({visible: true, message: message})
                setTimeout(() => {
                    setMessage(prevMessage => {
                        return {...prevMessage, visible: false}
                    })
                }, 5000)
            }
        }

        function getIds(){
            const rowIds = Object.keys(rowSelection)
            const ids = rowIds.map(id => {
                return data[id].id
            })
            return ids
        }

        async function onError(response){
            const responseJSON = await response.json()
            const error = responseJSON.error? responseJSON.error: ""
            if(error.includes("Blocked") || error.includes("Deleted")){
                window.history.replaceState({}, '')
                navigate("/login")
            }else{

            }
        }

        async function onDeletePress(){
            const ids = getIds()
            const response = await fetch("/api/users", {
                method: "DELETE",
                body: JSON.stringify({
                    id: (JSON.parse(location.state)).id,
                    ids: ids.join(", ")
                })
            })
            await onError(response)
            setRowSelection({})
            setFetchTrigger(prevFetchTrigger => !prevFetchTrigger)
            toggleMessage("Users deleted successfully.")
        }
        async function onBlockPress(){
            const ids = getIds()
            const response = await fetch("/api/block", {
                method: "POST",
                body: JSON.stringify({
                    id: (JSON.parse(location.state)).id,
                    ids: ids.join(", "),
                    blockStatus: '1'
                })
            })
            await onError(response)
            setRowSelection({})
            setFetchTrigger(prevFetchTrigger => !prevFetchTrigger)
            toggleMessage("Users blocked successfully.")
        }
        async function onUnblockPress(){
            const ids = getIds()
            const response = await fetch("/api/block", {
                method: "POST",
                body: JSON.stringify({
                    id: (JSON.parse(location.state)).id,
                    ids: ids.join(", "),
                    blockStatus: '0'
                })
            })
            await onError(response)
            setRowSelection({})
            setFetchTrigger(prevFetchTrigger => !prevFetchTrigger)
            toggleMessage("Users unblocked successfully.")
        }
        //
        return (
            <>
                <main className="center-main">
                    <section>
                        <div className={`buttons-row ${Object.keys(rowSelection).length !== 0? "":"invisible"}`}>
                            <button onClick={onBlockPress} className='icon-btn blue'><span><FaLock/> Block</span></button>
                            <button onClick={onUnblockPress} className='icon-btn blue'><span><FaUnlock/> Unblock</span></button>
                            <button onClick={onDeletePress} className='icon-btn red'><FaTrash/></button>
                        </div>
                        <MaterialReactTable table={table}/>
                    </section>
                </main>
                {
                    message.message?
                    <ErrorSlider
                        successClass={true}
                        visible={message.visible} 
                        toggleError={toggleMessage}
                    >
                        {message.message}
                    </ErrorSlider>
                    :
                    null
                }
            </>
        )
    }
    
}