import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../utils/header";
import AddTeam from "../../components/addteam";
function AddTeamPage() {



    return (
        <>

            <div>
                <Header />
                <AddTeam />
            </div>


        </>
    )
}
export default AddTeamPage;