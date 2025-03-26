export async function onRequestPost(context) {
  const data = await context.request.json()
  const email = data["email"]
  const password = data["password"]
  
  const ps = context.env.LearningDB
      .prepare("SELECT * from Users WHERE email = ? AND password = ?")
      .bind(email, password)
  const response = await ps.first()
  if(response){
    return Response.json({
      "message": "Logged in sucessfully."
    });
  }else{
    return Response.json({
      "error": "Incorrect email or password."
    })
  }
}