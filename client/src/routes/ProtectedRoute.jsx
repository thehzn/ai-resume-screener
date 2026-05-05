import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";



const ProtectedRoute = ({allowedRoles,children})=>{
    const {user} =useSelector((state)=>state.auth);

    if(!user) return <Navigate to="/login"/>;

    if(allowedRoles && !allowedRoles.includes(user.role)){
        return <Navigate to="/unauthorised" />;
    }
    return children;
};

export default ProtectedRoute;