import  { useState } from 'react'

const Contact = () => {
   const [contant, setContant] = useState([
       {
           name: "Munagapati Midhun Naga Sai",
           email: "midhunnagasaicse@gmail.com",
           phone: "6300188045",
           education: "B.Tech",
           profession: "Full Stack Developer | MERN",
       },
       {
           name: "Ambala Revanth Reddy",
           email: "ambalarevanth63@gmail.com",
           phone: "8519885922",
           education: "B.Tech",
           profession: "Full Stack Developer | SAP",
       },
   ]);

   return (
       <div className="container mt-4">
           <div className="row">
               {contant.map((item, index) => (
                   <div className="col-md-6 mb-4" key={index}>
                       <div className="card text-center h-100 shadow-sm">
                           {/* Card Header */}
                           <div className="card-header">{item.profession}</div>

                           {/* Card Body */}
                           <div className="card-body">
                               <h5 className="card-title">{item.name}</h5>

                               <p className="card-text">
                                   <strong>Education:</strong> {item.education}
                               </p>

                               <p className="card-text">
                                   <strong>Phone:</strong> {item.phone}
                               </p>

                               {/*<a href="#" className="btn btn-primary">
                  View Profile
                </a>*/}
                           </div>

                           {/* Card Footer */}
                           <div className="card-footer text-body-secondary">
                               {item.email}
                           </div>
                       </div>
                   </div>
               ))}
           </div>
       </div>
   );
}

export default Contact
