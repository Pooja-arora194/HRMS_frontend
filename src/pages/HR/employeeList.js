import React, { useEffect, useState } from "react";
import Header from "../utils/header";
import { useNavigate } from "react-router-dom";
import EmployeeLists from "../../components/employeeList";
import axios from "axios";
import { BASE_URL } from "../../baseUrl";
import LayoutTemplate from "../../layout/Layout";
function EmployeeList() {

  return (
    <LayoutTemplate >
      <EmployeeLists />
    </LayoutTemplate>
  )
}
export default EmployeeList;