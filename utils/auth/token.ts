export const returnExpiryDate = () => {
    if(typeof window !== 'undefined'){
        if(localStorage.getItem('expiresIn')){ 
            return localStorage.getItem('expiresIn')
        }
        return ''
    }
    return ''
}

export const clearSession = (): void =>{
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
}
