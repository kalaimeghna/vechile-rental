import React, { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  IdCard,
  Camera,
  Pencil,
  Save,
  X,
  Lock,
  ShieldCheck,
  CalendarDays,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

interface UserProfile {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  profilePicture: string;
  licenseNumber: string;
  dateOfBirth: string;
  role: "user" | "admin" | "owner";
  createdAt: string;
}

interface FormData {
  name: string;
  phone: string;
  location: string;
  licenseNumber: string;
  dateOfBirth: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  location?: string;
  licenseNumber?: string;
  dateOfBirth?: string;
}

/* =========================================================
   INITIAL DATA
   Replace this with your API/user Redux data later.
========================================================= */

const initialProfile: UserProfile = {
  _id: "user-001",
  name: "Kalaivani K",
  email: "kalai@example.com",
  phone: "9876543210",
  location: "Chennai, Tamil Nadu",
  profilePicture: "",
  licenseNumber: "",
  dateOfBirth: "",
  role: "user",
  createdAt: "2026-01-15T10:00:00.000Z",
};

/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name: string): string => {
  if (!name.trim()) {
    return "U";
  }

  return name
    .trim()
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatMemberSince = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

/* =========================================================
   VALIDATION
========================================================= */

const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must contain at least 2 characters";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[6-9]\d{9}$/.test(data.phone.trim())) {
    errors.phone = "Enter a valid 10-digit Indian phone number";
  }

  if (!data.location.trim()) {
    errors.location = "Location is required";
  }

  if (data.licenseNumber.trim() && data.licenseNumber.trim().length < 5) {
    errors.licenseNumber = "Please enter a valid license number";
  }

  return errors;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  const [formData, setFormData] = useState<FormData>({
    name: initialProfile.name,
    phone: initialProfile.phone,
    location: initialProfile.location,
    licenseNumber: initialProfile.licenseNumber,
    dateOfBirth: initialProfile.dateOfBirth,
  });

  const [isEditing, setIsEditing] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [isChangingPhoto, setIsChangingPhoto] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* =========================================================
     LOAD PROFILE
  ========================================================= */

  useEffect(() => {
    /*
      Later replace this with:

      const response = await axiosInstance.get("/auth/me");

      setProfile(response.data.user);

    */

    setFormData({
      name: profile.name,
      phone: profile.phone,
      location: profile.location,
      licenseNumber: profile.licenseNumber,
      dateOfBirth: profile.dateOfBirth,
    });
  }, [profile]);

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  const handleSave = async () => {
    const validationErrors = validateForm(formData);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      /*
        Backend API example:

        const response = await axiosInstance.put(
          "/users/profile",
          formData
        );

        setProfile(response.data.user);
      */

      await new Promise((resolve) => setTimeout(resolve, 800));

      setProfile((previous) => ({
        ...previous,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        licenseNumber: formData.licenseNumber.trim(),
        dateOfBirth: formData.dateOfBirth,
      }));

      setIsEditing(false);

      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update failed:", error);

      setErrorMessage("Unable to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================================================
     CANCEL EDIT
  ========================================================= */

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      phone: profile.phone,
      location: profile.location,
      licenseNumber: profile.licenseNumber,
      dateOfBirth: profile.dateOfBirth,
    });

    setErrors({});
    setIsEditing(false);
    setErrorMessage("");
  };

  /* =========================================================
     PROFILE PHOTO
  ========================================================= */

  const handlePhotoClick = () => {
    if (!isEditing) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Profile image must be less than 5MB.");
      return;
    }

    setIsChangingPhoto(true);
    setErrorMessage("");

    const reader = new FileReader();

    reader.onload = () => {
      setProfile((previous) => ({
        ...previous,
        profilePicture: reader.result as string,
      }));

      setIsChangingPhoto(false);

      setSuccessMessage(
        "Profile image selected. Save your profile to apply the change.",
      );
    };

    reader.onerror = () => {
      setIsChangingPhoto(false);

      setErrorMessage("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">My Profile</h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your personal information and account details.
            </p>
          </div>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setSuccessMessage("");
                setErrorMessage("");
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Save size={17} />
                )}

                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* ===================================================
            MESSAGES
        ==================================================== */}

        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            <CheckCircle2 size={18} />
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <AlertCircle size={18} />
            {errorMessage}
          </div>
        )}

        {/* ===================================================
            MAIN GRID
        ==================================================== */}

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* =================================================
              PROFILE CARD
          ================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              {/* Profile Image */}

              <div className="relative">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={profile.name}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-blue-100 text-3xl font-black text-blue-600 shadow-lg">
                    {getInitials(profile.name)}
                  </div>
                )}

                {isEditing && (
                  <button
                    type="button"
                    onClick={handlePhotoClick}
                    disabled={isChangingPhoto}
                    className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
                  >
                    {isChangingPhoto ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <Camera size={17} />
                    )}
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              {/* Name */}

              <h2 className="mt-5 text-xl font-black text-slate-900">
                {profile.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">{profile.email}</p>

              {/* Role */}

              <span className="mt-4 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold capitalize text-blue-600">
                {profile.role}
              </span>
            </div>

            {/* Account Info */}

            <div className="mt-7 space-y-4 border-t border-slate-100 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Mail size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <p className="truncate text-sm font-semibold text-slate-700">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <CalendarDays size={17} />
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Member Since
                  </p>

                  <p className="text-sm font-semibold text-slate-700">
                    {formatMemberSince(profile.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Account Status
                  </p>

                  <p className="text-sm font-semibold text-green-600">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              DETAILS CARD
          ================================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-6">
              <h2 className="text-xl font-black text-slate-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep your information up to date.
              </p>
            </div>

            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Name */}

                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                      className={`
                        w-full rounded-xl border
                        py-3 pl-10 pr-4 text-sm
                        outline-none transition

                        ${
                          errors.name
                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }

                        ${
                          !isEditing
                            ? "cursor-not-allowed bg-slate-50 text-slate-500"
                            : "bg-white text-slate-800"
                        }
                      `}
                    />
                  </div>

                  {errors.name && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-500 outline-none"
                    />
                  </div>

                  <p className="mt-1 text-xs text-slate-400">
                    Email cannot be changed here.
                  </p>
                </div>

                {/* Phone */}

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      maxLength={10}
                      placeholder="10-digit phone number"
                      className={`
                        w-full rounded-xl border
                        py-3 pl-10 pr-4 text-sm
                        outline-none transition

                        ${
                          errors.phone
                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }

                        ${
                          !isEditing
                            ? "cursor-not-allowed bg-slate-50 text-slate-500"
                            : "bg-white text-slate-800"
                        }
                      `}
                    />
                  </div>

                  {errors.phone && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Location */}

                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Location
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="City, State"
                      className={`
                        w-full rounded-xl border
                        py-3 pl-10 pr-4 text-sm
                        outline-none transition

                        ${
                          errors.location
                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }

                        ${
                          !isEditing
                            ? "cursor-not-allowed bg-slate-50 text-slate-500"
                            : "bg-white text-slate-800"
                        }
                      `}
                    />
                  </div>

                  {errors.location && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* License */}

                <div>
                  <label
                    htmlFor="licenseNumber"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Driving License Number
                  </label>

                  <div className="relative">
                    <IdCard
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter license number"
                      className={`
                        w-full rounded-xl border
                        py-3 pl-10 pr-4 text-sm
                        uppercase outline-none transition

                        ${
                          errors.licenseNumber
                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                            : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }

                        ${
                          !isEditing
                            ? "cursor-not-allowed bg-slate-50 text-slate-500"
                            : "bg-white text-slate-800"
                        }
                      `}
                    />
                  </div>

                  {errors.licenseNumber && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {errors.licenseNumber}
                    </p>
                  )}
                </div>

                {/* DOB */}

                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Date of Birth
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`
                        w-full rounded-xl border
                        py-3 pl-10 pr-4 text-sm
                        outline-none transition

                        ${
                          !isEditing
                            ? "cursor-not-allowed bg-slate-50 text-slate-500"
                            : "bg-white text-slate-800 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }
                      `}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            SECURITY
        ==================================================== */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Lock size={19} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Account Security
                </h2>

                <p className="text-sm text-slate-500">
                  Manage your password and account security.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-slate-800">Password</h3>

              <p className="mt-1 text-sm text-slate-500">
                Keep your password secure and change it regularly.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                alert("Connect this button to your Change Password page.");
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <Lock size={16} />
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
