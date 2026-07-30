import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listCakeOrders from "./tools/list-cake-orders";
import getCakeOrder from "./tools/get-cake-order";
import updateCakeOrderStatus from "./tools/update-cake-order-status";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "wedding-cake-builder",
  title: "Wedding Cake Builder",
  version: "0.1.0",
  instructions:
    "Tools for the Wedding Cake Builder lead-generation app. Use `list_cake_orders` to browse incoming wedding cake quote requests, `get_cake_order` for the full design blueprint of one request, and `update_cake_order_status` to move a lead through the pipeline. Data is scoped to the signed-in user's permissions.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listCakeOrders, getCakeOrder, updateCakeOrderStatus],
});
