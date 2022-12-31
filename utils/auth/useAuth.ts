import { useEffect, useContext, useMemo, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";
import { persistTokens, checkPersistedTokens } from "../../services";

const useAuth = (code: string) => {
  const {
    setTokenSession,
    dispatch,
    handleSetLoader,
    expiresIn,
    refreshToken,
    accessToken,
  } = useContext(GlobalContext);

  const [_accessToken, _setAccessToken] = useState("");
  const [_refreshToken, _setRefreshToken] = useState("");
  const [_expiresIn, _setExpiresIn] = useState("");

  useEffect(() => {
    if (typeof code === "string" && code.length > 0) {
      handleSetLoader(true, dispatch);
      axios
        .post(`/api/login`, {
          code,
        })
        .then((res) => {
          //Set in Context
          setTokenSession(res.data, dispatch, "SET_ACCESS_TOKEN");
          setTokenSession(res.data, dispatch, "SET_REFRESH_TOKEN");
          setTokenSession(res.data, dispatch, "SET_EXPIRES_IN");

          //Persist to localstorage
          persistTokens("SET_ACCESS_TOKEN", res.data.accessToken);
          persistTokens("SET_REFRESH_TOKEN", res.data.refreshToken);
          persistTokens("SET_EXPIRES_IN", res.data.expiresIn);

        })
        .catch((err) => {
          console.error(err);
          handleSetLoader(false, dispatch);
        })
        .finally(() => handleSetLoader(false, dispatch));
    }
  }, [code]);

  useEffect(() => {
    if (
      !checkPersistedTokens("SET_ACCESS_TOKEN") ||
      !checkPersistedTokens("SET_EXPIRES_IN") ||
      !checkPersistedTokens("SET_REFRESH_TOKEN")
    )
      return;

    handleSetLoader(true, dispatch);

    const interval = setInterval(() => {
      if (expiresIn) {
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
            handleSetLoader(false, dispatch);
          });
      }
    }, (parseInt(expiresIn) - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);
  return accessToken;
};

export default useAuth;
