import { Dispatch } from 'react'
import { DispatchType } from '../../interface'

export const setTokenSession = (data: any, dispatch: Dispatch<DispatchType>, _type: string)=>{
    dispatch({
        type: _type,
        payload: data
    })
}