import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import useMediaQuery from "@/hooks/use-media-query";
import { DrawerContent } from "../ui/drawer";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);
  const statusClass = {
    confirmed: "bg-green-400 hover:bg-green-500",
    delivered: "bg-green-600 hover:bg-green-700",
    cancelled: "bg-red-600 hover:bg-red-700",
    processing: "bg-yellow-500 hover:bg-yellow-600",
  };
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const content = (
    <div className="grid gap-3.5">
      <div className="grid gap-2">
        <div className="flex mt-6 items-center justify-between">
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
      <div className="grid gap-3">
        <div className="grid gap-2">
          <div className="font-medium">Shipping Info</div>
          <div className="grid gap-0.5 text-muted-foreground">
            <span>{user.userName}</span>
            <span>
              {orderDetails?.addressInfo?.address},{" "}
              {orderDetails?.addressInfo?.city},{" "}
              {orderDetails?.addressInfo?.state}
            </span>
            <span>{orderDetails?.addressInfo?.phone}</span>
            <span>{orderDetails?.addressInfo?.notes}</span>
          </div>
        </div>
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

export default ShoppingOrderDetailsView;
