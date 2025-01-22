import { UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { toast } from "react-toastify";

function ProductImageUpload({
  imageFiles,
  setImageFiles,
  imageLoadingState,
  uploadedImageUrls,
  setUploadedImageUrls,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  const isInitialUpload = useRef(true);  

  function handleImageFilesChange(event) {
    const selectedFiles = Array.from(event.target.files);
    setImageFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    isInitialUpload.current = true;  
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setImageFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    isInitialUpload.current = true;  
  }

  function handleRemoveImage(index) {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setUploadedImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    isInitialUpload.current = false;  
  }

  async function uploadImagesToCloudinary() {
    try {
      setImageLoadingState(true);

      const data = new FormData();
      imageFiles.forEach((file) => data.append("files", file)); 

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.success && response.data.urls) {
        const urls = response.data.urls;
        setUploadedImageUrls((prevUrls) => [...prevUrls, ...urls]);
      } else {
        throw new Error("Upload failed for one or more images");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Error uploading images, please try again.");
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFiles.length > 0 && isInitialUpload.current) {
      uploadImagesToCloudinary();
      isInitialUpload.current = false;  
    }
  }, [imageFiles]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Images</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? "opacity-60" : ""} border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFilesChange}
          multiple
          disabled={isEditMode}
          aria-disabled={isEditMode}
        />
        {imageFiles.length === 0 ? (
          <Label
            htmlFor="image-upload"
            className={`${isEditMode ? "cursor-not-allowed" : ""} flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" aria-hidden="true" />
            <span>Drag & drop or click to upload images</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100 animate-pulse" aria-busy="true" />
        ) : (
          <div className="space-y-2">
            {uploadedImageUrls.map((url, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img src={url} alt="Uploaded preview" className="w-10 h-10 object-cover mr-2" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => handleRemoveImage(index)}
                  aria-label="Remove Image"
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
