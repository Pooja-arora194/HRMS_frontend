import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../utils/header";
import AddProject from "../../components/addproject";
function AddProjectPage() {



    return (
        <>

            <div>
                <Header />
                <AddProject />
            </div>


        </>
    )
}
export default AddProjectPage;