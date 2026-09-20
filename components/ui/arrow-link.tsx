import type {AnchorHTMLAttributes, ReactNode} from "react";

type ArrowLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  external?: boolean;
  className?: string;
};

export function ArrowLink({children, external = false, className = "", ...props}: ArrowLinkProps) {
  return (
    <a
      {...props}
      className={`arrow-link ${className}`}
      {...(external ? {target: "_blank", rel: "noreferrer"} : {})}
    >
      <span>{children}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}
