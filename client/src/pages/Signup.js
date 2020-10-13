import React, { useState, Fragment } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
    }
  }
`;

export default function Signup(props) {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState(null);

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (data) => {
      console.log(data);
      window.location.href = "/signin/";
    },
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
  });
  const submitRegisterForm = (e) => {
    e.preventDefault();

    registerUser({ variables });
  };

  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row align-items-center justify-content-center">
          <div className="col-12 col-md-5 col-lg-6 col-xl-4 px-lg-6 my-5">
            <h1 className="display-4 text-center mb-3">Sign up</h1>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="name@address.com"
                value={variables.email}
                onChange={(e) =>
                  setVariables({ ...variables, email: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="username"
                value={variables.username}
                onChange={(e) =>
                  setVariables({ ...variables, username: e.target.value })
                }
              />
            </div>
            <div className="form-group">
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
            <div className="form-group">
              <div className="input-group input-group-merge">
                <input
                  type="password"
                  className="form-control form-control-appended"
                  placeholder="Repeate password"
                  value={variables.confirmPassword}
                  onChange={(e) =>
                    setVariables({
                      ...variables,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            {errors && (
              <div className={"alert alert-danger"}>
                {JSON.stringify(errors)}
              </div>
            )}
            <button
              disabled={loading}
              onClick={submitRegisterForm}
              className={`btn btn-lg btn-block btn-primary mb-3 ${
                loading && "disabled"
              }`}
            >
              {loading ? "Please wait.." : "Sign up"}
            </button>
            <p className="text-center">
              <small className="text-muted text-center">
                Already have an account? <Link to="/signin/">Sign in</Link>.
              </small>
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
