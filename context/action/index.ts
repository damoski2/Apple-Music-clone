export * from './authAction'
export * from './audioAction'
import { Dispatch } from "react";
import { DispatchType } from '../../interface'
import { loader_types } from '../../types';


export const handleSetLoader = (
    _payload: { state: loader_types, value: boolean },
    dispatch: Dispatch<DispatchType>
  ): ReturnType<() => void> => {
    dispatch({
      type: "LOADING_PAGE",
      payload: _payload,
    });
  };