import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { playSound } from "@/components/Playsound";
import api from "@/api/api";

export default function useOrdersManager({
  queryKey,
  fetchParams,
}) {
  const qc = useQueryClient();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openPanel, setOpenPanel] = useState(false);

  /* =======================
     FETCH ORDERS
  ======================= */
  const ordersQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get("/restaurant/orders/filter", {
        params: fetchParams(),
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  /* =======================
     UPDATE ORDER
  ======================= */
  const updateOrder = useMutation({
    mutationFn: (payload) =>
      api.post("/restaurant/orders/update", payload),

    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (q) => q.queryKey[0] === queryKey[0],
      });
      playSound();
      toast.success("Order Updated Successfully");
      setOpenPanel(false);
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update Order"
      );
    },
  });

  /* =======================
     SAVE HANDLER
  ======================= */
  const handleSaveOrder = (updatedOrder, deletedItems = []) => {
    updateOrder.mutate({
      order_id: updatedOrder.id,
      status: updatedOrder.status,
      payment_status: updatedOrder.payment_status,
      payment_method: updatedOrder.payment_method,
      order_note: updatedOrder.order_note,

      items: updatedOrder.items.map((it) => ({
        order_item_id: it.is_new ? null : it.id,
        menu_item_id: it.is_new ? it.menu_item_id : undefined,
        quantity: it.quantity,
        item_note: it.item_note,
      })),

      deleted_items: deletedItems,
    });
  };

  return {
    ordersQuery,
    selectedOrder,
    setSelectedOrder,
    openPanel,
    setOpenPanel,
    handleSaveOrder,
  };
}
