import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_cake_orders",
  title: "List cake orders",
  description:
    "List wedding cake quote requests (leads) captured by the builder, newest first. Optionally filter by status.",
  inputSchema: {
    status: z
      .string()
      .optional()
      .describe("Optional status filter, e.g. pending, contacted, confirmed."),
    limit: z.number().int().optional().describe("Max rows to return (default 20, max 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const capped = Math.min(Math.max(limit ?? 20, 1), 100);
    let query = supabase
      .from("cake_orders")
      .select(
        "id, customer_name, customer_email, customer_phone, event_date, guest_count, estimated_price, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(capped);
    if (status) query = query.eq("status", status);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { orders: data ?? [] },
    };
  },
});
