"use client"

import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { format } from "date-fns"
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  MapPin,
  Phone,
  User,
  CreditCard
} from "lucide-react"

import { Button } from "@components/ui/button"
import { Separator } from "@components/ui/separator"
import { Badge } from "@components/ui/badge"
import { Skeleton } from "@components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog"
import { toast } from "sonner"
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

// Order timeline component
const OrderTimeline = ({ status }: { status: string }) => {
  const statuses = ["pending", "processing", "shipped", "delivered"];
  const currentIndex = statuses.indexOf(status);

  return (
    <div className="flex items-center justify-between w-full mt-6 mb-8">
      {statuses.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index <= currentIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {index === 0 && <Clock className="h-4 w-4" />}
            {index === 1 && <Package className="h-4 w-4" />}
            {index === 2 && <Truck className="h-4 w-4" />}
            {index === 3 && <CheckCircle className="h-4 w-4" />}
          </div>
          <p className={`text-xs mt-2 capitalize ${
            index <= currentIndex ? "font-medium" : "text-muted-foreground"
          }`}>
            {step}
          </p>
          {index < statuses.length - 1 && (
            <div className={`h-0.5 w-24 mt-4 ${
              index < currentIndex ? "bg-primary" : "bg-muted"
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  // Store params.id in a variable to avoid direct access warnings
  // In the future, we'll need to use React.use() to unwrap params
  const orderId = params.id;

  // Use orderId from params
  const { t } = useTranslation("orders");
  const router = useRouter();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Fetch order details
  const { data: order, isLoading, error, refetch } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersService.getOrderById(orderId),
  });

  // Cancel order mutation
  const cancelOrder = useMutation({
    mutationFn: () => ordersService.cancelOrder(orderId),
    onSuccess: () => {
      toast.success(t("orderCancelled") || "Order cancelled successfully");
      setCancelDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : t("cancelError") || "Failed to cancel order"
      );
    },
  });

  const handleBack = () => {
    router.push("/orders");
  };

  const handleCancelOrder = () => {
    cancelOrder.mutate();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-40 ml-2" />
        </div>

        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold ml-2">{t("orderError") || "Error"}</h1>
        </div>

        <div className="text-center py-12 text-destructive">
          <p>{t("errorLoadingOrder") || "Error loading order details"}</p>
          <p className="text-sm mt-2">{error instanceof Error ? error.message : String(error)}</p>
          <Button variant="outline" className="mt-4" onClick={handleBack}>
            {t("backToOrders") || "Back to Orders"}
          </Button>
        </div>
      </div>
    );
  }

  const canCancel = order.status === "pending";
  const formattedDate = format(new Date(order.createdAt), "MMMM d, yyyy");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">
          {t("orderDetails") || "Order Details"} #{order._id || order.id}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("orderInfo") || "Order Information"}</CardTitle>
            <CardDescription>{t("basicOrderInfo") || "Basic order information"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("orderId") || "Order ID"}:</span>
              <span className="font-medium">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("orderDate") || "Order Date"}:</span>
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("status") || "Status"}:</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("total") || "Total"}:</span>
              <span className="font-medium">${(order.totalAmount || order.total || 0).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("shippingInfo") || "Shipping Information"}</CardTitle>
            <CardDescription>{t("deliveryDetails") || "Delivery details"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">{order.shippingAddress.fullName}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <p>{order.shippingAddress.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("paymentInfo") || "Payment Information"}</CardTitle>
            <CardDescription>{t("paymentDetails") || "Payment details"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2">
              <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium capitalize">{order.paymentMethod.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-muted-foreground">{t("subtotal") || "Subtotal"}:</span>
              <span>${((order.totalAmount || order.total || 0) - 5).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("shipping") || "Shipping"}:</span>
              <span>$5.00</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>{t("total") || "Total"}:</span>
              <span>${(order.totalAmount || order.total || 0).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {order.status !== "cancelled" && order.status !== "delivered" && (
        <OrderTimeline status={order.status} />
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t("orderItems") || "Order Items"}</CardTitle>
          <CardDescription>
            {t("itemsInOrder", { count: order.items.length }) || `${order.items.length} items in this order`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 pb-4 border-b last:border-0 last:pb-0">
                <div className="w-20 h-20 bg-muted rounded relative overflow-hidden flex-shrink-0">
                  {item.product && (
                    <img
                      src={(item.product as any).images?.[0] || "/placeholder.svg"}
                      alt={(item.product as any).title || "Product"}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">{(item.product as any)?.title || "Product"}</h3>
                  {item.variant && (
                    <p className="text-sm text-muted-foreground">{t("variant") || "Variant"}: {item.variant}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {t("quantity") || "Quantity"}: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          {t("backToOrders") || "Back to Orders"}
        </Button>

        {canCancel && (
          <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                {t("cancelOrder") || "Cancel Order"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("confirmCancellation") || "Confirm Cancellation"}</DialogTitle>
                <DialogDescription>
                  {t("cancelConfirmation") || "Are you sure you want to cancel this order? This action cannot be undone."}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setCancelDialogOpen(false)}
                >
                  {t("keepOrder") || "Keep Order"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelOrder}
                  disabled={cancelOrder.isPending}
                >
                  {cancelOrder.isPending
                    ? (t("cancelling") || "Cancelling...")
                    : (t("confirmCancel") || "Yes, Cancel Order")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
