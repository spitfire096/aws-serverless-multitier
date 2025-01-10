import React, { useState } from "react";
import "./page-sell-item.css";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/navbar";
import { createProduct } from "../services/apiService"; // Import the new API service function

const SellItem = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    imageFile: null,
    stock: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imageFile") {
      setFormData((prevData) => ({
        ...prevData,
        imageFile: files[0],
        imageUrl: "", // Clear imageUrl if imageFile is selected
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        // Clear imageFile if imageUrl is entered
        ...(name === "imageUrl" && { imageFile: null }),
      }));
    }

    // Clear any existing error for the field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Validate form inputs
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.price) {
      newErrors.price = "Price is required.";
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number.";
    }
    if (!formData.stock) {
      newErrors.stock = "Stock is required.";
    } else if (isNaN(formData.stock) || Number(formData.stock) <= 0) {
      newErrors.stock = "Stock must be a positive number.";
    }

    if (!formData.imageUrl && !formData.imageFile) {
      newErrors.image = "Either an image URL or an image file is required.";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data payload
        // Prepare form data payload
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        stock: Number(formData.stock),
        imgUrl: formData.imageUrl || "", // Placeholder logic
        sellerSub: auth.user?.profile?.sub, // Include sellerSub from auth context
       };
  

      // If imageFile is provided, handle the upload (pseudo-code)
      if (formData.imageFile) {
        // TODO: Upload the imageFile to a storage service (e.g., S3) and get the URL
        // const uploadedImageUrl = await uploadImage(formData.imageFile);
        // payload.imgUrl = uploadedImageUrl;

        // Placeholder logic for uploaded image
        payload.imgUrl = "https://example.com/uploaded-image.jpg";
      }

      // Use the API service to create a new product
      await createProduct(payload, auth.user?.access_token);

      setConfirmationMessage("Item listed successfully!");

      // Redirect to "My Listings" page after a short delay
      setTimeout(() => {
        navigate("/my-listings");
      }, 2000);
    } catch (error) {
      console.error("Error listing the product:", error);
      setErrors({ submit: error.message || "An error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="sold-items-container">
        <h2>Sell an Item</h2>
        {confirmationMessage && (
          <div className="confirmation-message">{confirmationMessage}</div>
        )}
        <form className="sell-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">
              Title<span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "input-error" : ""}
              required
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="description">
              Description<span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "input-error" : ""}
              required
            ></textarea>
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="price">
              Price ($)<span className="required">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? "input-error" : ""}
              required
              min="0.01"
              step="0.01"
            />
            {errors.price && <span className="error">{errors.price}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="stock">
              Stock<span className="required">*</span>
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={errors.stock ? "input-error" : ""}
              required
              min="1"
              step="1"
            />
            {errors.stock && <span className="error">{errors.stock}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className={errors.image ? "input-error" : ""}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="form-group">
            <label htmlFor="imageFile">Or Upload Image</label>
            <input
              type="file"
              id="imageFile"
              name="imageFile"
              accept="image/*"
              onChange={handleChange}
              className={errors.image ? "input-error" : ""}
            />
          </div>
          {errors.image && <span className="error">{errors.image}</span>}
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Listing..." : "List Item"}
          </button>
          {errors.submit && (
            <span className="error submit-error">{errors.submit}</span>
          )}
        </form>
      </div>
    </div>
  );
};

export default SellItem;
