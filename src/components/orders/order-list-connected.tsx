"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { format } from "date-fns"
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Search
} from "lucide-react"

import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select"
import { Badge } from "@components/ui/badge"
import { Skeleton } from "@components/ui/skeleton"
import { ordersService } from "@services/orders.service"

// Status badge component
const OrderStatusBadge = ({ status }: { status: string }) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let icon = null;

  switch (status) {
    case "pending":
      variant = "outline";
      icon = <Clock className="h-4 w-4 mr-1" />;
      break;
    case "processing":
      variant = "secondary";
      icon = <Package className="h-4 w-4 mr-1" />;
      break;
    case "shipped":
      variant = "default";
      icon = <Truck className="h-4 w-4 mr-1" />;
      break;
    case "delivered":
      variant = "default";
      icon = <CheckCircle className="h-4 w-4 mr-1" />;
      break;
    case "cancelled":
      variant = "destructive";
      icon = <XCircle className="h-4 w-4 mr-1" />;
      break;
  }

  return (
    <Badge variant={variant} className="flex items-center">
      {icon}
      <span className="capitalize">{status}</span>
    </Badge>
  );
};

export default function OrderListConnected() {
  const { t } = useTranslation("orders");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Fetch orders
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders", page, limit, statusFilter],
    queryFn: () => {
      // console.log('OrderListConnected - Fetching orders with params:', { page, limit, status: statusFilter });
      // Không truyền statusFilter vào API vì chúng ta sẽ lọc trên client
      return ordersService.getOrders({ page, limit });
    },
  });

  // console.log('OrderListConnected - Orders data:', data);

  // Log raw orders data
  // console.log('OrderListConnected - Raw orders:', data?.orders);

  // Filter orders by search term and status
  const filteredOrders = data?.orders ? data.orders.filter(order => {
    // console.log('Checking order:', order);

    // Kiểm tra order có hợp lệ không
    if (!order) {
      // console.warn('Invalid order object:', order);
      return false;
    }

    // Lấy ID từ _id hoặc id
    const orderId = order._id || order.id;
    if (!orderId) {
      // console.warn('Order has no ID:', order);
      return false;
    }

    const matchesSearch = searchTerm
      ? orderId.toString().includes(searchTerm)
      : true;
    // console.log('matchesSearch:', matchesSearch, 'searchTerm:', searchTerm, 'orderId:', orderId);

    const matchesStatus = statusFilter
      ? order.status === statusFilter
      : true;
    // console.log('matchesStatus:', matchesStatus, 'statusFilter:', statusFilter, 'order.status:', order.status);

    const result = matchesSearch && matchesStatus;
    // console.log('Filter result for order', orderId, ':', result);
    return result;
  }) : [];

  // Log filtered orders count
  // console.log('OrderListConnected - Filtered orders count:', filteredOrders.length);

  // console.log('OrderListConnected - Filtered orders:', filteredOrders);

  // Handle pagination
  const totalPages = data?.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle order click
  const handleOrderClick = (orderId: string) => {
    // console.log('Navigating to order details:', orderId);
    router.push(`/orders/${orderId}`);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">{t("myOrders") || "My Orders"}</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchOrders") || "Search orders..."}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            value={statusFilter || "all"}
            onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder={t("allStatuses") || "All Statuses"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatuses") || "All Statuses"}</SelectItem>
              <SelectItem value="pending">{t("pending") || "Pending"}</SelectItem>
              <SelectItem value="processing">{t("processing") || "Processing"}</SelectItem>
              <SelectItem value="shipped">{t("shipped") || "Shipped"}</SelectItem>
              <SelectItem value="delivered">{t("delivered") || "Delivered"}</SelectItem>
              <SelectItem value="cancelled">{t("cancelled") || "Cancelled"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {t("show") || "Show"}:
          </span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => setLimit(parseInt(value))}
          >
            <SelectTrigger className="w-16">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-destructive">
          <p>{t("errorLoadingOrders") || "Error loading orders"}</p>
          <p className="text-sm mt-2">{error instanceof Error ? error.message : String(error)}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">{t("noOrders") || "No orders found"}</h3>
          <p className="text-muted-foreground mt-2">
            {searchTerm || statusFilter
              ? t("noOrdersFiltered") || "No orders match your filters"
              : t("noOrdersYet") || "You haven't placed any orders yet"}
          </p>
          {(searchTerm || statusFilter) && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter(null);
              }}
            >
              {t("clearFilters") || "Clear Filters"}
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("orderId") || "Order ID"}</TableHead>
                  <TableHead>{t("date") || "Date"}</TableHead>
                  <TableHead>{t("status") || "Status"}</TableHead>
                  <TableHead className="text-right">{t("total") || "Total"}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  if (!order) {
                    // console.warn('Invalid order in render:', order);
                    return null;
                  }

                  // Lấy ID từ _id hoặc id
                  const orderId = order._id || order.id;
                  if (!orderId) {
                    // console.warn('Order has no ID in render:', order);
                    return null;
                  }

                  // console.log('Rendering order:', order);

                  return (
                  <TableRow
                    key={order._id || order.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleOrderClick(order._id || order.id?.toString() || '')}
                  >
                    <TableCell className="font-medium">#{order._id || order.id || 'N/A'}</TableCell>
                    <TableCell>
                      {order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {order.status ? (
                        <OrderStatusBadge status={order.status} />
                      ) : (
                        <span>Unknown</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      ${(order.totalAmount || order.total || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                  <PaginationItem key={`page-${pageNumber}`}>
                    <PaginationLink
                      isActive={page === pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(page + 1)}
                    className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  )
}
