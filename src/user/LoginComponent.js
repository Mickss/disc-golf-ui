import { useState, useRef } from "react";

const LoginComponent = () => {
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  const submit = () => {
    const submitData = {
      username: usernameInputRef.current.value,
      password: passwordInputRef.current.value,
    };

    fetch("http://localhost:25003/auth/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    });
  };

  const showLogin = () => {
    setLoginVisible(true);
  };

  const [loginVisible, setLoginVisible] = useState(false);

  return (
    <>
      {loginVisible ? (
        <div>
          <h3>Sign in</h3>
          <input type="text" name="username" ref={usernameInputRef} />
          <div>
            <input type="password" name="password" ref={passwordInputRef} />
          </div>
          <button onClick={submit}>Submit</button>
        </div>
      ) : (
        <button onClick={showLogin}>Login</button>
      )}
    </>
  );
};

export default LoginComponent;
