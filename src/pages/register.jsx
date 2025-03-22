export default function Register(){
    return (
        <div className="card">
            <h1>iLearning</h1>
            <h2>Sign up to iLearning</h2>
            <form>
                <label htmlFor="">Email</label>
                <input type="text" name="email" id="email" placeholder="hello@ilearning.com"/>
                <label htmlFor="">Password</label>
                <input type="text" name="password" id="password" placeholder="******"/>
            </form>
            <button>Register</button>
            <span>Already have an account? <a href="/login">Login here</a></span>
        </div>
    )
}