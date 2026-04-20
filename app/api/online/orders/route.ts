import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { 
      restaurant_id, 
      customer_id, 
      phone, 
      items, 
      order_type, 
      delivery_address, 
      payment_method, 
      total_amount 
    } = await request.json();

    if (!items || items.length === 0 || !phone) {
       return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    // In a real database:
    // const order = await db.online_orders.create({
    //   data: {
    //     id: uuid(),
    //     restaurant_id,
    //     customer_id: customer_id || null, // Link to CRM
    //     customer_phone: phone,
    //     order_type,
    //     delivery_address,
    //     status: "pending",
    //     total_amount,
    //     payment_method,
    //     source: "website",
    //     created_at: new Date()
    //   }
    // });
    
    // Injecting into the POS Queue (M03 Order Management)
    // await db.pos_order_queue.create({
    //    data: { order_id: order.id, type: "ONLINE_DELIVERY", status: "NEW" }
    // });

    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    return NextResponse.json({ 
      success: true, 
      orderId, 
      message: "Order placed successfully",
      estimatedDelivery: "45 mins" 
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
