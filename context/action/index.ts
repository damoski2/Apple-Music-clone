export * from './authAction'
export * from './audioAction'
import { Dispatch } from "react";
import { DispatchType } from '../../interface'


export const handleSetLoader = (
    _payload: boolean,
    dispatch: Dispatch<DispatchType>
  ): ReturnType<() => void> => {
    dispatch({
      type: "LOADING_PAGE",
      payload: _payload,
    });
  };