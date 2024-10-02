import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from 'react-hot-toast';
import String from '../../String';
import { useSelector } from 'react-redux';

const SignUp = () => {
    const [formData, setFormData] = useState({});    
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password || !formData.mobile) {
            toast.error("Please Fill Full Form");
            return;
        }
        try{
            const {data} = await axios.post(`${String}/user/signup`,
                formData,
                {
                    headers: {
                      "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            toast.success(data.message);
            navigate('/signin');
        }
        catch(error){
            toast.error(error.response.data.message);
        }
    }     
    if (currentUser) {
        return <Navigate to="/dashboard" />;
    }
  return (
    <>
        <div className='p-7 max-w-lg mx-auto bg-green-200 my-10 rounded-2xl'>
            <h1 className='text-3xl text-center text-green-800 font-semibold my-5'>
            Inscrever-se </h1>
            <form className='flex flex-col gap-4'>
                <input
                    type='text'
                    placeholder='Username'
                    className='border p-3 rounded-lg text-green-900 font-medium'
                    id='username'
                    onChange={handleChange}
                />
                <div className='flex items-center gap-4'>
                        <input
                            type='email'
                            placeholder='Email'
                            className='border p-3 rounded-lg text-green-900 font-medium flex-grow'
                            id='email'
                            onChange={handleChange}
                        />
                    </div>
                <input
                    type='password'
                    placeholder='Password'
                    className='border p-3 rounded-lg text-green-900 font-medium'
                    id='password'
                    onChange={handleChange}
                />         
                <input
                    type='text'
                    placeholder='Mobile No.'
                    className='border p-3 rounded-lg text-green-900 font-medium'
                    id='mobile'
                    onChange={handleChange}
                />
                <button onClick={handleSubmit}                    
                    className='bg-green-800 text-white p-3 rounded-lg text-2xl font-bold hover:opacity-90 disabled:opacity-80 my-2'
                    >
                    
Inscrever-se
                </button>
                <span className='text-center text-green-800 text-sm font-medium'>OR</span>
            </form>
            <div className='flex gap-2 mt-5 justify-center'>
                <p>Already have an account?</p>
                <Link to={'/signin'}>
                    <span className='text-blue-700'>
                    Inscrever-se</span>
                </Link>
            </div>
        </div>
    </>
  )
}

export default SignUp