import { Routes ,Route} from 'react-router-dom';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home'
import Jobs from './pages/Jobs';
import ResumeUpload from './pages/ResumeUpload';
import EmployerProfile from './pages/EmployerProfile';
import ProtectedRoute from './routes/ProtectedRoute';
import Unauthorised from './components/Unauthorised';
import AdminDashboard from './pages/admin/AdminDashboard';
import JobList from './pages/admin/JobList';
import Users from './pages/admin/Users';
import EmployerApprove from './pages/admin/EmployerApprove';
import Browsejobs from './pages/Browsejobs';
import AnalysisResult from './pages/AnalysisResult';
import ApplicationList from './pages/ApplicationList';
import ManageJobs from './pages/employer/ManageJobs';
import AddJob from './pages/employer/AddJob';
import EditJob from './pages/employer/EditJob';
import ApplicantsList from './pages/employer/ApplicantsList';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import About from './pages/About';
import Footer from './components/Footer';
import EmployerP from './pages/EmployerP';
import Profile from './pages/Profile';
import EditJobseekerProfile from './pages/EditJobseekerProfile';


function App() {
 

  return (
    <>
      <Toaster position="top-center" />
    
 
         <Header />

         <Routes>
             <Route path="/" element={<Home />} />
             <Route path="register" element={<Register />} />
             <Route path="login" element={<Login />} />
             <Route path="jobs" element={<Jobs />} />
              <Route path="/about" element={<About />} />
             <Route path="/resume-upload" element={<ResumeUpload />} />
             <Route path="/become-employer" element={<EmployerProfile />} />
             <Route path="/browse-jobs" element={<Browsejobs/>} />
             <Route path="/analysis/:id" element={<AnalysisResult/>} />
             <Route path="/my-applications" element={<ApplicationList/>}/>
             <Route path="/profile" element={<Profile/>}/>
             <Route path="/profile/edit" element={<EditJobseekerProfile />} />
      <Route         
  path="/admin/dashboard"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
      
    </ProtectedRoute>
  }
/>
 <Route
  path="/admin/jobs"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <JobList/>
      
    </ProtectedRoute>
  }
/>
 <Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <Users/>
      
    </ProtectedRoute>
  }
/>
 <Route
  path="/admin/reqapprove"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <EmployerApprove/>
      
    </ProtectedRoute>
  }
/>
 <Route         
  path="/employer/joblist"
  element={
    <ProtectedRoute allowedRoles={['employer']}>
      <ManageJobs />
      
    </ProtectedRoute>
  }
/>
<Route         
  path="/employer/addjob"
  element={
    <ProtectedRoute allowedRoles={['employer']}>
      <AddJob />
      
    </ProtectedRoute>
  }
/>
<Route         
  path="/employer/editjob/:id"
  element={
    <ProtectedRoute allowedRoles={['employer']}>
      <EditJob />
      
    </ProtectedRoute>
  }
/>
<Route         
  path="/employer/viewapplicants/:jobId"
  element={
    <ProtectedRoute allowedRoles={['employer']}>
      <ApplicantsList />
      
    </ProtectedRoute>
  }
/>
<Route         
  path="/employer/dashboard"
  element={
    <ProtectedRoute allowedRoles={['employer']}>
      <EmployerDashboard />
      
    </ProtectedRoute>
  }
/>




             <Route path='/unauthorised' element={<Unauthorised />} />
         </Routes>
         <Footer/>
     
    </>
  )
}

export default App
