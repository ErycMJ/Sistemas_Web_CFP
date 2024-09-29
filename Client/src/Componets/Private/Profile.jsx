import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../Redux/User/userSlice';
import toast from 'react-hot-toast';
import string from '../../String';

export const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [username, setUsername] = useState(currentUser.user.username);

  const handleUpdateProfileDetails = async () => {
    try {
      const { data } = await axios.put(`${string}/user/updateprofile`, { username }, {
        withCredentials: true,
      });
      dispatch(updateUser(data));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (<>
  <div className="max-w-xl mx-auto mt-10 p-5 bg-green-50 shadow-xl rounded-lg m-10">
  <h2 className="text-3xl font-semibold text-center mb-5 text-green-800">Profile</h2>
    <div className="profile-details-update">
      <div className="mb-5">
        <label className="block text-lg font-medium mb-2 text-green-800">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        onClick={handleUpdateProfileDetails}
        className="w-full bg-green-800 text-white py-2 rounded-md mb-3 hover:bg-green-700"
      >
        Update Profile
      </button>
    </div>
    </div></>
  );
};
