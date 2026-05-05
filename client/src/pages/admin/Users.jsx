import { useEffect, useState } from "react";
import useAxios from "../../hooks/axios";
import toast from "react-hot-toast";
import { Container,Table,Button } from "react-bootstrap";
import {Link} from 'react-router-dom';




function Users(){
    const axios = useAxios();
    const [role,setRole]= useState("");
    const [users,setUsers]= useState([]);





    const fetchUserList = async()=>{
        try{
            const {data} = await axios.get("/admin/getallusers",{params:{role}});
            setUsers(data.users);
           


        }
        catch(error){
 console.log("error fetfching user list");
             toast.error(error?.response?.data?.message || error.message);
            
        }
    };
useEffect(()=>{
    fetchUserList();
},[role]);

const handleDelete = async(userId)=>{
    try{
        await axios.delete(`/admin/deleteuser/${userId}`);
        toast.success("Deleted user successfully");
        setUsers(users.filter((user)=>user._id!==userId));

    }
    catch(error){
        toast.error(error?.response?.data?.message || error.message);
    }
};

  


    return(
        <>
        
         <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
     <h2>User List</h2>
<select value={role} onChange={(e) => setRole(e.target.value)}>
  <option value="">All Users</option>
  <option value="jobseeker">Job Seeker</option>
  <option value="employer">Employer</option>
</select>
       
        
      </div>
      
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id} className="align-middle">
               <td>{user.name}</td>
               <td>{user.email}</td>
               <td>{user.role}</td>
       

               
                <td>
                  
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No Users available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
        </>
    )

}
export default Users;