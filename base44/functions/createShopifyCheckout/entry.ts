import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SHOPIFY_STORE = 'epichome-6102';
const STOREFRONT_API_URL = `https://${SHOPIFY_STORE}.myshopify.com/api/2024-01/graphql.json`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, redirectUrl } = await req.json();

    if (!items || items.length === 0) {
      return Response.json({ error: 'No items in cart' }, { status: 400 });
    }

    const clientId = Deno.env.get('SHOPIFY_CLIENT_ID');
    if (!clientId) {
      return Response.json({ error: 'Shopify not configured' }, { status: 500 });
    }

    // Create line items for cart - using product titles since we don't have variant IDs
    const lineItems = items.map(item => ({
      quantity: Math.ceil(item.quantity_sqm || 1),
      title: item.product_name,
      price: item.price_per_sqm
    }));

    // For Shopify, we'll create a checkout URL directly
    const checkoutUrl = `https://${SHOPIFY_STORE}.myshopify.com/cart/add?id=` + 
      items.map((_, i) => `1:${i + 1}`).join(',');

    // Build cart parameters
    const cartParams = items.map((item, index) => {
      return `id:1&quantity:${Math.ceil(item.quantity_sqm || 1)}`;
    }).join('&');

    const finalCheckoutUrl = `https://${SHOPIFY_STORE}.myshopify.com/checkout?${cartParams}`;

    return Response.json({ checkoutUrl: finalCheckoutUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});