/* eslint-disable camelcase */
// Resource: https://clerk.com/docs/users/sync-data-to-your-backend
// Above article shows why we need webhooks i.e., to sync data to our backend

// Resource: https://docs.svix.com/receiving/verifying-payloads/why
// It's a good practice to verify webhooks. Above article shows why we should do it
import { Webhook, WebhookRequiredHeaders } from "svix"
import { headers } from "next/headers"

import { IncomingHttpHeaders } from "http"

import { NextResponse } from "next/server"
import {
  addMemberToCommunity,
  createCommunity,
  deleteCommunity,
  removeUserFromCommunity,
  updateCommunityInfo,
} from "@/lib/actions/community.actions"

// Resource: https://clerk.com/docs/integration/webhooks#supported-events
// Above document lists the supported events
type EventType =
  | "organization.created"
  | "organizationInvitation.created"
  | "organizationMembership.created"
  | "organizationMembership.deleted"
  | "organization.updated"
  | "organization.deleted"

type Event = {
  data: Record<string, string | number | Record<string, string>[]>
  object: "event"
  type: EventType
}

const CORS_HEADERS = { "Access-Control-Allow-Origin": "*" }

// Simple GET for manual tests / health check
export const GET = () => {
  return NextResponse.json({ message: "OK" }, { status: 200, headers: CORS_HEADERS })
}

// Respond to CORS preflight
export const OPTIONS = () => {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...CORS_HEADERS,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Svix-Id, Svix-Timestamp, Svix-Signature",
    },
  })
}

export const POST = async (request: Request) => {
  // read raw body for signature verification
  const raw = await request.text()
  const header = await headers()

  const heads = {
    "svix-id": header.get("svix-id"),
    "svix-timestamp": header.get("svix-timestamp"),
    "svix-signature": header.get("svix-signature"),
  }

  if (!process.env.NEXT_CLERK_WEBHOOK_SECRET) {
    console.error("Missing NEXT_CLERK_WEBHOOK_SECRET")
    return NextResponse.json({ message: "Unauthorized" }, { status: 401, headers: CORS_HEADERS })
  }

  const wh = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || "")

  let evnt: Event | null = null

  try {
    // verify using raw string (do NOT JSON.stringify a parsed object)
    evnt = wh.verify(raw, heads as IncomingHttpHeaders & WebhookRequiredHeaders) as Event
  } catch (err) {
    console.error("Webhook verification failed:", err)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401, headers: CORS_HEADERS })
  }

  // parse payload after verify
  const payload = raw ? JSON.parse(raw) : {}
  const eventType: EventType = evnt?.type!

  // Listen organization creation event
  if (eventType === "organization.created") {
    const { id, name, slug, logo_url, image_url, created_by } = evnt?.data ?? {}

    try {
      // @ts-ignore
      await createCommunity(
        // @ts-ignore
        id,
        name,
        slug,
        logo_url || image_url,
        "org bio",
        created_by
      )
      return NextResponse.json({ message: "Organization created" }, { status: 201, headers: CORS_HEADERS })
    } catch (err) {
      console.log(err)
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500, headers: CORS_HEADERS })
    }
  }

  if (eventType === "organizationInvitation.created") {
    try {
      console.log("Invitation created", evnt?.data)
      return NextResponse.json({ message: "Invitation created" }, { status: 201, headers: CORS_HEADERS })
    } catch (err) {
      console.log(err)
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500, headers: CORS_HEADERS })
    }
  }

  if (eventType === "organizationMembership.created") {
    try {
      const { organization, public_user_data } = evnt?.data
      console.log("created", evnt?.data)
      // @ts-ignore
      await addMemberToCommunity(organization.id, public_user_data.user_id)
      return NextResponse.json({ message: "Invitation accepted" }, { status: 201, headers: CORS_HEADERS })
    } catch (err) {
      console.log(err)
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500, headers: CORS_HEADERS })
    }
  }

  if (eventType === "organizationMembership.deleted") {
    try {
      const { organization, public_user_data } = evnt?.data
      console.log("removed", evnt?.data)
      // @ts-ignore
      await removeUserFromCommunity(public_user_data.user_id, organization.id)
      return NextResponse.json({ message: "Member removed" }, { status: 201, headers: CORS_HEADERS })
    } catch (err) {
      console.log(err)
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500, headers: CORS_HEADERS })
    }
  }

  if (eventType === "organization.updated") {
    try {
      const { id, logo_url, name, slug } = evnt?.data
      console.log("updated", evnt?.data)
      // @ts-ignore
      await updateCommunityInfo(id, name, slug, logo_url)
      return NextResponse.json({ message: "Organization updated" }, { status: 201, headers: CORS_HEADERS })
    } catch (err) {
      console.log(err)
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500, headers: CORS_HEADERS })
    }
  }

  if (eventType === "organization.deleted") {
    try {
      const { id } = evnt?.data
      console.log("deleted", evnt?.data)
      // @ts-ignore
      await deleteCommunity(id)
      return NextResponse.json({ message: "Organization deleted" }, { status: 201, headers: CORS_HEADERS })
    } catch (err) {
      console.log(err)
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500, headers: CORS_HEADERS })
    }
  }

  // Unknown event -> 204
  return NextResponse.json({ message: "No action" }, { status: 204, headers: CORS_HEADERS })
}