import React, { useContext } from 'react'
import { StoreContext } from '../context/StoreContext';

const Orders = () => {
   const { orders } = useContext(StoreContext);

   return (
       <>
           {orders.map((o) => (
               <div key={o.id}>
                   Order #{o.id} — {o.customer.name} — ₹{o.total}
               </div>
           ))}
       </>
   );
}

export default Orders
