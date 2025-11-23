import { useState } from "react";
import axios from "axios";
import { daysOfWeek } from "../components/registration/registrationData";
import type {
  RegistrationFormData,
  RestaurantRegistrationPayload,
} from "../components/registration/types";
import type { NavigateFunction } from "react-router-dom";

export const useRestaurantForm = (
  formData: RegistrationFormData,
  setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>,
  isEditMode: boolean,
  id?: string
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const showAlert = (message: string, type: "success" | "error" | "warning") => {
    const alertDiv = document.createElement("div");
    alertDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 12px;
      z-index: 9999;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      max-width: 400px;
      ${type === "success" ? "background: #10b981; color: white;" : ""}
      ${type === "error" ? "background: #ef4444; color: white;" : ""}
      ${type === "warning" ? "background: #f59e0b; color: white;" : ""}
    `;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  };

  const uploadFileToCloudinary = async (file: File, token: string) => {
    const uploadData = new FormData();
    uploadData.append("file", file);

    const response = await axios.post("http://localhost:3002/uploads", uploadData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data.url as string;
  };

  const fetchRestaurantData = async (restaurantId: string, navigate: NavigateFunction) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      showAlert("Please login first.", "error");
      navigate("/login");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.get(`http://localhost:3002/restaurants/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const restaurant = response.data;
      console.log(restaurant);

      const daysOpenValues = restaurant.workingSchedule
        ?.filter((schedule: any) => schedule.isOpen)
        .map((schedule: any) => {
          const dayObj = daysOfWeek.find(d => d.label === schedule.day);
          return dayObj?.value || '';
        })
        .filter(Boolean) || [];

      setFormData({
        restaurantName: restaurant.name || "",
        email: restaurant.email || "",
        phone: restaurant.phone || "",
        description: restaurant.description || "",
        logoImage: null,
        galleryImages: [],
        daysOpen: daysOpenValues,
        openingTime: restaurant.timeSchedule?.openTime || "",
        closingTime: restaurant.timeSchedule?.closeTime || "",
        cuisineTypes: restaurant.cuisineType || [],
        tags: restaurant.specialTags || [],
        totalSeatingCapacity: restaurant.totalCapacity?.toString() || "",
        tableTypes: restaurant.tableTypes?.map((table: any) => ({
          capacity: table.seats?.toString() || "",
          count: table.count?.toString() || "",
        })) || [],
        maxBookingPerSlot: restaurant.maxBookingPerSlot?.toString() || "",
        address: restaurant.address?.street || "",
        city: restaurant.address?.city || "",
        pincode: restaurant.address?.pincode || "",
        latitude: restaurant.geoCoordinates?.lat?.toString() || "",
        longitude: restaurant.geoCoordinates?.lng?.toString() || "",
        ownerName: restaurant.ownerName || "",
        ownerIdProof: null,
      });

      // Store existing image URLs
      if (restaurant.mainImage) {
        sessionStorage.setItem(`restaurant_${restaurantId}_mainImage`, restaurant.mainImage);
      }
      if (restaurant.galleryImages && restaurant.galleryImages.length > 0) {
        sessionStorage.setItem(`restaurant_${restaurantId}_galleryImages`, JSON.stringify(restaurant.galleryImages));
      }
      if (restaurant.ownerIdProof) {
        sessionStorage.setItem(`restaurant_${restaurantId}_ownerIdProof`, restaurant.ownerIdProof);
      }

    } catch (error) {
      console.error("Error fetching restaurant data:", error);
      showAlert("Failed to load restaurant data.", "error");
      navigate("/admin/restaurants");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (navigate: NavigateFunction) => {
    const token = localStorage.getItem("token");

    if (!token) {
      showAlert("Please login first to register a restaurant.", "error");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress("Preparing files...");

    try {
      const existingMainImage = isEditMode && id 
        ? sessionStorage.getItem(`restaurant_${id}_mainImage`) 
        : null;
      const existingGalleryImages = isEditMode && id
        ? JSON.parse(sessionStorage.getItem(`restaurant_${id}_galleryImages`) || "[]")
        : [];
      const existingOwnerIdProof = isEditMode && id
        ? sessionStorage.getItem(`restaurant_${id}_ownerIdProof`)
        : null;

      setUploadProgress("Processing logo...");
      const logoImageUrl = formData.logoImage
        ? await uploadFileToCloudinary(formData.logoImage, token)
        : existingMainImage;

      setUploadProgress(`Processing gallery images...`);
      let galleryImageUrls = [...existingGalleryImages];
      if (formData.galleryImages.length > 0) {
        const newGalleryUrls = await Promise.all(
          formData.galleryImages.map((image) => uploadFileToCloudinary(image, token))
        );
        galleryImageUrls = [...galleryImageUrls, ...newGalleryUrls];
      }

      setUploadProgress("Processing owner ID proof...");
      const ownerIdProofUrl = formData.ownerIdProof
        ? await uploadFileToCloudinary(formData.ownerIdProof, token)
        : existingOwnerIdProof;

      const mainImageUrl = logoImageUrl || galleryImageUrls[0] || ownerIdProofUrl;

      if (!mainImageUrl) {
        showAlert("Please upload at least one image (logo or gallery) for the restaurant.", "warning");
        setIsSubmitting(false);
        setUploadProgress("");
        return;
      }

      const workingSchedule = daysOfWeek.map((day) => ({
        day: day.label,
        isOpen: formData.daysOpen.includes(day.value),
      }));

      const payload: RestaurantRegistrationPayload = {
        name: formData.restaurantName,
        email: formData.email,
        phone: formData.phone,
        description: formData.description,
        mainImage: mainImageUrl,
        galleryImages: galleryImageUrls,
        workingSchedule,
        timeSchedule: {
          openTime: formData.openingTime,
          closeTime: formData.closingTime,
        },
        cuisineType: formData.cuisineTypes,
        specialTags: formData.tags,
        totalCapacity: Number(formData.totalSeatingCapacity) || 0,
        tableTypes: formData.tableTypes.map((table) => ({
          seats: Number(table.capacity) || 0,
          count: Number(table.count) || 0,
        })),
        maxBookingPerSlot: Number(formData.maxBookingPerSlot) || 10,
        address: {
          street: formData.address,
          city: formData.city,
          state: "",
          country: "",
          pincode: formData.pincode,
        },
        geoCoordinates: {
          lat: Number(formData.latitude) || 0,
          lng: Number(formData.longitude) || 0,
        },
        ownerName: formData.ownerName,
        ownerIdProof: ownerIdProofUrl,
        accountStatus: isEditMode ? undefined : "pending",
        isVerified: undefined,
      };

      setUploadProgress(isEditMode ? "Updating restaurant..." : "Submitting registration...");
      
      if (isEditMode && id) {
        await axios.put(`http://localhost:3002/restaurants/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        showAlert("Restaurant updated successfully! 🎉 Redirecting...", "success");
      } else {
        await axios.post("http://localhost:3002/restaurants/add", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        showAlert("Restaurant registered successfully! 🎉 Redirecting...", "success");
      }

      if (isEditMode && id) {
        sessionStorage.removeItem(`restaurant_${id}_mainImage`);
        sessionStorage.removeItem(`restaurant_${id}_galleryImages`);
        sessionStorage.removeItem(`restaurant_${id}_ownerIdProof`);
      }

      setTimeout(() => {
        navigate("/admin/restaurants");
      }, 1500);

    } catch (error) {
      console.error(error);
      showAlert(
        isEditMode ? "Update failed! Please try again." : "Registration failed! Please try again.", 
        "error"
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  return {
    isLoading,
    isSubmitting,
    uploadProgress,
    fetchRestaurantData,
    handleSubmit,
  };
};