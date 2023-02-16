import React, { forwardRef, Ref } from "react"
import Link from "next/link"
import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material"

export const NextLink = forwardRef<HTMLAnchorElement, MuiLinkProps>(
  function NextLink(props: MuiLinkProps, ref: Ref<HTMLAnchorElement>) {
    return <MuiLink component={Link} ref={ref} {...props} />
  }
)
