import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SQUARE_ACCESS_TOKEN = Deno.env.get('SQUARE_ACCESS_TOKEN');
const SQUARE_LOCATION_ID = Deno.env.get('SQUARE_LOCATION_ID');
const SQUARE_API_BASE = 'https://connect.squareup.com/v2';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { items, redirectUrl } = await req.json();

  if (!items || items.length === 0) {
    return Response.json({ error: 'No items provided' }, { status: 400 });
  }

  const lineItems = items.map((item) => ({
    name: item.product_name,
    quantity: String(item.quantity_sqm),
    base_price_money: {
      amount: Math.round((item.price_per_sqm || 0) * 100),
      currency: 'USD',
    },
  }));

  const idempotencyKey = crypto.randomUUID();

  const body = {
    idempotency_key: idempotencyKey,
    order: {
      location_id: SQUARE_LOCATION_ID,
      line_items: lineItems,
    },
    checkout_options: {
      redirect_url: redirectUrl || 'https://your-domain.com/project',
    },
  };

  const response = await fetch(`${SQUARE_API_BASE}/online-checkout/payment-links`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Square-Version': '2024-01-18',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return Response.json({ error: data.errors?.[0]?.detail || 'Square error' }, { status: 500 });
  }

  return Response.json({ checkoutUrl: data.payment_link?.url });
});