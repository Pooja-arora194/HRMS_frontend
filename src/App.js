import './App.css';
import './btn.css'
import './custom.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Dashboard from './components/dashboard';
import Setting from './components/setting';
import LeaveRequests from './pages/Admin/leaveRequest';
import ApplyLeave from './pages/UserDashboard/applyLeave';
import Profile from './pages/UserDashboard/profile';
import Leaves from './pages/UserDashboard/leaves';
import AddUser from './pages/UserDashboard/adduser';
import LeaveRequest from './pages/HR/leaveRequest';
import Comment from './pages/utils/comment';
import Event from './pages/HR/Event';
import Invite from './pages/HR/invite';
import AddProjectPage from './pages/HR/addproject';
import AddTeamPage from './pages/HR/addteam';
import Loader from './loader/loader';
// import EmployeeList from './pages/HR/employeeList';
import { createContext, useState } from "react";
import DataContext from './context/DataContext';
import Layout from './layout/Layout';
import Unauthorized from './pages/Unauthorized';
import PageNotFound from './pages/PageNotFound';
import EmployeeList from './components/employeeList';
import MonthlyStatus from './components/monthlyStatus';
import EmployeeLeaveQuota from './components/employeeLeaveQuota';
import MonthlyLeaveQuota from './components/monthlyLeaveQuota'

export const LoaderContext = createContext(null);

function App() {
  const [loading, setLoading] = useState(false);

  const showLoader = () => {
    setLoading(true)
  }
  const hideLoader = () => {
    setLoading(false)
  }
  if (loading) {
    document.body.classList.toggle('overflowhidden', loading);
  }
  else {
    document.body.classList.remove('overflowhidden', loading);
  }

  return (

    <div className="App">
      <DataContext>
        <LoaderContext.Provider value={{ showLoader, hideLoader }}>
          <Loader value={loading} />

          <BrowserRouter>
            <div className='App'>
              <Routes>
                <Route exact path="/" element={<Login />} />
                <Route exact path="/dashboardpage" element={<Dashboard />} />
                {/* <Route path="/dashboard" element={<Dashboardpage />} /> */}
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                <Route exact path="/setting" element={<Setting />} />
                <Route exact path="/applyleave" element={<ApplyLeave />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/leaves" element={<Leaves />} />
                <Route exact path="/adduser" element={<AddUser />} />
                <Route exact path="/leaverequest" element={<LeaveRequest />} />
                {/* <Route path="/comments" element={<Comment />} /> */}
                {/* <Route path="/event" element={<Event />} /> */}
                <Route exact path="/invite" element={<Invite />} />
                <Route exact path="/401" element={<Unauthorized />} />
                {/* <Route path="/addproject" element={<AddProjectPage />} /> */}
                {/* <Route path="/project/:code" element={<AddTeamPage />} /> */}
                {/* <Route path="/Admin_leave_request" element={<LeaveRequests />} /> */}
                {/* <Route path="/layout" element={<Layout />} /> */}
                <Route path="/monthlystatus" element={<MonthlyStatus />} />
                <Route path="/allleavequota" element={<EmployeeLeaveQuota />} />
                <Route path="/employee_list" element={<EmployeeList />} />
                <Route path="/monthlyquota" element={<MonthlyLeaveQuota />} />

                <Route path="*" component={<PageNotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </LoaderContext.Provider>
      </DataContext>
    </div >
  );
}

export default App;