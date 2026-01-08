import { Container } from "@medusajs/ui";
import { keepPreviousData } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { _DataTable } from "../../../components/table/data-table/data-table";
import { useOrders } from "../../../hooks/api/orders";
import { useOrderTableColumns } from "../../../hooks/table/columns/use-order-table-columns";
import { useOrderTableQuery } from "../../../hooks/table/query/use-order-table-query";
import { useDataTable } from "../../../hooks/use-data-table";
import { DEFAULT_FIELDS } from "../../../routes/orders/order-list/const";

const PAGE_SIZE = 6;

export const OrderListTable = () => {
  const { t } = useTranslation();

  const { searchParams, raw } = useOrderTableQuery({
    pageSize: PAGE_SIZE,
  });

  const { orders, count, isError, error, isLoading } = useOrders(
    {
      fields: DEFAULT_FIELDS,
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  );

  const columns = useOrderTableColumns({});

  const { table } = useDataTable({
    data: orders ?? [],
    columns,
    enablePagination: true,
    count,
    pageSize: PAGE_SIZE,
  });

  if (isError) {
    throw error;
  }

  return (
    <Container className="divide-y p-0">
      <_DataTable
        columns={columns}
        table={table}
        navigateTo={(row) => `/orders/${row.original.id}`}
        count={count}
        pagination={false}
        isLoading={isLoading}
        pageSize={PAGE_SIZE}
        queryObject={raw}
        noRecords={{
          message: t("orders.list.noRecordsMessage"),
        }}
      />
    </Container>
  );
};