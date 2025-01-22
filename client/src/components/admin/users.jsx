import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import {
  deleteUser,
  getAllUsers,
  updateUserRole,
} from "@/store/admin/users-slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "../ui/pagination";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const AdminUserView = () => {
  const dispatch = useDispatch();
  const { userList, totalUsers } = useSelector((state) => state.allUsers);
  const [page, setPage] = useState(1);
  const limit = 20;
  const totalPages = Math.ceil(totalUsers / limit);

  useEffect(() => {
    dispatch(getAllUsers({ page, limit }));
  }, [dispatch, page, limit]);

  const handleRoleChange = async (userId, newRole) => {
    const result = await dispatch(updateUserRole({ userId, role: newRole }));
    if (updateUserRole.fulfilled.match(result)) {
      toast.success("Role updated successfully.");
    } else {
      toast.error(result.payload || "Failed to update role.");
    }
  };
  const handleDeleteUser = async (userId) => {
    const result = await dispatch(deleteUser({ userId }));
    if (deleteUser.fulfilled.match(result)) {
      toast.success("User updated successfully.");
      dispatch(getAllUsers({ page, limit }));
    } else {
      toast.error(result.payload || "Failed to delete use.");
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderedUsers = useMemo(() => {
    return userList && userList.length > 0 ? (
      userList.map((user) => (
        <TableRow key={user._id}>
          <TableCell>{user.userName ?? "N/A"}</TableCell>
          <TableCell>{user.email ?? "N/A"}</TableCell>
          <TableCell>{user.role ?? "N/A"}</TableCell>

          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <span>Edit role</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuRadioGroup
                  value={user.role}
                  onValueChange={(newRole) =>
                    handleRoleChange(user._id, newRole)
                  }
                  aria-label="User Role Selection"
                >
                  <DropdownMenuRadioItem
                    value="admin"
                    aria-label="Set role to Admin"
                  >
                    Admin
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="user"
                    aria-label="Set role to User"
                  >
                    User
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
          <TableCell>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete user?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    user's account and remove data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteUser(user._id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TableCell>
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={4}>No users found</TableCell>
      </TableRow>
    );
  }, [userList, totalUsers]);

  return (
    <Card className="max-w-[92.5vw] sm:max-w-full">
      <CardHeader>
        <CardTitle>All Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
              <TableHead>
                <span className="sr-only">Delete User</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{renderedUsers}</TableBody>
        </Table>
      </CardContent>
      {totalUsers > limit && (
        <Pagination className="flex flex-col justify-center items-center my-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(page > 1 ? page - 1 : page)}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={index + 1 === page}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  handlePageChange(page < totalPages ? page + 1 : page)
                }
              />
            </PaginationItem>
          </PaginationContent>
          <div className="flex items-center justify-center mt-2">
            <span className="text-muted-foreground">
              Page {page} of {totalPages}
            </span>
          </div>
        </Pagination>
      )}
    </Card>
  );
};

export default AdminUserView;
