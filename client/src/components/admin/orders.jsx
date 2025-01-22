import { useEffect, useState, useMemo } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "../ui/pagination";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import AdminOrderDetailsView from "./order-details";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Drawer } from "../ui/drawer";
import useMediaQuery from "@/hooks/use-media-query";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [page, setPage] = useState(() => {
    return sessionStorage.getItem("adminOrdersCurrentPage")
      ? Number(sessionStorage.getItem("adminOrdersCurrentPage"))
      : 1;
  });
  const limit = 10;

  const { orderList, orderDetails, totalOrders } = useSelector(
    (state) => state.adminOrder
  );
  const dispatch = useDispatch();

  const statusClass = {
    confirmed: "bg-green-400 hover:bg-green-500",
    delivered: "bg-green-600 hover:bg-green-700",
    cancelled: "bg-red-600 hover:bg-red-700",
    processing: "bg-yellow-500 hover:bg-yellow-600",
  };

  const totalPages = totalOrders ? Math.ceil(totalOrders / limit) : 0;

  useEffect(() => {
    dispatch(getAllOrdersForAdmin({ page, limit }));
  }, [dispatch, page, limit]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    sessionStorage.setItem("adminOrdersCurrentPage", page);
  }, [page]);

  const renderedOrders = useMemo(() => {
    return orderList && orderList.length > 0 ? (
      orderList.map((orderItem) => (
        <TableRow key={orderItem._id}>
          <TableCell>{orderItem?.userId ?? "N/A"}</TableCell>
          <TableCell>{orderItem?.orderDate.split("T")[0] ?? "N/A"}</TableCell>
          <TableCell>
            <Badge
              className={`py-1 px-3 ${statusClass[orderItem?.orderStatus]}`}
            >
              {orderItem?.orderStatus}
            </Badge>
          </TableCell>
          <TableCell>
            {`₦${new Intl.NumberFormat("en-NG", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(orderItem?.totalAmount ?? "N/A")}`}
          </TableCell>
          <TableCell>
            <Button onClick={() => handleFetchOrderDetails(orderItem._id)}>
              View Details
            </Button>
          </TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={5}>No orders available</TableCell>
      </TableRow>
    );
  }, [orderList, openDetailsDialog, dispatch, orderDetails]);

  const onPageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
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
          <TableBody>{renderedOrders}</TableBody>
        </Table>

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
        {isDesktop ? (
          <Dialog
            open={openDetailsDialog}
            onOpenChange={() => {
              setOpenDetailsDialog(false);
              dispatch(resetOrderDetails());
            }}
          >
            <AdminOrderDetailsView
              orderDetails={orderDetails}
              page={page}
              limit={limit}
            />
          </Dialog>
        ) : (
          <Drawer
            open={openDetailsDialog}
            onOpenChange={() => {
              setOpenDetailsDialog(false);
              dispatch(resetOrderDetails());
            }}
          >
            <AdminOrderDetailsView
              orderDetails={orderDetails}
              page={page}
              limit={limit}
            />
          </Drawer>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
