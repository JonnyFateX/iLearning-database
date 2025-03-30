export async function onRequestPost(context){
    const data = await context.request.json()
    const id = data["id"]
    const ids = data["ids"]?.split(", ")
    const blockStatus = data["blockStatus"]

    //Prevent blocked users from making a request
    const checkBlock = context.env.LearningDB
        .prepare("SELECT blockStatus FROM Blocked WHERE userId = ?")
        .bind(id)
    const checkBlockResponse = await checkBlock.first()
    if(checkBlockResponse.blockStatus === 1){
        return Response.json({
            error: "Blocked user"
        })
    }
    //

    //Prevent deleted users from making a request
    const checkUser = context.env.LearningDB
        .prepare("SELECT lastSeen FROM Users WHERE id = ?")
        .bind(id)
    const checkUserResponse = await checkUser.first()
    if(!checkUserResponse){
        return Response.json({
            error: "Deleted user"
        })
    }
    //

    if(!ids){
        return Response.json({
            message: "No users to block"
        })
    }

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