import type {ContactInput} from "./contact-schema";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;",
  })[character] ?? character);
}

export function buildContactEmail(input: ContactInput) {
  const details = [
    ["Name", input.name],
    ["Email", input.email],
    ["Company / team", input.company || "—"],
    ["Project subject", input.subject || "—"],
  ] as const;

  const text = `${details.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\nMessage:\n${input.message}`;
  const html = `
    <h1>New portfolio enquiry</h1>
    <dl>
      ${details.map(([label, value]) => `<dt><strong>${label}</strong></dt><dd>${escapeHtml(value)}</dd>`).join("")}
    </dl>
    <h2>Message</h2>
    <p>${escapeHtml(input.message).replace(/\n/g, "<br />")}</p>
  `;

  return {text, html};
}
