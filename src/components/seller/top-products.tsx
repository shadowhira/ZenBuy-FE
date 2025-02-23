import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"

const topProducts = [
  { id: 1, name: "Smartphone X", sales: 1234, revenue: "$739,800" },
  { id: 2, name: "Laptop Pro", sales: 987, revenue: "$1,283,100" },
  { id: 3, name: "Wireless Earbuds", sales: 1876, revenue: "$281,400" },
  { id: 4, name: "4K Smart TV", sales: 654, revenue: "$523,200" },
  { id: 5, name: "Fitness Tracker", sales: 1543, revenue: "$231,450" },
]

export default function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sales}</TableCell>
                <TableCell>{product.revenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

