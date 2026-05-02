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

    // Create line items for cart
    const lineItems = items.map(item => ({
      quantity: Math.ceil(item.quantity_sqm || 1),
      merchandiseId: `gid://shopify/ProductVariant/${item.product_id}`,
      customAttributes: [
        { key: 'Area (m²)', value: String(item.quantity_sqm) },
        { key: 'Price/m²', value: `$${item.price_per_sqm}` }
      ]
    }));

    // Create cart via Storefront API
    const createCartMutation = `
      mutation {
        cartCreate(
          input: {
            lines: ${JSON.stringify(lineItems).replace(/"([^"]+)":/g, '$1:')}
          }
        ) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const shopifyResponse = await fetch(STOREFRONT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': clientId,
      },
      body: JSON.stringify({ query: createCartMutation }),
    });

    const data = await shopifyResponse.json();

    if (data.errors) {
      return Response.json({ 
        error: 'Failed to create checkout',
        details: data.errors[0].message 
      }, { status: 400 });
    }

    const checkoutUrl = data.data?.cartCreate?.cart?.checkoutUrl;
    if (!checkoutUrl) {
      return Response.json({ 
        error: 'No checkout URL returned',
        details: data.data?.cartCreate?.userErrors 
      }, { status: 400 });
    }

    return Response.json({ checkoutUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});