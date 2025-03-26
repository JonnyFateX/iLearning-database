import {
    MaterialReactTable,
    useMaterialReactTable
  } from 'material-react-table';
import { useState, useMemo, useEffect } from 'react';
import { FaLock, FaUnlock, FaTrash } from "react-icons/fa";

export default function Table(){
    const [data, setTableData] = useState([
        {
            id: "1",
            name: "Jonathan",
            email: "xd",
            lastSeen: "yesterday"
        },
        {
            id: "2",
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
        async function onDeletePress(){
            const rowIds = Object.keys(rowSelection)
            const ids = rowIds.map(id => {
                return data[id].id
            })
            await fetch("/api/users", {
                method: "DELETE",
                body: JSON.stringify({ids: ids.join(", ")})
            })
            setTableData(prevTableData => {
                ids.forEach(id => {
                    const tableDataIndex = prevTableData.findIndex(element => element.id === id)
                    prevTableData.splice(tableDataIndex, 1)
                })
                return [...prevTableData]
            })
            
        }
        function onBlockPress(){

        }
        function onUnblockPress(){

        }
    
        return (
            <section>
                <div className='buttons-row'>
                    <button onClick={onBlockPress} className='icon-btn blue'><span><FaLock/> Block</span></button>
                    <button onClick={onUnblockPress} className='icon-btn blue'><span><FaUnlock/> Unblock</span></button>
                    <button onClick={onDeletePress} className='icon-btn red'><FaTrash/></button>
                </div>
                <MaterialReactTable table={table}/>
            </section>
        )
    }
    
}