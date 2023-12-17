import React from "react";
import {Outlet} from "react-router-dom";
import Header from "./Header";


const Layout = () => {
  return (
    <div class="container-fluid h-100 p-0" style={{background: "black", color: "gainsboro"}}>
        {/* <div class="row h-100 w-100 m-0">
            <Header/>
        </div> */}
        <div class="row h-100 w-100 m-0">

            <div class="d-none d-lg-flex col-lg-1"></div>
            <main role="main" class="ml-sm-auto col-lg-10 h-100 px-0">
                <Outlet />
            </main>
            <div class="d-none d-lg-flex col-lg-1"></div>
        </div>
    </div>
  );
};

export default Layout;