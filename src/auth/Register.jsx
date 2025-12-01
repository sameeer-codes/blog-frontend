import React, { useState } from "react";
import { register } from "../services/auth";
import useApi from "../utils/useApi";

function Register() {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const api = useApi();

    let handleUsername = (e) => setUsername(e.target.value);
    let handleEmail = (e) => setEmail(e.target.value);
    let handlePassword = (e) => setPassword(e.target.value);

    const submitRegister = async (e) => {
        e.preventDefault()

        const registerData = {
            'username': username,
            'email': email,
            'password': password
        }

        const response = api.post('/auth/register', registerData);
        if (await response.status) {
            console.log(await response.data)
        } else {
            console.log(console.log(await response.error));
        }
    }

    return <>
        <div className="h-screen w-full grid place-items-center  bg-gray-200 p-4">
            <form className="flex flex-col w-full max-w-100 p-8  bg-white rounded-md gap-4 shadow-md" onSubmit={submitRegister}>
                <h2 className="text-center text-4xl font-medium mb-4 pb-4 border-b-2 border-b-blue-700">Register</h2>
                <input type="text" placeholder="Enter your Username" className="w-full border p-2 px-3 rounded-sm border-gray-300" onChange={handleUsername} value={username} />
                <input type="email" placeholder="Enter your Email" className="w-full border p-2 px-3 rounded-sm border-gray-300" onChange={handleEmail} value={email} />
                <input type="password" placeholder="Enter your Password" className="w-full border p-2 px-3 rounded-sm border-gray-300" onChange={handlePassword} value={password} />
                <p className="text-sm">By Signing up, you agree to our privacy policy and terms and conditions.</p>
                <button type="Submit" className="p-2 bg-blue-700 rounded-md text-white cursor-pointer uppercse font-medium">Register Now</button>
            </form>
        </div>
    </>
}

export default Register;