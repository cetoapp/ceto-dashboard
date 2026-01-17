import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

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
  useTotalOrders,
} from "../../hooks/api/orders";
import { useStore } from "../../hooks/api/store";
import { formatCurrency } from "../../lib/format-currency";
import { useInventoryItems } from "../../hooks/api/inventory";
import { useMe } from "../../hooks/api/users";

export const Home = () => {
  const { t } = useTranslation();

  // load user data
  const { user, isLoading: isLoadingUser } = useMe();
  const adminName = useMemo(() => {
    if (isLoadingUser) return "admin";
    return user?.first_name ?? "admin";
  }, [user, isLoadingUser]);

  // Load store data to get currency info
  const { store, isLoading: isStoreLoading } = useStore();
  const currency = store?.supported_currencies?.[0]?.currency_code ?? "TND";

  // Load total revenue and average order value with trends
  const {
    totalRevenue,
    avgOrderValue,
    trend: revenueTrend,
    isLoading: isLoadingRevenue,
  } = useOrderRevenueMetrics();

  // Load total orders placed today
  const {
    count: ordersTodayCount,
    trend: ordersTodayTrend,
    isLoading: isLoadingToday,
  } = useOrdersToday();

  // Load total orders count
  const { count: totalOrdersCount, isLoading: isLoadingTotalOrders } =
    useTotalOrders();

  // Load inventory items
  const { inventory_items, isLoading: isLoadingInventory } = useInventoryItems(
    {}
  );

  // Compute SKUs with zero inventory across all locations
  const zeroInventorySkus = useMemo(() => {
    if (!inventory_items) return [];

    return inventory_items
      .filter((item) =>
        item.location_levels?.every((level) => level.available_quantity === 0)
      )
      .map((item) => ({
        name: item.sku,
        id: item.id,
      }));
  }, [inventory_items]);

  // Determine if any data is still loading
  const isLoading =
    isLoadingRevenue ||
    isLoadingToday ||
    isStoreLoading ||
    isLoadingTotalOrders;

  // Determine direction and formatting for revenue trend
  const isPositive = revenueTrend > 0;
  const isNegative = revenueTrend < 0;

  // Determine direction and formatting for orders today trend
  const isOrdersTodayPositive = ordersTodayTrend > 0;
  const isOrdersTodayNegative = ordersTodayTrend < 0;

  // Define the metrics to be displayed
  const metrics = [
    {
      label: t("home.revenue"),
      value: totalRevenue
        ? formatCurrency(totalRevenue, currency!)
        : formatCurrency(0, currency!),

      trend: `${isPositive ? "+" : ""}${Math.round(revenueTrend)}%`,
      trendDirection: isPositive ? "up" : isNegative ? "down" : "neutral",
      icon: CurrencyDollar,
    },
    {
      label: t("home.avg_order"),
      value: avgOrderValue
        ? formatCurrency(avgOrderValue, currency!)
        : formatCurrency(0, currency!),
      trend: "",
      trendDirection: "neutral",
      icon: CurrencyDollar,
    },
    {
      label: t("home.order_today"),
      value: ordersTodayCount?.toString() || "0",

      trend: `${isOrdersTodayPositive ? "+" : ""}${ordersTodayTrend.toFixed(
        0
      )}%`,
      trendDirection: isOrdersTodayPositive
        ? "up"
        : isOrdersTodayNegative
        ? "down"
        : "neutral",

      icon: ShoppingCart,
    },
    {
      label: t("home.order_total"),
      value: totalOrdersCount?.toString() || "0",
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
            {getGreeting(adminName, t)}
          </Heading>
          <Text className="text-sm text-ui-fg-subtle sm:text-base">
            {t("home.welcome")}
          </Text>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-x-2 sm:pt-0 pt-2">
          <Link to="/analytics">
            <Button
              variant="secondary"
              size="small"
              className="w-full sm:w-auto"
            >
              <span>{t("home.analytics")}</span>
            </Button>
          </Link>
          <Link to="/draft-orders">
            <Button size="small" className="w-full sm:w-auto">
              {t("home.draft_order")}
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
            <Heading level="h2">{t("home.recent_orders")}</Heading>
            <Link to="/orders">
              <Button variant="secondary">{t("home.view_all_orders")}</Button>
            </Link>
          </div>
          <OrderListTable />
        </Container>

        <div className="flex flex-col gap-y-4">
          <Container className="p-0 h-80 flex flex-col">
            <div className="flex items-center gap-x-2 px-6 py-4 border-b border-ui-border-base bg-ui-bg-base-subtle shrink-0">
              <ExclamationCircle className="text-orange-500" />
              <Heading level="h3" className="text-sm">
                {t("home.out_of_stock")}
              </Heading>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoadingInventory
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center px-6 py-3 border-b border-ui-border-base last:border-0"
                    >
                      <div className="h-4 w-2/3 animate-pulse rounded bg-ui-bg-base-hover" />
                    </div>
                  ))
                : zeroInventorySkus.map((item, i) => (
                    <div
                      key={i}
                      className="px-6 py-2 border-b border-ui-border-base last:border-0 hover:bg-ui-bg-base-hover"
                    >
                      <Link
                        to={`/inventory/${item.id}`}
                        className="truncate text-xs flex items-center justify-between"
                      >
                        <span>{item.name}</span>
                        <span className="text-xs text-orange-500 font-medium">
                          {t("home.out_of_stock_status")}
                        </span>
                      </Link>
                    </div>
                  ))}
            </div>

            <div className="p-3 border-t border-ui-border-base shrink-0">
              <Link to="/inventory">
                <Button
                  variant="secondary"
                  className="w-full text-ui-fg-subtle"
                >
                  {t("home.restock")}
                </Button>
              </Link>
            </div>
          </Container>

          <Container className="px-6 py-4 bg-ui-bg-base-subtle border-dashed border-ui-border-strong">
            <div className="flex items-center gap-x-2 mb-2">
              <ReceiptPercent className="text-orange-500" />
              <Heading level="h3">{t("home.boost")}</Heading>
            </div>
            <Text className="text-ui-fg-subtle text-sm mb-4">
              {t("home.promo_message")}
            </Text>
            <Link to="/promotions">
              <Button className="w-full">{t("home.promo_visit")}</Button>
            </Link>
          </Container>
        </div>
      </div>
    </div>
  );
};
