import { millsecondstoISODateconverter } from '../../utils'


export const persistTokens = (_tokenType: string, token: any)=>{
   switch(_tokenType){
         case 'SET_ACCESS_TOKEN':
            localStorage.setItem('accessToken', token)
            break;

        case 'SET_REFRESH_TOKEN':
            localStorage.setItem('refreshToken', token)
            break;

        case 'SET_EXPIRES_IN':
            let _expiresIn: any = millsecondstoISODateconverter(token)
            localStorage.setItem('expiresIn', _expiresIn)
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

export const isSessionUser = (expire_in: any): boolean=>{
    if(!expire_in) return false;

    //console.log('check dates', new Date(expire_in) > new Date(Date.now()+3600000))
   return new Date(expire_in) > new Date(Date.now()+3600000);
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