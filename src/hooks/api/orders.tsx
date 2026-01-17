import { FetchError } from "@medusajs/js-sdk";
import { CreateOrderCreditLineDTO, HttpTypes } from "@medusajs/types";
import {
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { sdk } from "../../lib/client";
import { queryClient } from "../../lib/query-client";
import { queryKeysFactory, TQueryKey } from "../../lib/query-key-factory";
import { inventoryItemsQueryKeys } from "./inventory";
import { reservationItemsQueryKeys } from "./reservations";

const ORDERS_QUERY_KEY = "orders" as const;
const _orderKeys = queryKeysFactory(ORDERS_QUERY_KEY) as TQueryKey<"orders"> & {
  preview: (orderId: string) => any;
  changes: (orderId: string) => any;
  lineItems: (orderId: string) => any;
  shippingOptions: (orderId: string) => any;
};

_orderKeys.preview = function (id: string) {
  return [this.detail(id), "preview"];
};

_orderKeys.changes = function (id: string) {
  return [this.detail(id), "changes"];
};

_orderKeys.lineItems = function (id: string) {
  return [this.detail(id), "lineItems"];
};

_orderKeys.shippingOptions = function (id: string) {
  return [this.detail(id), "shippingOptions"];
};

export const ordersQueryKeys = _orderKeys;

export const useOrder = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<
    UseQueryOptions<any, FetchError, any, QueryKey>,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.order.retrieve(id, query),
    queryKey: ordersQueryKeys.detail(id, query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useUpdateOrder = (
  id: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderResponse,
    FetchError,
    HttpTypes.AdminUpdateOrder
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminUpdateOrder) =>
      sdk.admin.order.update(id, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.changes(id),
      });

      // TODO: enable when needed
      // queryClient.invalidateQueries({
      //   queryKey: ordersQueryKeys.lists(),
      // })

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useOrderPreview = (
  id: string,
  query?: HttpTypes.AdminOrderFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminOrderPreviewResponse,
      FetchError,
      HttpTypes.AdminOrderPreviewResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.order.retrievePreview(id, query),
    queryKey: ordersQueryKeys.preview(id),
    ...options,
  });

  return { ...data, ...rest };
};

export const useOrders = (
  query?: HttpTypes.AdminOrderFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminOrderListResponse,
      FetchError,
      HttpTypes.AdminOrderListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.order.list(query),
    queryKey: ordersQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useOrderShippingOptions = (
  id: string,
  query?: HttpTypes.AdminGetOrderShippingOptionList,
  options?: Omit<
    UseQueryOptions<
      { shipping_options: HttpTypes.AdminShippingOption[] },
      FetchError,
      { shipping_options: HttpTypes.AdminShippingOption[] },
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.order.listShippingOptions(id, query),
    queryKey: ordersQueryKeys.shippingOptions(id),
    ...options,
  });

  return { ...data, ...rest };
};

export const useOrderChanges = (
  id: string,
  query?: HttpTypes.AdminOrderChangesFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminOrderChangesResponse,
      FetchError,
      HttpTypes.AdminOrderChangesResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.order.listChanges(id, query),
    queryKey: ordersQueryKeys.changes(id),
    ...options,
  });

  return { ...data, ...rest };
};

export const useOrderLineItems = (
  id: string,
  query?: HttpTypes.AdminOrderItemsFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminOrderLineItemsListResponse,
      FetchError,
      HttpTypes.AdminOrderLineItemsListResponse,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.order.listLineItems(id, query),
    queryKey: ordersQueryKeys.lineItems(id),
    ...options,
  });

  return { ...data, ...rest };
};

