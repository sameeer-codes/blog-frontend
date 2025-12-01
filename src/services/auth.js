const baseApi = import.meta.env.VITE_API_URL;

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
        const response = await fetch(`${baseApi}/login`, {
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

export const getJwt = async () => {
    const response = await fetch(`${baseApi}/refresh-token`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const result = await response.json()
    return result;
}