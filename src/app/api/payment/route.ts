import { getServiceById } from "@/data/service";
import { convertToSubcurrency } from "@/lib/convertToSubcurrency";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { businessId, serviceId, employeeId, startTime, date, description } =
      await req.json();

    if (!businessId || !serviceId || !employeeId || !startTime || !date) {
      return NextResponse.json(
        { error: "Missing booking info" },
        { status: 400 }
      );
    }

    console.log(businessId, serviceId, date, description);

    const service = await getServiceById(serviceId);
    const domain = process.env.NEXT_PUBLIC_APP_URL;

    if (!service) {
      return NextResponse.json({ error: "Service not found!" });
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price_data: {
            unit_amount: convertToSubcurrency(service?.price),
            currency: "eur",
            product_data: {
              name: service?.name,
            },
          },
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      mode: "payment",
      automatic_tax: { enabled: true },
      metadata: {
        businessId,
        serviceId,
        employeeId,
        startTime,
        date,
        description,
      },
      return_url: `${domain}/booking/result?sessionId={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({
      id: session.id,
      clientSecret: session.client_secret,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
