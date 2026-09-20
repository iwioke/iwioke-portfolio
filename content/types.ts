export type Locale = "en" | "ru";

export type Localized<T> = Record<Locale, T>;

export type PortfolioCopy = {
  metadata: {
    title: string;
    description: string;
  };
  nav: {
    work: string;
    archive: string;
    about: string;
    contact: string;
    menu: string;
    closeMenu: string;
    switchLanguage: string;
    skipToContent: string;
  };
  hero: {
    eyebrow: string;
    lineOne: string;
    lineTwo: string;
    lineThree: string;
    intro: string;
    availability: string;
    viewWork: string;
    startProject: string;
    scrollHint: string;
  };
  work: {
    kicker: string;
    title: string;
    lm: {
      label: string;
      title: string;
      summary: string;
      scopeLabel: string;
      scope: string[];
      resultLabel: string;
      result: string;
      linksLabel: string;
      europe: string;
      kazakhstan: string;
      imageAlts: [string, string, string, string];
    };
    vpn: {
      label: string;
      title: string;
      summary: string;
      detail: string;
      repository: string;
      imageAlt: string;
    };
  };
  archive: {
    kicker: string;
    title: string;
    intro: string;
    open: string;
    close: string;
    previous: string;
    next: string;
    count: string;
    items: Array<{title: string; category: string; alt: string}>;
  };
  capabilities: {
    kicker: string;
    title: string;
    intro: string;
    items: Array<{number: string; title: string; description: string; list: string[]}>;
  };
  about: {
    kicker: string;
    title: string;
    body: string;
    note: string;
    locationLabel: string;
    location: string;
    availabilityLabel: string;
    availability: string;
  };
  contact: {
    kicker: string;
    title: string;
    intro: string;
    direct: string;
    form: {
      name: string;
      email: string;
      company: string;
      subject: string;
      message: string;
      consent: string;
      submit: string;
      sending: string;
      success: string;
      genericError: string;
      deliveryUnavailable: string;
      spam: string;
      validation: {
        name: string;
        email: string;
        message: string;
        consent: string;
      };
    };
  };
  footer: {
    tagline: string;
    backToTop: string;
    rights: string;
  };
};

export type Project = {
  id: "lm-group" | "iwiqovpn";
  tags: string[];
  media: string[];
  links: Array<{href: string; key: "europe" | "kazakhstan" | "repository"}>;
};

export type GalleryItem = {
  id: string;
  image: string;
};
