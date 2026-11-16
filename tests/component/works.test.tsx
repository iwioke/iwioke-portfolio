import {act, render, screen, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {Works} from "@/components/works";

const goTo = (hash: string) => act(() => {
  history.replaceState(null, "", hash);
  dispatchEvent(new HashChangeEvent("hashchange"));
});

describe("Works", () => {
  beforeEach(() => {
    history.replaceState(null, "", "/");
    Element.prototype.scrollIntoView = vi.fn();
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) { this.setAttribute("open", ""); });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    });
  });

  it("shows the three top-level folders", () => {
    render(<Works />);
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual(["#folder-identity", "#folder-websites", "#folder-posters"]);
    expect(screen.getByText("12 works · 1 project")).toBeInTheDocument();
    expect(screen.getByText("10 works · 2 projects")).toBeInTheDocument();
  });

  it("opens a folder from the hash and cycles works in the lightbox", async () => {
    const user = userEvent.setup();
    render(<Works />);
    goTo("#folder-posters");
    expect(screen.getByRole("heading", {name: "Posters"})).toBeInTheDocument();
    expect(screen.getByRole("link", {name: "← All sections"})).toHaveAttribute("href", "#works");

    await user.click(screen.getByRole("button", {name: "Open: Broken"}));
    const dialog = screen.getByRole("dialog", {hidden: true});
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    expect(within(dialog).getByText("01 / 14 · poster · halftone")).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", {name: "Next work", hidden: true}));
    expect(within(dialog).getByRole("heading", {name: "Savior", hidden: true})).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", {name: "Previous work", hidden: true}));
    await user.click(within(dialog).getByRole("button", {name: "Previous work", hidden: true}));
    expect(within(dialog).getByRole("heading", {name: "A Kiss Is the Beginning of Cannibalism", hidden: true})).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", {name: "Close", hidden: true}));
    expect(within(dialog).queryByRole("heading", {hidden: true})).not.toBeInTheDocument();
  });

  it("shows sub-projects and the live site link", () => {
    render(<Works />);
    goTo("#folder-websites");
    expect(screen.getByRole("link", {name: /LM Group Europe/})).toHaveAttribute("href", "#folder-lm-europe");
    goTo("#folder-lm-europe");
    expect(screen.getByRole("link", {name: "← Websites"})).toHaveAttribute("href", "#folder-websites");
    expect(screen.getByRole("link", {name: "llclmgroup.com ↗"})).toHaveAttribute("href", "https://llclmgroup.com");
  });

  it("resets a stale folder hash on a fresh visit", () => {
    history.replaceState(null, "", "/#folder-posters");
    render(<Works />);
    expect(location.hash).toBe("");
    expect(screen.queryByRole("heading", {name: "Posters"})).not.toBeInTheDocument();
  });
});
