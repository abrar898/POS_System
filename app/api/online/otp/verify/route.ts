import { NextResponse } from "next/server";

// Mock verification function
export async function POST(request: Request) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
    }

    // In a real database:
    // const record = await db.online_otps.findUnique({ where: { phone } });
    // if (!record || record.expires_at < new Date() || !verify(otp, record.otp_hash)) {
    //   return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
    // }

    // Logic for returning a session token (e.g. JWT)
    // const token = jwt.sign({ phone, customerId: record.customer_id }, SECRET);

    return NextResponse.json({
      success: true,
      token: "mock-jwt-token-12345",
      user: { phone, customerId: "cust-98765", loyaltyPoints: 150 }
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
