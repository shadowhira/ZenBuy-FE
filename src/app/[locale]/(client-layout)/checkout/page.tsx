"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { Button } from "@components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form"
import { Input } from "@components/ui/input"
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group"
import { Separator } from "@components/ui/separator"
import { useCart } from "@hooks/use-cart"
import { useMutation } from "@tanstack/react-query"
import { ordersService } from "@services/orders.service"

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  zipCode: z.string().min(2, {
    message: "Zip code must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "cash"], {
    required_error: "You need to select a payment method.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function CheckoutPage() {
  const { t } = useTranslation("checkout");
  const router = useRouter();
  const { data: cart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate order summary
  const subtotal = cart?.items?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
  const shipping = subtotal > 0 ? 5 : 0;
  const total = subtotal + shipping;
  
  // Create order mutation
  const createOrder = useMutation({
    mutationFn: (data: FormValues) => {
      return ordersService.createOrder({
        shippingAddress: {
          fullName: data.fullName,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          zipCode: data.zipCode,
          phone: data.phone,
        },
        paymentMethod: data.paymentMethod,
      });
    },
  });

  // Form definition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      phone: "",
      paymentMethod: "credit_card",
    },
  });

  // Form submission handler
  function onSubmit(data: FormValues) {
    if (!cart?.items?.length) {
      toast.error(t("emptyCartError") || "Your cart is empty");
      return;
    }
    
    setIsSubmitting(true);
    
    createOrder.mutate(data, {
      onSuccess: () => {
        toast.success(t("orderSuccess") || "Order placed successfully!");
        router.push("/orders");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error 
            ? error.message 
            : t("orderError") || "Failed to place order"
        );
        setIsSubmitting(false);
      },
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("checkout") || "Checkout"}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">{t("shippingAddress") || "Shipping Address"}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fullName") || "Full Name"}</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("phone") || "Phone"}</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>{t("address") || "Address"}</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("city") || "City"}</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("state") || "State"}</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("zipCode") || "Zip Code"}</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("country") || "Country"}</FormLabel>
                        <FormControl>
                          <Input placeholder="USA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">{t("paymentMethod") || "Payment Method"}</h2>
                
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="credit_card" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {t("creditCard") || "Credit Card"}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="bank_transfer" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {t("bankTransfer") || "Bank Transfer"}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="cash" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {t("cashOnDelivery") || "Cash on Delivery"}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full md:w-auto" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (t("placingOrder") || "Placing Order...") 
                  : (t("placeOrder") || "Place Order")}
              </Button>
            </form>
          </Form>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 shadow-sm sticky top-4">
            <h2 className="text-xl font-semibold mb-4">{t("orderSummary") || "Order Summary"}</h2>
            
            <div className="space-y-4">
              {cart?.items?.map((item) => (
                <div key={item.id} className="flex space-x-4">
                  <div className="w-16 h-16 bg-muted rounded relative overflow-hidden">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.title || "Product"} 
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {t("quantity") || "Quantity"}: {item.quantity}
                    </p>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{t("subtotal") || "Subtotal"}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("shipping") || "Shipping"}</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>{t("total") || "Total"}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
