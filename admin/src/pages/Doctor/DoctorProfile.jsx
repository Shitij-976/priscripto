import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  // Update Doctor Profile (photo, name, experience, about, fees, address, available)
  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("fees", profileData.fees);
      formData.append("about", profileData.about);
      formData.append("experience", profileData.experience);
      formData.append("address", JSON.stringify(profileData.address));
      formData.append("available", profileData.available);

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        formData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        setImage(false);
        await getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div className="m-5 max-w-lg flex flex-col gap-3 text-sm">
        {/* Profile Image with upload preview in edit mode */}
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block cursor-pointer relative">
              <img
                src={image ? URL.createObjectURL(image) : profileData.image}
                alt="Doctor Profile"
                className="w-36 h-36 rounded-lg object-cover opacity-75 border"
              />
              <img
                src={image ? "" : assets.upload_area}
                alt=""
                className="absolute w-10 bottom-12 right-12"
              />
            </div>
            <input
              type="file"
              id="image"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        ) : (
          <img
            className="w-36 h-36 rounded-lg object-cover border"
            src={profileData.image}
            alt="Doctor Profile"
          />
        )}

        {/* Doctor Name */}
        {isEdit ? (
          <input
            className="bg-gray-50 text-3xl font-medium max-w-sm mt-2 border border-gray-300 rounded px-2 py-1"
            type="text"
            value={profileData.name}
            onChange={(e) =>
              setProfileData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-2">
            {profileData.name}
          </p>
        )}

        {/* Degree & Speciality (display info) */}
        <p className="text-gray-600 font-medium -mt-1">
          {profileData.degree} - {profileData.speciality}
        </p>

        <hr className="bg-zinc-300 h-[1px] border-none my-1" />

        {/* Professional Information */}
        <div>
          <p className="text-neutral-500 underline">PROFESSIONAL DETAILS</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-neutral-700 items-center">
            {/* Experience */}
            <p className="font-medium">Experience:</p>
            {isEdit ? (
              <select
                className="border rounded px-2 py-1 bg-gray-50 max-w-40"
                value={profileData.experience}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    experience: e.target.value,
                  }))
                }
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10+ Year">10+ Year</option>
              </select>
            ) : (
              <p className="text-gray-600">{profileData.experience}</p>
            )}

            {/* Appointment Fees */}
            <p className="font-medium">Fees:</p>
            {isEdit ? (
              <div className="flex items-center gap-1">
                <span>{currency}</span>
                <input
                  type="number"
                  className="bg-gray-50 border border-gray-300 rounded px-2 py-1 max-w-28"
                  value={profileData.fees}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, fees: e.target.value }))
                  }
                />
              </div>
            ) : (
              <p className="text-gray-600 font-semibold">
                {currency} {profileData.fees}
              </p>
            )}

            {/* Availability */}
            <p className="font-medium">Availability:</p>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={Boolean(profileData.available)}
                disabled={!isEdit}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    available: e.target.checked,
                  }))
                }
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="available" className="cursor-pointer text-gray-600">
                {profileData.available
                  ? "Available for appointments"
                  : "Unavailable"}
              </label>
            </div>
          </div>
        </div>

        {/* About Doctor */}
        <div className="mt-2">
          <p className="text-neutral-500 underline mb-2">ABOUT</p>
          {isEdit ? (
            <textarea
              rows={4}
              className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-neutral-700"
              value={profileData.about}
              onChange={(e) =>
                setProfileData((prev) => ({ ...prev, about: e.target.value }))
              }
            />
          ) : (
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {profileData.about}
            </p>
          )}
        </div>

        {/* Contact Information & Address */}
        <div className="mt-2">
          <p className="text-neutral-500 underline">CONTACT & CLINIC ADDRESS</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-neutral-700">
            <p className="font-medium">Email:</p>
            <p className="text-blue-500">{profileData.email}</p>

            <p className="font-medium">Address:</p>
            {isEdit ? (
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  placeholder="Address Line 1"
                  className="bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full"
                  value={profileData.address?.line1 || ""}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                />
                <input
                  type="text"
                  placeholder="Address Line 2"
                  className="bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full"
                  value={profileData.address?.line2 || ""}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                />
              </div>
            ) : (
              <p className="text-gray-600">
                {profileData.address?.line1}
                {profileData.address?.line2 && <br />}
                {profileData.address?.line2}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          {isEdit ? (
            <>
              <button
                onClick={updateProfile}
                className="border border-primary bg-primary text-white px-8 py-2.5 rounded-full hover:bg-blue-600 transition-all duration-300"
              >
                Save Information
              </button>
              <button
                onClick={() => {
                  setIsEdit(false);
                  setImage(false);
                  getProfileData();
                }}
                className="border border-gray-300 px-6 py-2.5 rounded-full hover:bg-gray-100 transition-all duration-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="border border-primary text-primary px-8 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
