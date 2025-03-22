import {
    MaterialReactTable,
    useMaterialReactTable,
  } from 'material-react-table';
import { useState, useMemo, useEffect } from 'react';

/* const data = [
    {
        name: 'John',
        age: 30,
    },
    {
        name: 'Sara',
        age: 25,
    }
] */

export default function Table(){
    useEffect(() => {
        fetch("/api/beverages")
            .then(res => res.text())
            .then(data => console.log(data))
    }, [])

    const [data, setTableData] = useState([
        {
            name: 'Sara',
            email: 'sara@gmail.com',
            last_seen: 20,
        },
        {
            name: 'John',
            email: 'jc@gmail.com',
            last_seen: 22,
        }
    ])

    if(!data) return (
        <h1>No data</h1>
    )

    if(data){
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
                accessorKey: 'last_seen', 
            },
            ], []
        )

        const table = useMaterialReactTable({
            columns,
            data,
            enableRowSelection: true,
            enableColumnOrdering: true,
            enableGlobalFilter: false, 
        })
    
        return (
            <section>
                <MaterialReactTable table={table}/>
            </section>
        )
    }
    
}