import { Link } from "react-router-dom";

import { Container, Heading, Text, Button } from "@medusajs/ui";
import {
  CurrencyDollar,
  ShoppingCart,
  ArrowUpMini,
  ArrowDownMini,
  ExclamationCircle,
  ReceiptPercent,
} from "@medusajs/icons";

import { getGreeting } from "../../utils/general-utils";
import { OrderListTable } from "./components/order-list";

const MOCK_DATA = {
  user: {
    firstName: "Admin",
  },
  metrics: [
    {
      label: "Total Revenue",
      value: "$12,450.00",
      trend: "+12%",
      trendDirection: "up",
      icon: CurrencyDollar,
    },
    {
      label: "Orders Today",
      value: "24",
      trend: "+4",
      trendDirection: "up",
      icon: ShoppingCart,
    },
    {
      label: "Avg. Order Value",
      value: "$115.50",
      trend: "+8%",
      trendDirection: "up",
      icon: CurrencyDollar,
    },
    {
      label: "Returns Pending",
      value: "3",
      trend: "",
      trendDirection: "neutral",
      icon: ExclamationCircle,
    },
  ],
  pendingOrders: [
    {
      id: "#1024",
      customer: "Alice Freeman",
      total: "$120.00",
      status: "paid",
      items: 3,
      date: "2 hrs ago",
    },
    {
      id: "#1023",
      customer: "Bob Smith",
      total: "$55.50",
      status: "awaiting",
      items: 1,
      date: "4 hrs ago",
    },
    {
      id: "#1022",
      customer: "Charlie Day",
      total: "$210.00",
      status: "paid",
      items: 5,
      date: "5 hrs ago",
    },
    {
      id: "#1021",
      customer: "Dana White",
      total: "$45.00",
      status: "paid",
      items: 1,
      date: "Yesterday",
    },
  ],
  lowStock: [
    { name: "Classic T-Shirt (Black/L)", quantity: 2 },
    { name: "Leather Wallet", quantity: 0 },
    { name: "Summer Cap", quantity: 4 },
  ],
};

export const Home = () => {
  // In the future, you will replace this line with: const { data } = useAdminCustomQuery(...)
  const data = MOCK_DATA;

  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Heading
            level="h1"
            className="text-lg font-semibold text-ui-fg-base sm:text-xl"
          >
            {getGreeting(data.user.firstName)}
          </Heading>
          <Text className="text-sm text-ui-fg-subtle sm:text-base">
            Here is what's happening in your store today.
          </Text>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-x-2 sm:pt-0 pt-2">
          <Link to="/analytics">
            <Button
              variant="secondary"
              size="small"
              className="w-full sm:w-auto"
            >
              <span>View Analytics</span>
            </Button>
          </Link>
          <Link to="/draft-orders">
            <Button size="small" className="w-full sm:w-auto">
              Create Draft Order
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((metric, index) => (
          <Container key={index} className="flex flex-col gap-y-2 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2 text-ui-fg-subtle">
                <metric.icon className="h-4 w-4" />
                <Text size="small" leading="compact" weight="plus">
                  {metric.label}
                </Text>
              </div>
              <div
                className={`flex items-center gap-x-1 text-xs ${
                  metric.trendDirection === "up"
                    ? "text-green-600"
                    : metric.trendDirection === "down"
                      ? "text-red-600"
                      : "text-ui-fg-muted"
                }`}
              >
                {metric.trendDirection === "up" && <ArrowUpMini />}
                {metric.trendDirection === "down" && <ArrowDownMini />}
                <span>{metric.trend}</span>
              </div>
            </div>
            <Heading level="h2" className="text-2xl">
              {metric.value}
            </Heading>
          </Container>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Container className="col-span-1 p-0 lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ui-border-base">
            <Heading level="h2">Recent orders</Heading>
            <Link to="/orders">
              <Button variant="secondary">View All</Button>
            </Link>
          </div>
          <OrderListTable />
        </Container>

        <div className="flex flex-col gap-y-4">
          <Container className="p-0 overflow-hidden">
            <div className="flex items-center gap-x-2 px-6 py-4 border-b border-ui-border-base bg-ui-bg-base-subtle">
              <ExclamationCircle className="text-orange-500" />
              <Heading level="h3" className="text-sm">
                Low Stock Alert
              </Heading>
            </div>
            <div className="flex flex-col">
              {data.lowStock.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-2 border-b border-ui-border-base last:border-0 hover:bg-ui-bg-base-hover"
                >
                  <Text
                    size="small"
                    className="truncate w-2/3"
                    title={item.name}
                  >
                    {item.name}
                  </Text>
                  <span className="inline-block text-xs font-semibold border px-2.5 py-1 rounded-lg">
                    {item.quantity} left
                  </span>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-ui-border-base">
              <Link to="/inventory">
                <Button
                  variant="secondary"
                  className="w-full text-ui-fg-subtle"
                >
                  Restock Inventory
                </Button>
              </Link>
            </div>
          </Container>
          <Container className="px-6 py-4 bg-ui-bg-base-subtle border-dashed border-ui-border-strong">
            <div className="flex items-center gap-x-2 mb-2">
              <ReceiptPercent className="text-orange-500" />
              <Heading level="h3">Boost Sales</Heading>
            </div>
            <Text className="text-ui-fg-subtle text-sm mb-4">
              Boost Your Sales Today! Don’t let traffic go to waste—start a
              Promotion and watch results roll in.
            </Text>
            <Link to="/promotions">
              <Button className="w-full">Create a promotion</Button>
            </Link>
          </Container>
        </div>
      </div>
    </div>
  );
};
