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

export const POST = async (request: Request) => {
  // log entry so we know route is hit
  console.log('clerk webhook POST received')

  // read raw body (required for signature verification)
  const rawBody = await request.text()
  console.log('rawBody length', rawBody.length)

  // get headers
  const header = await headers()
  const heads = {
    "svix-id": header.get("svix-id"),
    "svix-timestamp": header.get("svix-timestamp"),
    "svix-signature": header.get("svix-signature"),
  }
  console.log('svix headers', heads)

  // accept correct env name and your .env typo as fallback while debugging
  const secret =
    process.env.NEXT_CLERK_WEBHOOK_SECRET ||
    process.env.NEXT_CLERK_wEBHOOK_SECRET ||
    ""
  if (!secret) {
    console.error('Missing webhook secret env var NEXT_CLERK_WEBHOOK_SECRET')
    return NextResponse.json({ message: 'Missing webhook secret' }, { status: 500 })
  }

  const wh = new Webhook(secret)

  let evnt: Event | null = null
  try {
    // verify using rawBody (not JSON.stringify(payload))
    evnt = wh.verify(rawBody, heads as IncomingHttpHeaders & WebhookRequiredHeaders) as Event
  } catch (err) {
    console.error('svix verify failed', err)
    return NextResponse.json({ message: String(err) }, { status: 400 })
  }

  console.log('webhook verified', evnt?.type, evnt?.data)

  const eventType: EventType = evnt?.type!

  // Listen organization creation event
  if (eventType === "organization.created") {
    console.log('organization.created payload', evnt?.data)
    try {
      // @ts-ignore
      await createCommunity(
        // @ts-ignore
        evnt?.data.id,
        // @ts-ignore
        evnt?.data.name,
        // @ts-ignore
        evnt?.data.slug,
        // @ts-ignore
        evnt?.data.logo_url || evnt?.data.image_url,
        "org bio",
        // @ts-ignore
        evnt?.data.created_by
      )
      console.log('createCommunity called successfully')
      return NextResponse.json({ message: "Organization created" }, { status: 201 })
    } catch (err) {
      console.error('createCommunity error', err)
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
  }

  // Listen organization invitation creation event.
  // Just to show. You can avoid this or tell people that we can create a new mongoose action and
  // add pending invites in the database.
  if (eventType === "organizationInvitation.created") {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Invitations#operation/CreateOrganizationInvitation
      console.log("Invitation created", evnt?.data)

      return NextResponse.json(
        { message: "Invitation created" },
        { status: 201 }
      )
    } catch (err) {
      console.log(err)

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      )
    }
  }

  // Listen organization membership (member invite & accepted) creation
  if (eventType === "organizationMembership.created") {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/CreateOrganizationMembership
      // Show what evnt?.data sends from above resource
      const { organization, public_user_data } = evnt?.data
      console.log("created", evnt?.data)

      // @ts-ignore
      await addMemberToCommunity(organization.id, public_user_data.user_id)

      return NextResponse.json(
        { message: "Invitation accepted" },
        { status: 201 }
      )
    } catch (err) {
      console.log(err)

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      )
    }
  }

  // Listen member deletion event
  if (eventType === "organizationMembership.deleted") {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/DeleteOrganizationMembership
      // Show what evnt?.data sends from above resource
      const { organization, public_user_data } = evnt?.data
      console.log("removed", evnt?.data)

      // @ts-ignore
      await removeUserFromCommunity(public_user_data.user_id, organization.id)

      return NextResponse.json({ message: "Member removed" }, { status: 201 })
    } catch (err) {
      console.log(err)

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      )
    }
  }

  // Listen organization updation event
  if (eventType === "organization.updated") {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/UpdateOrganization
      // Show what evnt?.data sends from above resource
      const { id, logo_url, name, slug } = evnt?.data
      console.log("updated", evnt?.data)

      // @ts-ignore
      await updateCommunityInfo(id, name, slug, logo_url)

      return NextResponse.json({ message: "Member removed" }, { status: 201 })
    } catch (err) {
      console.log(err)

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      )
    }
  }

  // Listen organization deletion event
  if (eventType === "organization.deleted") {
    try {
      // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/DeleteOrganization
      // Show what evnt?.data sends from above resource
      const { id } = evnt?.data
      console.log("deleted", evnt?.data)

      // @ts-ignore
      await deleteCommunity(id)

      return NextResponse.json(
        { message: "Organization deleted" },
        { status: 201 }
      )
    } catch (err) {
      console.log(err)

      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      )
    }
  }
}