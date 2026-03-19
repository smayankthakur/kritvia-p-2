import { NextRequest } from "next/server"
import nodemailer from "nodemailer"
import { validateInput, contactSchema } from "@/lib/validators"
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit"
import { 
  successResponse, 
  errorResponse, 
  rateLimitResponse,
  serverErrorResponse 
} from "@/lib/api-response"

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const rateLimitKey = `contact:${ip}`
    const rateLimitResult = rateLimit(rateLimitKey, RATE_LIMITS.CONTACT)
    
    if (!rateLimitResult.success) {
      return rateLimitResponse()
    }

    const body = await request.json()
    
    // Check honeypot field (if filled, it's likely a bot)
    if (body.website) {
      // Silent success for bots
      return successResponse({ success: true }, "Message sent successfully")
    }
    
    // Validate input with Zod
    const validation = validateInput(contactSchema, body)
    if (!validation.success) {
      return errorResponse(validation.error)
    }

    const { name, email, message } = validation.data

    // Additional email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return errorResponse("Invalid email address format")
    }

    // Sanitize inputs
    const sanitizedName = name.slice(0, 100).trim()
    const sanitizedMessage = message.slice(0, 1000).trim()

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Email options
    const mailOptions = {
      from: `"${sanitizedName}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${sanitizedName}`,
      text: `
        Name: ${sanitizedName}
        Email: ${email}
        Message: ${sanitizedMessage}
      `,
      html: `
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${sanitizedMessage}</p>
      `,
    }

    // Send email with retry
    let sent = false
    let lastError: Error | null = null
    
    for (let attempt = 0; attempt < 3 && !sent; attempt++) {
      try {
        await transporter.sendMail(mailOptions)
        sent = true
      } catch (err) {
        lastError = err as Error
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
      }
    }

    if (!sent) {
      console.error('Email send failed:', lastError)
      return serverErrorResponse("Failed to send email. Please try again later.")
    }

    return successResponse({ success: true }, "Message sent successfully")
  } catch (error) {
    console.error("Contact API Error:", error)
    return serverErrorResponse()
  }
}
