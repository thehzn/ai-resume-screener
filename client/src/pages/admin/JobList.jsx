import { useEffect, useState } from "react";
import useAxios from "../../hooks/axios";
import toast from "react-hot-toast";
import { Container,Table,Button } from "react-bootstrap";
import {Link} from 'react-router-dom';




function JobList(){
    const axios = useAxios();
    const [jobs,setJobs]= useState([]);





    const fetchJobList = async()=>{
        try{
            const {data} = await axios.get("/admin/getalljoblist");
            setJobs(data.joblist);
            console.log(data.joblist);


        }
        catch(error){
 console.log("error fetfching job list");
             toast.error(error?.response?.data?.message || error.message);
            
        }
    };
useEffect(()=>{
    fetchJobList();
},[]);

const handleDelete = async(jobId)=>{
    try{
        await axios.delete(`/admin/deletejob/${jobId}`);
        toast.success("job deleted");
        setJobs(jobs.filter((job)=>job._id!==jobId));

    }
    catch(error){
        toast.error(error?.response?.data?.message || error.message);
    }
};

  


    return(
        <>
        
         <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Active Job List</h2>
        
      </div>
      
      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Company Name</th>
            <th>Location</th>
           <th>Job Type</th>
            <th>Posted Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <tr key={job._id} className="align-middle">
               <td>{job.title}</td>
        <td >{job.employerprofile?.companyName}</td>  {/* populated field */}
        <td >{job.location}</td>   
        <td >{job.jobType}</td>
        <td >{new Date(job.createdAt).toLocaleDateString()}</td>
               
                <td>
                  
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No Jobs available.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
        </>
    )

}
export default JobList;