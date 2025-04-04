export async function onRequestGet(context) {
  const ps = context.env.LearningDB
    .prepare("SELECT Users.id, Users.name, Users.email, Users.lastSeen, Blocked.blockStatus FROM Users LEFT JOIN Blocked ON Users.id = Blocked.userId")
  const data = await ps.run();

  if(data){
    return Response.json(data["results"])
  }else{
    return Response.json({
      "error": "No users found."
    });
  }
}

//Register user with POST
export async function onRequestPost(context){
  if(context.functionPath === "/api/users"){
    const data = await context.request.json()
    const name = data["name"]
    const email = data["email"]
    const password = data["password"]

    let date = new Date().toString()
    const lastSeen = date.substring(0, date.indexOf("(") - 1)

    const ps = context.env.LearningDB
      .prepare("SELECT * from Users WHERE email = ?")
      .bind(email)
    const response = await ps.first()

    if(!response){
      const insertion = context.env.LearningDB
        .prepare("INSERT INTO Users (name, email, password, lastSeen) VALUES (?, ?, ?, ?) RETURNING id;")
        .bind(name, email, password, lastSeen)
      const insertionResponse = await insertion.first()
      if(insertionResponse.id){
        const blockedInsertion = context.env.LearningDB
          .prepare("INSERT INTO Blocked (userId, blockStatus) VALUES (?, 0)")
          .bind(insertionResponse.id)
        await blockedInsertion.run()
        return Response.json({
          "message":"User registered."
        })
      }else{
        return Response.json({
          "error":"User not created, try again."
        })
      }
      
    }else{
      return Response.json({
        "error": "User already exists."
      })
    } 
  }
}

//Update last seen with PUT
export async function onRequestPut(context){
  const data = await context.request.json()
  const id = data["id"]

  const ps = context.env.LearningDB
      .prepare("SELECT id from Users WHERE id = ?")
      .bind(id)
  const response = await ps.first()
  
  if(response){
    const date = new Date().toString()
    const newDate = date.substring(0, date.indexOf("(") - 1)
    const ps2 = context.env.LearningDB
      .prepare("UPDATE Users SET lastSeen = ? WHERE id = ?")
      .bind(newDate, id)
    const dateResponse = await ps2.first()
    if(!dateResponse){
      return Response.json({
        "message": "lastSeen updated."
      })
    }else{
      return Response.json({
        "error": "lastSeen not updated."
      })
    }
    
  }else{
    return Response.json({
        "error": "User not found."
      })
  }
}

export async function onRequestDelete(context){
  const data = await context.request.json()
  const ids = data["ids"]
  const id = data["id"]
  const blockResponse = await fetch(`${context.request.headers.get("origin")}/api/block`, {
    method: "POST",
    body: JSON.stringify({id: id})
  })
  const blockData = await blockResponse.json()
  if(blockData["error"]){
    console.log(blockData["error"])
    return Response.json({
      error: blockData["error"]
    })
  }

  const ps = context.env.LearningDB
      .prepare(`DELETE FROM users WHERE id IN (${ids})`)
  const response = await ps.run()
  return Response.json({
    response
  })
}