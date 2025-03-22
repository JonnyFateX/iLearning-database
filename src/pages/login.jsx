export default function Login(){
    return (
        <div className="card">
            <h1>iLearning</h1>
            <h2>Sign in to app</h2>
            <form>
                <label htmlFor="">Email</label>
                <input type="text" name="email" id="email" placeholder="hello@ilearning.com"/>
                <label htmlFor="">Password</label>
                <input type="text" name="password" id="password" placeholder="******"/>
            </form>
            <button>Enter</button>
            <span>Don't have an account? <a href="/register">Register here</a></span>
        </div>
    )
}