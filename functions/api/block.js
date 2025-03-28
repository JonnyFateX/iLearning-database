export async function onRequest(context){
    //const data = await context.request.json()
    //const id = data["id"]

    const id = "2"
    const ps = context.env.LearningDB
        .prepare("INSERT OR REPLACE INTO Blocked (userId, blockStatus) VALUES (?, ?)")
        .bind(id, "0")
    const response = await ps.run()

    console.log(response)
    

    if(response.success){
        return Response.json({
            message: "Block Status updated successfully."
        })
    }else{
        return Response.json({
            error: "Block Status not updated."
        })
    }
    /*const ps = context.env.LearningDB
      .prepare("SELECT blockStatus from Blocked WHERE userId = ?")
      .bind(id)
    const response = await ps.first()

    if(!response){
        const ps2 = context.env.LearningDB
            .prepare("INSERT INTO Blocked (userId, blockStatus) VALUES (?, 0)")
            .bind(id)
        await ps2.run()
        return Response.json({
            "blockStatus": "0"
        })
    }else{
        return Response.json({
            "blockStatus": response["blockStatus"]
        })
    }*/
}

export async function onRequestPut(context){
    const data = await context.request.json()
    const ids = data["ids"]
    const blockStatus = data["blockStatus"]

    const ps = context.env.LearningDB
      .prepare(`UPDATE Blocked SET blockStatus = ? WHERE userId IN (${ids})`)
      .bind(blockStatus)
    await ps.run()
    
    return Response.json({
        "message": "Block status updated."
    })
}