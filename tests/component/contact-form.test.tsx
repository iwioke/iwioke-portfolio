import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {afterEach, describe, expect, it, vi} from "vitest";
import {ContactForm} from "@/components/contact/contact-form";
import {en} from "@/content/en";

describe("ContactForm", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows localized client validation errors without submitting", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm copy={en.contact.form} />);

    await user.click(screen.getByRole("button", {name: "Send enquiry"}));

    expect(await screen.findByText(en.contact.form.validation.name)).toBeInTheDocument();
    expect(screen.getByText(en.contact.form.validation.email)).toBeInTheDocument();
    expect(screen.getByText(en.contact.form.validation.message)).toBeInTheDocument();
    expect(screen.getByText(en.contact.form.validation.consent)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("announces success only after a positive API response", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ok: true}),
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm copy={en.contact.form} />);

    await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("A few useful details"), "I would like to discuss a considered identity and a responsive website.");
    await user.click(screen.getByLabelText(en.contact.form.consent));
    await user.click(screen.getByRole("button", {name: "Send enquiry"}));

    expect(await screen.findByText(en.contact.form.success)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/contact", expect.objectContaining({method: "POST"}));
  });

  it("keeps delivery errors honest when the endpoint is unconfigured", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ok: false}),
    }));
    render(<ContactForm copy={en.contact.form} />);

    await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("A few useful details"), "I would like to discuss a considered identity and a responsive website.");
    await user.click(screen.getByLabelText(en.contact.form.consent));
    await user.click(screen.getByRole("button", {name: "Send enquiry"}));

    expect(await screen.findByText(en.contact.form.deliveryUnavailable)).toBeInTheDocument();
  });
});
