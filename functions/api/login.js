export async function onRequestPost(context) {
  const data = await context.request.json()
  const email = data["email"]
  const password = data["password"]
  
  const ps = context.env.LearningDB
      .prepare("SELECT Users.id from Users JOIN Blocked ON Users.id = Blocked.userId WHERE Users.email = ? AND Users.password = ? AND Blocked.blockStatus != 1")
      .bind(email, password)
  const response = await ps.first()
  if(response){
    const date = new Date().toString()
    const newDate = date.substring(0, date.indexOf("(") - 1)
    const ps2 = context.env.LearningDB
      .prepare("UPDATE Users SET lastSeen = ? WHERE email = ?")
      .bind(newDate, email)
    await ps2.first()

    return Response.json({
      "message": "Logged in sucessfully.",
      id: response.id
    })
  }else{
    return Response.json({
      "error": "Log in unsuccessful."
    })
  }
}