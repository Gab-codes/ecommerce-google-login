import ProductImageUpload from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDashboardMetrics } from "@/store/admin/dashboard-slice";
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from "@/store/common-slice";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFiles, setImageFiles] = useState([]); 
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]); 
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList, loadingFeatureImages } = useSelector((state) => state.commonFeature);
  const { metrics, loading } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(fetchDashboardMetrics());
    dispatch(getFeatureImages());
  }, [dispatch]);

  function handleUploadFeatureImage() {
    
    uploadedImageUrls.forEach((url) => {
      dispatch(addFeatureImage(url)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
        }
      });
    });
    
    setImageFiles([]);
    setUploadedImageUrls([]);
  }

  function handleDeleteFeatureImage(imageId) {
    dispatch(deleteFeatureImage(imageId));
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-[80px] w-[100%] rounded-xl" />
          <Skeleton className="h-[80px] w-[100%] rounded-xl" />
          <Skeleton className="h-[80px] w-[100%] rounded-xl" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 bg-white shadow font-semibold rounded-md">
            <h3>Total Products</h3>
            <p className="text-xl mt-1.5">{metrics.totalProducts}</p>
          </div>
          <div className="p-4 bg-white shadow font-semibold rounded-md">
            <h3>Total Products Sold</h3>
            <p className="text-xl mt-1.5">{metrics.totalProductsSold}</p>
          </div>
          <div className="p-4 bg-white shadow font-semibold rounded-md">
            <h3>Total Revenue</h3>
            <p className="text-xl mt-1.5">
              {metrics.totalRevenue
                ? `₦${Intl.NumberFormat("en-NG").format(metrics.totalRevenue.toFixed(2))}`
                : "₦0.00"}
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Feature Images</h2>
        {loadingFeatureImages ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        ) : (
          <>
            <ProductImageUpload
              imageFiles={imageFiles}
              setImageFiles={setImageFiles} 
              uploadedImageUrls={uploadedImageUrls}
              setUploadedImageUrls={setUploadedImageUrls}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isCustomStyling={true}
            />
            <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
              Upload
            </Button>
            <div className="flex flex-col gap-4 mt-5">
              {featureImageList && featureImageList.length > 0 ? (
                featureImageList.map((featureImgItem) => (
                  <div key={featureImgItem._id} className="relative group">
                    <img
                      src={featureImgItem.image}
                      className="w-full h-[300px] object-cover rounded-t-lg"
                      alt="Feature"
                    />
                    <Button
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full opacity-100 md:opacity-0  md:group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                    >
                      <Trash2 className="w-5 h-5 z-50" />
                    </Button>
                  </div>
                ))
              ) : (
                <p>No feature images available.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
