import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchUser } from '../../features/userSlice';
import ToastMsg from '../HF/ToastMsg';

const Login = () => {
    const [userName, setUserName] = useState("");
    const [pass, setPass] = useState("");
    const [err, setErr] = useState("");
    //const [user, setUser] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (pass?.length < 5) {
      setErr(`Password must be at least 5 characters`);
    }
    else{
      const user = { userName, password: pass };

      const url = "https://asif-online-shop-server.herokuapp.com/api/users/login";
      const response = await axios.post(url, user);
      if (response.data.status === 200 || response.data.status === 201) {
        //https://www.freecodecamp.org/news/how-to-persist-a-logged-in-user-in-react/
        //setUser(response.data);
        localStorage.setItem('userName', response.data?.user?.userName)
        localStorage.setItem('activeToken', response.data.activeToken)
        toast.success(response.data.msg);
        dispatch(fetchUser(user.userName));
        if(response.data?.user?.confirmedEmail){
          navigate("/home", {replace: true});
        }
        else{
          navigate("/send-email", {replace: true});
        }
        
      }
      else{
        setErr(response.data.status+": "+response.data.msg);
      }
    }
  }

    
    return (
        <div className="container w-50 mx-auto text-start mt-3">
        <h2 className="text-success">Please Login</h2>
            <Form onSubmit={handleLogin}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" required placeholder="Enter username" onChange={e => setUserName(e.target.value)}/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" required placeholder="Password" onChange={e => setPass(e.target.value)}/>
        {err && <Form.Text className="text-danger">Error {err}</Form.Text>}
      </Form.Group>
      
      <Button variant="success" type="submit">
        Login
      </Button>
    </Form>
    <ToastMsg></ToastMsg>
      </div>
    );
};

export default Login;