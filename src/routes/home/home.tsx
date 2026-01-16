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
import {
  useOrderRevenueMetrics,
  useOrdersToday,
  usePendingReturnOrders,
} from "../../hooks/api/orders";
import { useStore } from "../../hooks/api/store";
import { formatCurrency } from "../../lib/format-currency";

const MOCK_DATA = {
  user: {
    firstName: "Ghazi",
  },
  lowStock: [
    { name: "Classic T-Shirt (Black/L)", quantity: 2 },
    { name: "Leather Wallet", quantity: 0 },
    { name: "Summer Cap", quantity: 4 },
  ],
};

export const Home = () => {
  // Load store data to get currency info
  const { store, isLoading: isStoreLoading } = useStore();
  const currency = store?.supported_currencies[0].currency_code;

  const {
    totalRevenue,
    avgOrderValue,
    isLoading: isLoadingRevenue,
  } = useOrderRevenueMetrics({ limit: 1000 });

  const { count: ordersTodayCount, isLoading: isLoadingToday } =
    useOrdersToday();

  // 3. Fetch Pending Returns
  const { count: returnsCount, isLoading: isLoadingReturns } =
    usePendingReturnOrders();

  const isLoading = isLoadingRevenue || isLoadingToday || isStoreLoading || isLoadingReturns;

  const metrics = [
    {
      label: "Total Revenue",
      value: totalRevenue
        ? formatCurrency(totalRevenue, currency!)
        : `${currency}0.00`,
      trend: "+12%",
      trendDirection: "up",
      icon: CurrencyDollar,
    },
    {
      label: "Orders Today",
      value: ordersTodayCount?.toString() || "0",
      trend: "+4",
      trendDirection: "up",
      icon: ShoppingCart,
    },
    {
      label: "Avg. Order Value",
      value: avgOrderValue
        ? formatCurrency(avgOrderValue, currency!)
        : `${currency}0.00`,
      trend: "+8%",
      trendDirection: "up",
      icon: CurrencyDollar,
    },
    {
      label: "Returns Pending",
      value: returnsCount?.toString() || "0",
      trend: "",
      trendDirection: "neutral",
      icon: ExclamationCircle,
    },
  ];

  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div className="flex flex-col gap-4 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Heading
            level="h2"
            className="text-lg font-medium text-ui-fg-base sm:text-xl"
          >
            {getGreeting(MOCK_DATA.user.firstName)}
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
        {metrics.map((metric, index) => (
          <Container key={index} className="flex flex-col gap-y-2 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2 text-ui-fg-subtle">
                <metric.icon className="h-4 w-4" />
                <Text size="small" leading="compact" weight="plus">
                  {metric.label}
                </Text>
              </div>

              {/* SKELETON FOR TREND */}
              {isLoading ? (
                <div className="h-4 w-12 animate-pulse rounded bg-ui-bg-base-hover" />
              ) : (
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
              )}
            </div>

            {/* SKELETON FOR VALUE */}
            {isLoading ? (
              <div className="mt-1 h-8 w-24 animate-pulse rounded bg-ui-bg-base-hover" />
            ) : (
              <Heading level="h2" className="text-2xl">
                {metric.value}
              </Heading>
            )}
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
          {/* Ensure OrderListTable handles its own loading state or wrap it similarly */}
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
              {MOCK_DATA.lowStock.map((item, i) => (
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
