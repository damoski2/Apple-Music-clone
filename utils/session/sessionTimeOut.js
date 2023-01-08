import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    useContext,
    Fragment,
  } from "react";
  import moment from "moment";
  import { clearSession, returnExpiryDate } from "../index";
  import { isSessionUser } from "../../services";
  import { checkPersistedTokens, persistTokens } from '../../services'
  import { GlobalContext } from "../../context/GlobalContext";
  import { useRouter } from "next/router";
  import axios from 'axios'
  
  
  
  
  const SessionTimeout = () => {
    const router = useRouter();
    const { dispatch, setTokenSession, handleSetLoader, refreshToken } = useContext(GlobalContext);
  
    const [events, setEvents] = useState(["click", "load", "scroll"]);
    const [second, setSecond] = useState(0);
  
    let timeStamp;
    let warningInactiveInterval = useRef();
    let startTimerInterval = useRef();
  
    // start inactive check
    let timeChecker = () => {
      startTimerInterval.current = setTimeout(() => {
        let storedTimeStamp = sessionStorage.getItem("lastTimeStamp");
        warningInactive(storedTimeStamp);
      }, 60000);
    };
  
    let resetTimer = useCallback(() => {
      clearTimeout(startTimerInterval.current);
      clearInterval(warningInactiveInterval.current);
  
      if (isSessionUser(returnExpiryDate())){
        //console.log(isSessionUser(parseInt(returnExpiryDate())))
        timeStamp = moment(returnExpiryDate());
        //console.log('timeStamp', timeStamp)
        sessionStorage.setItem("lastTimeStamp", timeStamp);
      } else {
        clearInterval(warningInactiveInterval.current);
        sessionStorage.removeItem("lastTimeStamp");
       
        axios
        .post(`/api/refresh`, {
          refreshToken,
        })
        .then((res) => {
          persistTokens("SET_ACCESS_TOKEN", res.data.accessToken);
          persistTokens("SET_EXPIRES_IN", res.data.expiresIn);

          setTokenSession(res.data, dispatch, "SET_ACCESS_TOKEN");
          setTokenSession(res.data, dispatch, "SET_EXPIRES_IN");
        })
        .catch((err) => {})
        .finally(() => {
          //handleSetLoader(false, dispatch);
        });
        
        //Logout user
        /* checkPersistedTokens('SET_ACCESS_TOKEN') &&
          (() => {
            clearSession();
            dispatch({
              type: "LOG_OUT",
            });
            router.push('/login');
          })(); */
      }
      timeChecker();
    }, [isSessionUser(returnExpiryDate()), refreshToken]);
  
    // warning timer
    let warningInactive = (timeString) => {
      clearTimeout(startTimerInterval.current);
  
      warningInactiveInterval.current = setInterval(() => {
        const maxTime = 2; // Maximum ideal time given before logout
        const popTime = 1; // remaining time (notification) left to logout.
  
        const diff = moment.duration(moment().diff(moment(timeString)));
        const minPast = diff.minutes();
        const leftSecond = 60 - diff.seconds();
  
        if (minPast === popTime) {
          setSecond(leftSecond);
        }
  
        if (minPast === maxTime) {
          clearInterval(warningInactiveInterval.current);
          sessionStorage.removeItem("lastTimeStamp");
          // your logout function here
        }
      }, 1000);
    };
  
    useEffect(() => {
      events.forEach((event) => {
        window.addEventListener(event, resetTimer);
      });
  
      timeChecker();
    }, [resetTimer]);
  
    return <Fragment />;
  };
  
  export default SessionTimeout;
  