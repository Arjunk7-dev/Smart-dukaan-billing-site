import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const catalog = [
      { description: "Full-Stack Web App Development (Next.js)", rate: 1200 },
      { description: "UI/UX Design in Figma (5 Screens)", rate: 450 },
      { description: "API Integration & Database Architecture", rate: 600 },
      { description: "Monthly SEO & Website Maintenance", rate: 300 },
      { description: "Mobile App Development (React Native)", rate: 1500 },
    ];

    return NextResponse.json({ suggestions: catalog });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}