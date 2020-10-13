import React, { useState, Fragment } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import { useAuthDispatch } from "../context/auth";

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      token
      _id
    }
  }
`;

export default function Signin() {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState(null);

  const dispatch = useAuthDispatch();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => {
      console.log(err);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted(data) {
      dispatch({ type: "LOGIN", payload: data.login });
      window.location.href = "/";
    },
  });

  const submitLoginForm = (e) => {
    e.preventDefault();
    loginUser({ variables });
  };

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row align-items-center justify-content-center">
          <div className="col-12 col-md-5 col-lg-6 col-xl-4 px-lg-6 my-5 mt-5">
            <h1 className="display-4 text-center mb-3">Sign in</h1>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@address.com"
                value={variables.username}
                onChange={(e) =>
                  setVariables({ ...variables, username: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col">
                  <label>Password</label>
                </div>
                <div className="col-auto">
                  <Link
                    to="/password_rest/"
                    className="form-text small text-muted"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="input-group input-group-merge">
                <input
                  type="password"
                  className="form-control form-control-appended"
                  placeholder="Enter your password"
                  value={variables.password}
                  onChange={(e) =>
                    setVariables({ ...variables, password: e.target.value })
                  }
                />
              </div>
            </div>
            {errors && (
              <div className="alert alert-danger">{JSON.stringify(errors)}</div>
            )}

            <button
              onClick={submitLoginForm}
              className={`btn btn-lg btn-block btn-primary mb-3 ${
                loading && "disabled"
              }`}
              disabled={loading}
            >
              {loading ? "Siggnin in..." : "Sign in"}
            </button>
            <p className="text-center">
              <small className="text-muted text-center">
                Don't have an account yet? <Link to="/signup/">Sign up</Link>.
              </small>
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
