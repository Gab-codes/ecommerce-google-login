import ProductImageUpload from "@/components/admin/image-upload";
import AdminProductTile from "@/components/admin/product-title";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const initialFormData = {
  images: [],
  title: "",
  description: "",
  category: "",
  product: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const [page, setPage] = useState(() => {
    return localStorage.getItem("adminProductCurrentPage")
      ? Number(localStorage.getItem("adminProductCurrentPage"))
      : 1;
  });
  const limit = 10;
  const [totalPages, setTotalPages] = useState(0);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  function onSubmit(event) {
    event.preventDefault();
    const imagesToSubmit =
      uploadedImageUrls.length > 0 ? uploadedImageUrls : formData.images;
    const submissionData = { ...formData, images: imagesToSubmit };

    if (currentEditedId !== null) {
      dispatch(
        editProduct({ id: currentEditedId, formData: submissionData })
      ).then((data) => handleAfterSubmit(data, "edit"));
    } else {
      dispatch(addNewProduct(submissionData)).then((data) =>
        handleAfterSubmit(data, "add")
      );
    }
  }

  function handleAfterSubmit(data, action) {
    if (data?.payload?.success) {
      dispatch(fetchAllProducts({ page, limit }));
      setFormData(initialFormData);
      setOpenCreateProductsDialog(false);
      setCurrentEditedId(null);
      setImageFiles([]);
      setUploadedImageUrls([]);

      const message =
        action === "add"
          ? "Product added successfully"
          : "Product updated successfully";
      toast.success(message);
    } else {
      toast.error("An error occurred. Please try again.");
    }
  }

  function handleDelete(productId) {
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts({ page, limit }));
        toast.success("Product deleted successfully.");
      } else {
        toast.error("Failed to delete the product.");
      }
    });
  }

  useEffect(() => {
    localStorage.setItem("adminProductCurrentPage", page);
  }, [page]);

  function onPageChange(newPage) {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  }

  useEffect(() => {
    dispatch(fetchAllProducts({ page, limit })).then((data) => {
      if (data?.payload?.pagination) {
        setTotalPages(data.payload.pagination.totalPages);
      }
    });
  }, [dispatch, page, limit]);

  function isFormValid() {
    return Object.keys(formData)
      .filter(
        (key) =>
          key !== "averageReview" && key !== "images" && key !== "salePrice"
      )
      .every((key) => {
        if (typeof formData[key] === "string") {
          return formData[key].trim() !== "";
        }
        return true;
      });
  }

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0 ? (
          productList.map((productItem) => (
            <AdminProductTile
              setFormData={setFormData}
              key={productItem.id}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
              setCurrentEditedId={setCurrentEditedId}
              product={productItem}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
      {productList && productList.length > 0 ? (
        <Pagination className="flex flex-col justify-center items-center mt-6 mb-10">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => onPageChange(page - 1)}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={index + 1 === page}
                  onClick={() => onPageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={() => onPageChange(page + 1)} />
            </PaginationItem>
          </PaginationContent>
          <div className="flex items-center justify-center mt-2">
            <span className="text-muted-foreground">
              Page {page} of {totalPages}
            </span>
          </div>
        </Pagination>
      ) : (
        " "
      )}

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={setUploadedImageUrls}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
