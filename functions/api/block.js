export async function onRequestPost(context){
    const data = await context.request.json()
    const ids = data["ids"].split(", ")
    const blockStatus = data["blockStatus"]

    const blockStatement = "(" + ids.map(id => {
        return id.toString() + ", " + blockStatus.toString()
    }).join("), (") + ")"

    const ps = context.env.LearningDB
        .prepare(`INSERT OR REPLACE INTO Blocked (userId, blockStatus) VALUES ${blockStatement}`)
    const response = await ps.run()

    if(response.success){
        return Response.json({
            message: "Block Status updated successfully."
        })
    }else{
        return Response.json({
            error: "Block Status not updated."
        })
    }
}