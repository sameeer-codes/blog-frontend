import React, { useContext, useEffect, useState } from "react";
import { login } from "../services/auth";
import { AuthContext } from "../context/authContext";

function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { token, setToken } = useContext(AuthContext)

    useEffect(function () {
        console.log(token);
    }, [token])

    let handleEmail = (e) => setEmail(e.target.value);
    let handlePassword = (e) => setPassword(e.target.value);

    async function handleLogin(e) {
        e.preventDefault()

        const loginData = {
            'email': email,
            'password': password
        }
        const response = await login(loginData);

        if (response.status === "success") {
            const { data, message } = response;
            setToken(data.jwt)
        }

        else {
            console.log(response);
        }

        setEmail('');
        setPassword('');
    }

    return <>
        <div className="h-screen w-full grid place-items-center  bg-gray-200 p-4">
            <form className="flex flex-col w-full max-w-100 p-8  bg-white rounded-md gap-4 shadow-md" onSubmit={handleLogin}>
                <h2 className="text-center text-4xl font-medium mb-4 pb-4 border-b-2 border-b-blue-700">Login</h2>
                <input type="email" placeholder="Enter your Email" className="w-full border p-2 px-3 rounded-sm border-gray-300" onChange={handleEmail} value={email} />
                <input type="password" placeholder="Enter your Password" className="w-full border p-2 px-3 rounded-sm border-gray-300" onChange={handlePassword} value={password} />
                <div>
                    <button className="text-blue-700 hover:text-blue-900 transition-all cursor-pointer">Forgot Password?</button>
                </div>
                <button type="Submit" className="p-2 bg-blue-700 rounded-md text-white cursor-pointer hover:bg-blue-900 transition-all font-medium uppercase">Login</button>
            </form>
        </div>
    </>
}

export default Login;