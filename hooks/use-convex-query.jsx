import { useMutation, useQuery } from "convex/react"
import { useEffect, useState } from "react";
import { toast } from "sonner";

// hook for query 
export const useConvexQuery = (query,...args) => {
    const result = useQuery(query, ...args);
    
    const[data,setData] =useState(undefined);
    const [isLoading,setIsLoading]= useState(true);
    const [error,setError] = useState(null);

    useEffect(()=>{
        if(result=== undefined){
            setIsLoading(true);   
        }
        else{
            try{
                setData(result);
                setError(null);
            }catch(err){
                setError(err);
                toast.error("An error occurred while fetching data");
            }finally{
                setIsLoading(false);
            }
        }
    },[result]);

    return{
        data,
        isLoading,
        error,
    };
}


// hook for mutation 

export const useConvexMutation = (mutation,...args) => {
    const mutationFn = useMutation(mutation);    // returns a function so no  args required 
    
    const[data,setData] =useState(undefined);
    const [isLoading,setIsLoading]= useState(false);
    const [error,setError] = useState(null);

    const mutate = async(...args) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await mutationFn(...args);
            setData(response);
            return response; // Return the response for further use if needed
        } catch (err) {
            setError(err);
            toast.error(err.message || "An error occurred while performing the mutation");
        } finally {
            setIsLoading(false);
        }
    };

    return{
        mutate,
        data,
        isLoading,
        error,
    }
}