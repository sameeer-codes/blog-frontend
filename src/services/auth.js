const baseApi = 'http://localhost:8800/api/auth';

export const register = async (formData) => {
    try {
        const response = await fetch(`${baseApi}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const result = await response.json()
        return result;
    }
    catch (error) {
        return error;
    }
}

export const login = async (loginData) => {
    try {
        const response = await fetch(`http://localhost:8800/api/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })

        const result = await response.json();
        return result;
    }
    catch (error) {
        return error;
    }
}