export const useCreateOrderFulfillment = (
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderResponse,
    FetchError,
    HttpTypes.AdminCreateOrderFulfillment
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminCreateOrderFulfillment) =>
      sdk.admin.order.createFulfillment(orderId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      });

      queryClient.invalidateQueries({
        queryKey: reservationItemsQueryKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.details(),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useCancelOrderFulfillment = (
  orderId: string,
  fulfillmentId: string,
  options?: UseMutationOptions<any, FetchError, any>
) => {
  return useMutation({
    mutationFn: (payload: { no_notification?: boolean }) =>
      sdk.admin.order.cancelFulfillment(orderId, fulfillmentId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      });

      queryClient.invalidateQueries({
        queryKey: reservationItemsQueryKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: inventoryItemsQueryKeys.details(),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useCreateOrderShipment = (
  orderId: string,
  fulfillmentId: string,
  options?: UseMutationOptions<
    { order: HttpTypes.AdminOrder },
    FetchError,
    HttpTypes.AdminCreateOrderShipment
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminCreateOrderShipment) =>
      sdk.admin.order.createShipment(orderId, fulfillmentId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useMarkOrderFulfillmentAsDelivered = (
  orderId: string,
  fulfillmentId: string,
  options?: UseMutationOptions<
    { order: HttpTypes.AdminOrder },
    FetchError,
    void
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.order.markAsDelivered(orderId, fulfillmentId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useCancelOrder = (
  orderId: string,
  options?: UseMutationOptions<HttpTypes.AdminOrderResponse, FetchError, void>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.order.cancel(orderId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.detail(orderId),
      });

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useRequestTransferOrder = (
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderResponse,
    FetchError,
    HttpTypes.AdminRequestOrderTransfer
  >
) => {
  return useMutation({
    mutationFn: (payload: HttpTypes.AdminRequestOrderTransfer) =>
      sdk.admin.order.requestTransfer(orderId, payload),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      });

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.changes(orderId),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useCancelOrderTransfer = (
  orderId: string,
  options?: UseMutationOptions<any, FetchError, void>
) => {
  return useMutation({
    mutationFn: () => sdk.admin.order.cancelTransfer(orderId),
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      });

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.changes(orderId),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useCreateOrderCreditLine = (
  orderId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderResponse,
    FetchError,
    Omit<CreateOrderCreditLineDTO, "order_id">
  >
) => {
  return useMutation({
    mutationFn: (payload) => sdk.admin.order.createCreditLine(orderId, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      });

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useUpdateOrderChange = (
  orderChangeId: string,
  options?: UseMutationOptions<
    HttpTypes.AdminOrderChangeResponse,
    FetchError,
    { carry_over_promotions: boolean }
  >
) => {
  return useMutation({
    mutationFn: (payload: { carry_over_promotions: boolean }) =>
      sdk.admin.order.updateOrderChange(orderChangeId, payload),
    onSuccess: (data, variables, context) => {
      const orderId = data.order_change.order_id;

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.details(),
      });

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.preview(orderId),
      });

      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.changes(orderId),
      });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useExportOrders = (
  query?: HttpTypes.AdminOrderFilters,
  options?: UseMutationOptions<
    { transaction_id: string },
    FetchError,
    HttpTypes.AdminOrderFilters
  >
) => {
  return useMutation({
    mutationFn: () => sdk.admin.order.export(query),
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

const getStartOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const getStartOfYesterday = () => {
  const date = getStartOfToday();
  date.setDate(date.getDate() - 1);
  return date;
};

const getEndOfYesterday = () => {
  const date = getStartOfToday();
  date.setMilliseconds(-1);
  return date;
};

// export const useOrderRevenueMetrics = (
//   query?: HttpTypes.AdminOrderFilters,
//   options?: Omit<
//     UseQueryOptions<
//       HttpTypes.AdminOrderListResponse,
//       FetchError,
//       { totalRevenue: number; avgOrderValue: number; count: number },
//       QueryKey
//     >,
//     "queryFn" | "queryKey"
//   >
// ) => {
//   const { data, ...rest } = useQuery({
//     queryFn: async () => sdk.admin.order.list(query),
//     queryKey: ordersQueryKeys.list(query),
//     ...options,
//     select: (response) => {
//       const orders = response.orders || []
//       const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0)
//       const count = response.count || orders.length
//       const avgOrderValue = count > 0 ? totalRevenue / count : 0

//       return {
//         totalRevenue,
//         avgOrderValue,
//         count,
//       }
//     },
//   })

//   return { ...data, ...rest }
// }

export const useOrderRevenueMetrics = (
  query?: HttpTypes.AdminOrderFilters,
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminOrderListResponse,
      FetchError,
      {
        totalRevenue: number;
        avgOrderValue: number;
        count: number;
        todayRevenue: number;
        yesterdayRevenue: number;
        trend: number;
      },
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  // 1. We remove the forced 'created_at' filter so we get ALL data for the global metrics.
  // We keep a high limit to ensure 'totalRevenue' sums up everything, not just page 1.
  const metricsQuery: HttpTypes.AdminOrderFilters = {
    limit: 10000,
    ...query,
  };

  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.order.list(metricsQuery),
    queryKey: ordersQueryKeys.list(metricsQuery),
    ...options,
    select: (response) => {
      const orders = response.orders || [];

      // Timestamps for comparison
      const startOfToday = getStartOfToday().getTime();
      const startOfYesterday = getStartOfYesterday().getTime();

      // 2. Initialize counters
      let todayRevenue = 0;
      let yesterdayRevenue = 0;
      let totalRevenue = 0;

      orders.forEach((order) => {
        const orderDate = new Date(order.created_at).getTime();
        const orderTotal = order.total || 0;

        // A. Always add to Total Revenue (Global Metric)
        totalRevenue += orderTotal;

        // B. Check if this order specifically belongs to Today or Yesterday (Trend Metric)
        if (orderDate >= startOfToday) {
          todayRevenue += orderTotal;
        } else if (orderDate >= startOfYesterday && orderDate < startOfToday) {
          // Strictly yesterday: Greater than start of yesterday, but less than start of today
          yesterdayRevenue += orderTotal;
        }
      });

      const count = response.count || orders.length;
      const avgOrderValue = count > 0 ? totalRevenue / count : 0;

      // 3. Calculate Trend % (Today vs Yesterday)
      let trend = 0;
      if (yesterdayRevenue === 0) {
        // If yesterday was 0 and today is > 0, we treat it as 100% growth
        trend = todayRevenue > 0 ? 100 : 0;
      } else {
        trend = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
      }

      return {
        totalRevenue, // Sum of ALL orders fetched
        avgOrderValue, // Average of ALL orders fetched
        count, // Count of ALL orders fetched
        todayRevenue, // Specific bucket: Today
        yesterdayRevenue, // Specific bucket: Yesterday
        trend, // Trend percentage
      };
    },
  });

  return {
    ...rest,
    totalRevenue: data?.totalRevenue ?? 0,
    avgOrderValue: data?.avgOrderValue ?? 0,
    count: data?.count ?? 0,
    todayRevenue: data?.todayRevenue ?? 0,
    yesterdayRevenue: data?.yesterdayRevenue ?? 0,
    trend: data?.trend ?? 0,
  };
};

export const useOrdersToday = (
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminOrderListResponse,
      FetchError,
      { 
        count: number;          // Today's count
        yesterdayCount: number; // Yesterday's count
        trend: number           // Percentage difference
      },
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  // 1. Fetch orders starting from YESTERDAY to allow comparison
  const trendQuery: HttpTypes.AdminOrderFilters = {
    limit: 10000, // Ensure we get all recent orders
    created_at: {
      $gte: getStartOfYesterday().toISOString(),
    },
  }

  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.order.list(trendQuery),
    queryKey: ordersQueryKeys.list(trendQuery),
    ...options,
    select: (response) => {
      const orders = response.orders || []
      
      const startOfToday = getStartOfToday().getTime()
      const startOfYesterday = getStartOfYesterday().getTime()

      let todayCount = 0
      let yesterdayCount = 0

      // 2. Iterate and bucket the counts
      orders.forEach((order) => {
        const orderDate = new Date(order.created_at).getTime()

        if (orderDate >= startOfToday) {
          todayCount++
        } else if (orderDate >= startOfYesterday) {
          yesterdayCount++
        }
      })

      // 3. Calculate Trend %
      let trend = 0
      if (yesterdayCount === 0) {
        trend = todayCount > 0 ? 100 : 0
      } else {
        trend = ((todayCount - yesterdayCount) / yesterdayCount) * 100
      }

      return {
        count: todayCount, // Keeping 'count' as the primary "Today" value
        yesterdayCount,
        trend,
      }
    },
  })

  // 4. Return safe defaults to avoid 'undefined' errors
  return { 
    ...rest, 
    count: data?.count ?? 0,
    yesterdayCount: data?.yesterdayCount ?? 0,
    trend: data?.trend ?? 0
  }
}

export const useTotalOrders = (
  options?: Omit<
    UseQueryOptions<
      HttpTypes.AdminOrderListResponse,
      FetchError,
      { count: number },
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryFn: async () => sdk.admin.order.list(),
    queryKey: ordersQueryKeys.list(),
    ...options,
    select: (response) => ({
      count: response.count,
    }),
  });

  return { ...data, ...rest };
};
