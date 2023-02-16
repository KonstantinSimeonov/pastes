import React, { forwardRef, Ref } from "react"
import Link, { LinkProps } from "next/link"
import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material"

type NextLinkProps = Omit<MuiLinkProps, "href" | "classes"> &
  Pick<LinkProps, "href" | "as" | "prefetch">

export const NextLink = forwardRef<HTMLAnchorElement, NextLinkProps>(
  function NextLink(
    { href, as, prefetch, ...props }: LinkProps,
    ref: Ref<HTMLAnchorElement>
  ) {
    return (
      <Link href={href} as={as} prefetch={prefetch} passHref>
        <MuiLink ref={ref} {...props} />
      </Link>
    )
  }
)
