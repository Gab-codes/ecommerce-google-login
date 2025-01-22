import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getUserById } from "@/store/find-user-slice";
import useMediaQuery from "@/hooks/use-media-query";
import { DrawerContent } from "../ui/drawer";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const {
    user: fetchedUser,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const statusClass = {
    confirmed: "bg-green-400 hover:bg-green-500",
    delivered: "bg-green-600 hover:bg-green-700",
    cancelled: "bg-red-600 hover:bg-red-700",
    processing: "bg-yellow-500 hover:bg-yellow-600",
  };

  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (orderDetails?.userId) {
      dispatch(getUserById(orderDetails.userId)).then((action) => {
        if (action.error) {
          toast.error("Failed to load user info");
        }
      });
    }
  }, [dispatch, orderDetails]);

  const handleUpdateStatus = (event) => {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        const page = JSON.parse(localStorage.getItem("currentPage")) || 1;
        const limit = JSON.parse(localStorage.getItem("itemsPerPage")) || 10;

        dispatch(getAllOrdersForAdmin({ page, limit }));
        setFormData(initialFormData);
        toast.success(data?.payload?.message);
      } else {
        toast.error(data?.payload?.message || "Failed to update order status");
      }
    });
  };

  const content = (
    <div className="grid gap-4">
      <div className="grid">
        <div className="flex mt-5 items-center justify-between">
          <p className="font-medium">Order ID</p>
          <Label>{orderDetails?._id}</Label>
        </div>
        <div className="flex mt-2 items-center justify-between">
          <p className="font-medium">Order Date</p>
          <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
        </div>
        <div className="flex mt-2 items-center justify-between">
          <p className="font-medium">Order Price</p>
          <Label>
            {`₦${new Intl.NumberFormat("en-NG", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(orderDetails?.totalAmount)}`}
          </Label>
        </div>
        <div className="flex mt-2 items-center justify-between">
          <p className="font-medium">Payment method</p>
          <Label>{orderDetails?.paymentMethod}</Label>
        </div>
        <div className="flex mt-2 items-center justify-between">
          <p className="font-medium">Order Status</p>
          <Label>
            <Badge
              className={`py-1 px-3 ${statusClass[orderDetails?.orderStatus]}`}
            >
              {orderDetails?.orderStatus}
            </Badge>
          </Label>
        </div>
      </div>
      <Separator />
      <div>
        <div className="font-medium">Order Details</div>
        {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderDetails.cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="py-2">{item.title}</TableCell>
                  <TableCell className="py-2">{item.quantity}</TableCell>
                  <TableCell className="py-2">
                    {`₦${new Intl.NumberFormat("en-NG", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(item.price)}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div>No items in the order.</div>
        )}
      </div>
      <div className="grid gap-2.5">
        <div className="grid gap-2">
          <div className="font-medium">Shipping Info</div>
          <div className="grid gap-0.5 text-muted-foreground">
            {userLoading ? (
              <span>Loading user info...</span>
            ) : userError ? (
              <span>Error loading user info: {userError}</span>
            ) : (
              fetchedUser && (
                <>
                  <span>{fetchedUser.userName}</span>
                  <span>
                    {orderDetails?.addressInfo?.address},{" "}
                    {orderDetails?.addressInfo?.city},{" "}
                    {orderDetails?.addressInfo?.state}
                  </span>
                  <span>{orderDetails?.addressInfo?.phone}</span>
                  <span>{orderDetails?.addressInfo?.notes}</span>
                </>
              )
            )}
          </div>
        </div>
      </div>

      <div>
        <CommonForm
          formControls={[
            {
              label: "Order Status",
              name: "status",
              componentType: "select",
              options: [
                { id: "processing", label: "Processing" },
                { id: "in-transit", label: "In Transit" },
                { id: "delivered", label: "Delivered" },
                { id: "cancelled", label: "Cancelled" },
              ],
            },
          ]}
          formData={formData}
          setFormData={setFormData}
          buttonText={"Update Order Status"}
          onSubmit={handleUpdateStatus}
        />
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <DialogContent className="max-w-[600px] text-base max-h-[90vh]  overflow-auto ">
        {content}
      </DialogContent>
    );
  }

  return (
    <DrawerContent className="max-h-[83vh]">
      <div className="relative grid grid-cols-1 gap-6 max-h-[80vh] overflow-y-auto p-4 w-full">
        {content}
      </div>
    </DrawerContent>
  );
}

export default AdminOrderDetailsView;
