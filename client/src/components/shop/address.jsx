import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {  addNewAddress,  deleteAddress, editaAddress, fetchAllAddresses,} from "@/store/shop/address-slice";
import AddressCard from "./address-card";
import { toast } from "react-toastify";
import { Plus, X } from "lucide-react";
import { Button } from "../ui/button";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  state: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);
  const [isFormVisible, setIsFormVisible] = useState(false);  
  
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };
  
  function handleManageAddress(event) {
    event.preventDefault();

    
    if (addressList.length >= 3 && currentEditedId === null) {
      toast.error("You can only add a maximum of 3 addresses");
      return;
    }

    
    if (currentEditedId !== null) {
      dispatch(
        editaAddress({
          userId: user?.id,
          addressId: currentEditedId,
          formData,
        })
      )
        .then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null);
            setFormData(initialAddressFormData);
            toast.success("Address updated successfully");
          }
        })
        .catch(() => toast.error("Failed to update address"));
    } else {
      
      dispatch(
        addNewAddress({
          ...formData,
          userId: user?.id,
        })
      )
        .then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setFormData(initialAddressFormData);
            toast.success("Address added successfully");
          }
        })
        .catch(() => toast.error("Failed to add address"));
    }
  }

  
  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    )
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(user?.id));
          toast.success("Address deleted successfully");
        }
      })
      .catch(() => toast.error("Failed to delete address"));
  }

  
  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      address: getCurrentAddress?.address || "",
      city: getCurrentAddress?.city || "",
      phone: getCurrentAddress?.phone || "",
      state: getCurrentAddress?.state || "",
      notes: getCurrentAddress?.notes || "",
    });
  }

  
  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user?.id));
    }
  }, [dispatch, user?.id]);


  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id} 
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>

      <CardHeader>
        <div className="flex items-center gap-3">
          <CardTitle>
            {currentEditedId !== null ? "Edit Address" : "Add New Address"}
          </CardTitle>
          {currentEditedId === null && (
            isFormVisible ? (
              <Button size="icon" variant="outline" >
                <X className="h-8 w-8 text-red-600" onClick={toggleFormVisibility} />
              </Button>
            ) : (
              <Button size="icon" variant="outline" className="animate-float" >
                <Plus className="h-8 w-8" onClick={toggleFormVisibility} />
              </Button>
            )
          )}
        </div>
      </CardHeader>

      {(currentEditedId !== null || isFormVisible) && (
        <CardContent className="space-y-3">
          <CommonForm
            formControls={addressFormControls}
            formData={formData}
            setFormData={setFormData}
            buttonText={currentEditedId !== null ? "Edit" : "Add"}
            onSubmit={handleManageAddress}
            isBtnDisabled={!isFormValid()}
          />
        </CardContent>
      )}

    </Card>
  );
}

export default Address;
