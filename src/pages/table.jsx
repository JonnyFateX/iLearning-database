import {
    MaterialReactTable,
    useMaterialReactTable
  } from 'material-react-table';
import { useState, useMemo, useEffect } from 'react';
import { FaLock, FaUnlock, FaTrash } from "react-icons/fa";

export default function Table(){
    const [data, setTableData] = useState([
        {
            name: "Jonathan",
            email: "xd",
            lastSeen: "yesterday"
        },
        {
            name: "Ricky",
            email: "yes",
            lastSeen: "tomorrow"
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
            header: 'Last Seen',
            accessorKey: 'lastSeen', 
        },
        ], []
    )

    const [rowSelection, setRowSelection] = useState({});
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
    }, [])

    if(data === null){
        return <h1>Retrieving users...</h1>
    }
        
    if(data.length === 0){
        return <h1>No users found.</h1>
    }

    if(data){
        function onGetPress(){

        }
        function onPostPress(){
            fetch("/api/users", {
                method: "POST",
                body: JSON.stringify({
                    name: "Diana",
                    email: "dian@gmail.com",
                    password: "pass",
                }),
                
            })
                .then(res => res.text())
                .then(data => console.log(data))
        }
        function onPutPress(){
            fetch("/api/users", {
                method: "PUT",
                body: JSON.stringify({
                    id: "2",
                }),
                
            })
                .then(res => res.text())
                .then(data => console.log(data))
            }
        
    
        return (
            <section>
                <div className='buttons-row'>
                    <button className='icon-btn blue'><span><FaLock/> Block</span></button>
                    <button className='icon-btn blue'><span><FaUnlock/> Unblock</span></button>
                    <button className='icon-btn red' onClick={onGetPress}><FaTrash/></button>
                </div>
                <MaterialReactTable table={table}/>
            </section>
        )
    }
    
}