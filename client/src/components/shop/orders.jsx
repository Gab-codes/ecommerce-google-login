import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import ShoppingOrderDetailsView from "./order-details";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import useMediaQuery from "@/hooks/use-media-query";
import { Drawer } from "../ui/drawer";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [page, setPage] = useState(() => {
    return sessionStorage.getItem("userCurrentOrdersPage")
      ? Number(sessionStorage.getItem("userCurrentOrdersPage"))
      : 1;
  });
  const limit = 10;
  const { orderList, orderDetails, totalOrders } = useSelector(
    (state) => state.shopOrder
  );

  const statusClass = {
    confirmed: "bg-green-400 hover:bg-green-500",
    delivered: "bg-green-600 hover:bg-green-700",
    cancelled: "bg-red-600 hover:bg-red-700",
    processing: "bg-yellow-500 hover:bg-yellow-600",
  };

  const totalPages = totalOrders ? Math.ceil(totalOrders / limit) : 0;

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(getAllOrdersByUserId({ userId: user.id, page, limit }));
    }
  }, [dispatch, user?.id, page, limit]);

  useEffect(() => {
    sessionStorage.setItem("userCurrentOrdersPage", page);
  }, [page]);

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  function handleCloseDialog() {
    setOpenDetailsDialog(false);
    dispatch(resetOrderDetails());
  }

  const onPageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        {orderList && orderList.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Price</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList.map((orderItem) => (
                <TableRow key={orderItem?._id}>
                  <TableCell>{orderItem?._id}</TableCell>
                  <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 ${
                        statusClass[orderItem?.orderStatus]
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {`₦${new Intl.NumberFormat("en-NG", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(orderItem?.totalAmount)}`}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleFetchOrderDetails(orderItem?._id)}
                    >
                      View Details
                    </Button>
                    {isDesktop ? (
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={handleCloseDialog}
                      >
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    ) : (
                      <Drawer
                        open={openDetailsDialog}
                        onOpenChange={handleCloseDialog}
                      >
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                      </Drawer>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No orders found.</p>
        )}
        {orderList && orderList.length > 10 ? (
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
                <PaginationNext
                  href="#"
                  onClick={() => onPageChange(page + 1)}
                />
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
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
