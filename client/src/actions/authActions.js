import axios from "axios";
import { returnErrors } from "./errorAction";
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from "./types";

// check token & load user
export const loadUser = () => (dispatch, getState) => {
  // USER LOADING
  dispatch({ type: USER_LOADING });

  axios
    .get("/api/auth/user", tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

//register user
export const register = ({ name, email, password }) => (dispatch) => {
  // headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // request body
  const body = JSON.stringify({ name, email, password });

  axios
    .post("/api/user", body, config)
    .then((res) =>
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "REGISTER_FAIL")
      );
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};

// Login user
export const login = ({ email, password }) => (dispatch) => {
  // headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // request body
  const body = JSON.stringify({ email, password });

  axios
    .post("/api/auth", body, config)
    .then((res) =>
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch(
        returnErrors(err.response.data, err.response.status, "LOGIN_FAIL")
      );
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

// Logout User
export const logout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};

// setup config/header and token
export const tokenConfig = (getState) => {
  // get token from localstorage
  const token = getState().auth.token;
  // headers
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  //   if token add to header
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
};
