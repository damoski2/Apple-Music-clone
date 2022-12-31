export const persistTokens = (_tokenType: string, token: any)=>{
   switch(_tokenType){
         case 'SET_ACCESS_TOKEN':
            localStorage.setItem('accessToken', token)
            break;

        case 'SET_REFRESH_TOKEN':
            localStorage.setItem('refreshToken', token)
            break;

        case 'SET_EXPIRES_IN':
            localStorage.setItem('expiresIn', token)
            break;

        case 'SET_AUTH_CODE':
            localStorage.setItem('auth_code', token)
            break;

        default:
            break;
   }
}

export const checkPersistedTokens = (_tokenType: string)=>{
    switch(_tokenType){
        case 'SET_ACCESS_TOKEN':
            return localStorage.getItem('accessToken')

        case 'SET_REFRESH_TOKEN':
            return localStorage.getItem('refreshToken')

        case 'SET_EXPIRES_IN':
            return localStorage.getItem('expiresIn')

        case 'SET_AUTH_CODE':
            return localStorage.getItem('auth_code')

        default:
            return null
    }
}

export const isSessionUser = (expire_in: number): boolean=>{
    if(!expire_in) return false;
   /*  console.log(((expire_in - 60) * 1000)+ Date.now()  > Date.now())
    console.log(((expire_in - 60) * 1000)+ Date.now(), Date.now()) */
    return ((expire_in - 60) * 1000)+ Date.now()  > Date.now()
}



/* if(_tokenType === 'SET_ACCESS_TOKEN'){
    localStorage.setItem('accessToken', token)
}
if(_tokenType === 'SET_REFRESH_TOKEN'){
    localStorage.setItem('refreshToken', token)
}
if(_tokenType === 'SET_EXPIRES_IN'){
    localStorage.setItem('expiresIn', token)
} */