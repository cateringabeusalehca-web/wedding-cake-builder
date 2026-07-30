import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_cake_order_status",
  title: "Update cake order status",
  description:
    "Update the pipeline status of a cake quote request (for example pending, contacted, consultation_booked, confirmed, closed).",
  inputSchema: {
    id: z.string().describe("The cake order id (uuid)."),
    status: z.string().describe("The new status value."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, status }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("cake_orders")
      .update({ status })
      .eq("id", id)
      .select("id, customer_name, status, updated_at");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data?.length) {
      return { content: [{ type: "text", text: `No order updated for id ${id}` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data[0], null, 2) }],
      structuredContent: { order: data[0] },
    };
  },
});
