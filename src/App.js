import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Auth from "./components/Auth";
import Layout from "./components/Layout";
import Notification from "./components/Notification";
import { uiActions } from "./store/ui-slice";

let isFirstRender=true;

function App() {
  const dispatch = useDispatch();
  const notification = useSelector(state => state.ui.notification)
  const cart = useSelector(state => state.cart)
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)

  useEffect(() => {
    if(isFirstRender){
      isFirstRender=false;
      return
    }
    //Send state as a Sending request
    dispatch(uiActions.showNotification({
      open: true,
      message: 'Sending Request',
      type: 'warning'
    }))
    const sendRequest = async () => {
      const res = await fetch('https://redux-http-c01ef-default-rtdb.firebaseio.com/cartItems.json', {
        method: 'PUT',
        body: JSON.stringify(cart)
      });
      const data = await res.json();
      //Send state as a Request is successfull
      dispatch(uiActions.showNotification({
        open: true,
        message: 'Sending Request to database successfully',
        type: 'success'
      }))
    };
    sendRequest().catch(err => {
      //Send state as a Error
      dispatch(uiActions.showNotification({
        open: true,
        message: 'Sending Request failed',
        type: 'error'
      }))
    })
  }, [cart])

  return (
    <div className="App">
      {notification && <Notification type={notification.type} message={notification.message} />}
      {!isLoggedIn && <Auth />}
      {isLoggedIn && < Layout />}
    </div>
  );
}

export default App;
