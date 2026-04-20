import { NextResponse } from "next/server";

// In a real app, this would use an SMS provider like Twilio or Vonage
export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`[SMS MOCK] Sending OTP ${otp} to ${phone}`);

    // In a real database:
    // const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    // await db.online_otps.upsert({
    //   where: { phone },
    //   update: { otp_hash: hash(otp), expires_at: expiresAt, attempts: 0 },
    //   create: { phone, otp_hash: hash(otp), expires_at: expiresAt }
    // });

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
