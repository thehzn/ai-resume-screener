import { useSelector } from "react-redux";
import EmployerP from "./EmployerP";
import JobseekerProfile from "./JobseekerProfile";
import AdminProfile from "./AdminProfile";


function Profile(){
const user = useSelector((state)=>state.auth.user);
const role = user?.role;

return(
    <>
    {role==="employer" &&
    <EmployerP/>}
    {role==="jobseeker" &&
    <JobseekerProfile/>
    }
    {role==="admin" &&
    <AdminProfile/>}

    
    </>
)
}
export default Profile;