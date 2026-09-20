import {describe, expect, it} from "vitest";
import {buildContactEmail} from "@/lib/contact";
import {contactSchema, type ContactInput} from "@/lib/contact-schema";

const validInput: ContactInput = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  subject: "A visual system",
  message: "I would like to discuss a considered identity and website for our new project.",
  consent: true,
  website: "",
};

describe("contactSchema", () => {
  it("accepts a complete legitimate enquiry", () => {
    expect(contactSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects short messages, invalid email, missing consent and honeypot spam", () => {
    expect(contactSchema.safeParse({...validInput, message: "Too short"}).success).toBe(false);
    expect(contactSchema.safeParse({...validInput, email: "not-an-email"}).success).toBe(false);
    expect(contactSchema.safeParse({...validInput, consent: false}).success).toBe(false);
    expect(contactSchema.safeParse({...validInput, website: "https://spam.example"}).success).toBe(false);
  });

  it("builds escaped content for the delivery provider", () => {
    const email = buildContactEmail({...validInput, name: "<Ada>", message: "Hello <script>alert('x')</script> with enough valid message length."});
    expect(email.text).toContain("Name: <Ada>");
    expect(email.html).toContain("&lt;Ada&gt;");
    expect(email.html).not.toContain("<script>");
  });
});
