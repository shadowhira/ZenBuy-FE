import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const recentOrders = [
  { id: 1, product: "Smartphone", customer: "John Doe", total: "$599.99", status: "Shipped" },
  { id: 2, product: "Laptop", customer: "Jane Smith", total: "$1299.99", status: "Processing" },
  { id: 3, product: "Headphones", customer: "Bob Johnson", total: "$149.99", status: "Delivered" },
  { id: 4, product: "Smartwatch", customer: "Alice Brown", total: "$249.99", status: "Shipped" },
  { id: 5, product: "Tablet", customer: "Charlie Davis", total: "$399.99", status: "Processing" },
]

export default function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.product}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

