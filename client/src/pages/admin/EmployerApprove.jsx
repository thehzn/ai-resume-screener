import { useEffect, useState } from "react";
import useAxios from "../../hooks/axios";
import toast from "react-hot-toast";
import { Container,Table,Button } from "react-bootstrap";
import {Link} from 'react-router-dom';




function EmployerApprove(){
    const axios = useAxios();
    const [pendingList,setPendingList]= useState([]);





    const fetchPendingList = async()=>{
        try{
            const {data} = await axios.get("/admin/getpending");
            setPendingList(data.pendingProfiles);
            


        }
        catch(error){
 console.log("error fetfching pending list");
             toast.error(error?.response?.data?.message || error.message);
            
        }
    };
useEffect(()=>{
    fetchPendingList();
},[]);

const handleClick = async(userId,status)=>{
    try{
       const {data}  = await axios.patch(`/admin/approveemp/${userId}`,{status});
        console.log("Update successful:", data.message);
        toast.success("employer updated successfully");
        setPendingList(pendingList.filter((p)=>p._id!==userId));

    }
    catch(error){
        toast.error(error?.response?.data?.message || error.message);
    }
};

  


    return(
        <>
        
         <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employer Approval Page</h2>
        
      </div>
      
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company Name</th>
           <th>Website</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingList.length > 0 ? (
            pendingList.map((p) => (
              <tr key={p._id} className="align-middle">
               <td>{p.user?.name}</td>
        <td >{p.user?.email}</td>  {/* populated field */}
         <td >{p.companyName}</td>
        <td >{p.website}</td>
        <td >{p.location}</td>   
        
       
               
                <td>
                  
                  <Button 
                    variant="outline-success" 
                    size="sm" 
                    onClick={() => handleClick(p._id,"approved")}
                  >
                    Approve
                  </Button>
                    <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleClick(p._id,"rejected")}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No Employers available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
        </>
    )

}
export default EmployerApprove;